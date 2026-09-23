const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 8 * 1024 * 1024 } });

// Fixed point values, mirrors the old frontend-only table but now authoritative server-side.
const OLD_ITEM_POINTS = {
  newspaperBundle: 30,
  oilCans: 20,
  lamps: 60,
  smallElectricalWires: 50,
};
const STREET_WASTE_POINTS = 5;
const DAILY_UPLOAD_LIMIT = 2;

function calculatePoints(category, itemType, weight) {
  if (category === 'oldHousehold') {
    if (itemType === 'largeAppliance') return weight ? Math.round(weight * 0.2) : 0;
    return OLD_ITEM_POINTS[itemType] || 0;
  }
  return STREET_WASTE_POINTS;
}

let visionClient = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const vision = require('@google-cloud/vision');
    visionClient = new vision.ImageAnnotatorClient();
  }
} catch (e) {
  console.warn('Google Cloud Vision not configured. Image validation disabled.');
}

async function checkImageForGarbage(filePath) {
  if (!visionClient) return true; // validation disabled locally
  const [result] = await visionClient.labelDetection(filePath);
  const labels = result.labelAnnotations || [];
  const garbageKeywords = ['garbage', 'trash', 'waste', 'dump', 'refuse'];
  return labels.some((l) => garbageKeywords.includes((l.description || '').toLowerCase()));
}

function getDateString(date) {
  return date.toISOString().slice(0, 10);
}

// POST /api/reports - create a waste report (citizens only), with photo + points + daily limit.
router.post('/', requireAuth, requireRole('user'), upload.single('photo'), async (req, res) => {
  try {
    const { category, itemType, weight, description, lat, lng, city } = req.body;
    if (!category) return res.status(400).json({ error: 'category is required' });
    if (!req.file) return res.status(400).json({ error: 'photo is required' });
    if (lat === undefined || lng === undefined) return res.status(400).json({ error: 'location is required' });

    const today = getDateString(new Date());
    const countToday = db
      .prepare(
        `SELECT COUNT(*) AS c FROM reports WHERE user_id = ? AND date(created_at) = ?`
      )
      .get(req.user.id, today).c;
    if (countToday >= DAILY_UPLOAD_LIMIT) {
      return res.status(400).json({ error: 'Upload limit reached for today.' });
    }

    const isGarbage = await checkImageForGarbage(req.file.path);
    if (!isGarbage) {
      return res.status(400).json({ error: 'Please upload photos of garbage only.' });
    }

    const points = calculatePoints(category, itemType, weight ? Number(weight) : undefined);

    const info = db
      .prepare(
        `INSERT INTO reports (user_id, category, item_type, weight, description, lat, lng, city, photo_path, points_awarded)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        req.user.id,
        category,
        itemType || null,
        weight ? Number(weight) : null,
        description || null,
        Number(lat),
        Number(lng),
        city || req.user.city || null,
        req.file.path,
        points
      );

    if (points > 0) {
      db.prepare('UPDATE users SET points = points + ? WHERE id = ?').run(points, req.user.id);
      db.prepare(
        `INSERT INTO wallet_transactions (user_id, type, points, description) VALUES (?, 'earn', ?, ?)`
      ).run(req.user.id, points, `Report #${info.lastInsertRowid} submitted`);
    }

    // Notify workers in the same city.
    if (city || req.user.city) {
      db.prepare(`INSERT INTO notifications (city, message) VALUES (?, ?)`).run(
        city || req.user.city,
        `New waste report submitted near you (Report #${info.lastInsertRowid}).`
      );
    }

    const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ report, pointsAwarded: points, uploadsToday: countToday + 1 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/reports/mine - citizen's own reports.
router.get('/mine', requireAuth, (req, res) => {
  const reports = db
    .prepare('SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ reports });
});

// GET /api/reports - admin/worker scoped list (worker sees own city only).
router.get('/', requireAuth, requireRole('worker', 'admin'), (req, res) => {
  let reports;
  if (req.user.role === 'worker') {
    reports = db
      .prepare(
        `SELECT r.*, u.name AS reporter_name FROM reports r
         JOIN users u ON u.id = r.user_id
         WHERE r.city = ? ORDER BY r.created_at DESC`
      )
      .all(req.user.city);
  } else {
    reports = db
      .prepare(
        `SELECT r.*, u.name AS reporter_name FROM reports r
         JOIN users u ON u.id = r.user_id
         ORDER BY r.created_at DESC`
      )
      .all();
  }
  res.json({ reports });
});

module.exports = router;
