// SQLite database setup + schema + seed data for Green & Clean.
// Uses better-sqlite3 (synchronous, zero external services required).
require('dotenv').config();
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'greenclean.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user','worker','admin')),
  state TEXT,
  city TEXT,
  verified INTEGER NOT NULL DEFAULT 1, -- workers default 0 (set at signup), users/admins default 1
  points INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  category TEXT NOT NULL, -- streetWaste | oldHousehold
  item_type TEXT,
  weight REAL,
  description TEXT,
  lat REAL,
  lng REAL,
  city TEXT,
  photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','assigned','cleaned','rejected')),
  assigned_worker_id INTEGER REFERENCES users(id),
  points_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  item_type TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  condition TEXT,
  description TEXT,
  photo_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','matched','collected')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK(type IN ('earn','redeem')),
  points INTEGER NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id), -- null = broadcast to a city's workers
  city TEXT,
  message TEXT NOT NULL,
  read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  cost_points INTEGER NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);
`);

// Seed a default reward catalog once.
const rewardCount = db.prepare('SELECT COUNT(*) AS c FROM rewards').get().c;
if (rewardCount === 0) {
  const insert = db.prepare(
    'INSERT INTO rewards (name, description, cost_points, active) VALUES (?, ?, ?, 1)'
  );
  const seedRewards = [
    ['10% off eco-store', 'Discount coupon for partner eco-friendly stores', 100],
    ['Free sapling', 'Redeem for a sapling to plant in your area', 50],
    ['Reusable tote bag', 'Green & Clean branded reusable tote bag', 150],
    ['Metro travel voucher', 'Voucher towards local public transport', 300],
  ];
  const tx = db.transaction((rows) => rows.forEach((r) => insert.run(...r)));
  tx(seedRewards);
}

module.exports = db;
