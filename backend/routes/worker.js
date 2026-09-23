const express = require('express');
const db = require('../db');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All worker routes require a verified worker account.
function requireVerifiedWorker(req, res, next) {
  const user = db.prepare('SELECT verified FROM users WHERE id = ?').get(req.user.id);
  if (!user || !user.verified) {
    return res.status(403).json({ error: 'Your worker account is awaiting admin approval.' });
  }
  next();
}

router.use(requireAuth, requireRole('worker'), requireVerifiedWorker);

// GET /api/worker/tasks - pending/assigned reports in the worker's city.
router.get('/tasks', (req, res) => {
  const tasks = db
    .prepare(
      `SELECT r.*, u.name AS reporter_name FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.city = ? AND r.status IN ('pending','assigned')
       ORDER BY r.created_at ASC`
    )
    .all(req.user.city);
  res.json({ tasks });
});

// POST /api/worker/tasks/:id/claim - assign a pending report to this worker.
router.post('/tasks/:id/claim', (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report || report.city !== req.user.city) return res.status(404).json({ error: 'Task not found' });
  if (report.status !== 'pending') return res.status(400).json({ error: 'Task already claimed or resolved' });

  db.prepare(
    `UPDATE reports SET status = 'assigned', assigned_worker_id = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(req.user.id, report.id);
  res.json({ message: 'Task claimed' });
});

// POST /api/worker/tasks/:id/complete - mark a report as cleaned.
router.post('/tasks/:id/complete', (req, res) => {
  const report = db.prepare('SELECT * FROM reports WHERE id = ?').get(req.params.id);
  if (!report || report.assigned_worker_id !== req.user.id) {
    return res.status(404).json({ error: 'Task not found or not assigned to you' });
  }
  db.prepare(
    `UPDATE reports SET status = 'cleaned', updated_at = datetime('now') WHERE id = ?`
  ).run(report.id);
  res.json({ message: 'Task marked as completed' });
});

// GET /api/worker/notifications - city-wide notifications for this worker.
router.get('/notifications', (req, res) => {
  const notifications = db
    .prepare('SELECT * FROM notifications WHERE city = ? ORDER BY created_at DESC LIMIT 50')
    .all(req.user.city);
  res.json({ notifications });
});

// GET /api/worker/stats - simple summary for the worker's own dashboard section.
router.get('/stats', (req, res) => {
  const completed = db
    .prepare(`SELECT COUNT(*) AS c FROM reports WHERE assigned_worker_id = ? AND status = 'cleaned'`)
    .get(req.user.id).c;
  const pending = db
    .prepare(`SELECT COUNT(*) AS c FROM reports WHERE assigned_worker_id = ? AND status = 'assigned'`)
    .get(req.user.id).c;
  res.json({ completed, pending });
});

module.exports = router;
