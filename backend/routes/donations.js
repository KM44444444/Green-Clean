const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir, limits: { fileSize: 8 * 1024 * 1024 } });

// POST /api/donations - submit an item for reuse/recycling.
router.post('/', requireAuth, upload.single('photo'), (req, res) => {
  const { itemType, quantity, condition, description } = req.body;
  if (!itemType) return res.status(400).json({ error: 'itemType is required' });

  const info = db
    .prepare(
      `INSERT INTO donations (user_id, item_type, quantity, condition, description, photo_path)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      req.user.id,
      itemType,
      quantity ? Number(quantity) : 1,
      condition || null,
      description || null,
      req.file ? req.file.path : null
    );

  const donation = db.prepare('SELECT * FROM donations WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ donation });
});

// GET /api/donations/mine
router.get('/mine', requireAuth, (req, res) => {
  const donations = db
    .prepare('SELECT * FROM donations WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ donations });
});

module.exports = router;
