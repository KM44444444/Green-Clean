const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/wallet - balance + transaction history for the logged-in user.
router.get('/', requireAuth, (req, res) => {
  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  const transactions = db
    .prepare('SELECT * FROM wallet_transactions WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json({ balance: user ? user.points : 0, transactions });
});

// GET /api/wallet/rewards - active reward catalog.
router.get('/rewards', requireAuth, (req, res) => {
  const rewards = db.prepare('SELECT * FROM rewards WHERE active = 1 ORDER BY cost_points ASC').all();
  res.json({ rewards });
});

// POST /api/wallet/redeem - spend points on a reward.
router.post('/redeem', requireAuth, (req, res) => {
  const { rewardId } = req.body;
  if (!rewardId) return res.status(400).json({ error: 'rewardId is required' });

  const reward = db.prepare('SELECT * FROM rewards WHERE id = ? AND active = 1').get(rewardId);
  if (!reward) return res.status(404).json({ error: 'Reward not found' });

  const user = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  if (!user || user.points < reward.cost_points) {
    return res.status(400).json({ error: 'Not enough points for this reward' });
  }

  const tx = db.transaction(() => {
    db.prepare('UPDATE users SET points = points - ? WHERE id = ?').run(reward.cost_points, req.user.id);
    db.prepare(
      `INSERT INTO wallet_transactions (user_id, type, points, description) VALUES (?, 'redeem', ?, ?)`
    ).run(req.user.id, -reward.cost_points, `Redeemed: ${reward.name}`);
  });
  tx();

  const updated = db.prepare('SELECT points FROM users WHERE id = ?').get(req.user.id);
  res.json({ balance: updated.points, redeemed: reward.name });
});

module.exports = router;
