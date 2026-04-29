const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");

const dbPath = process.env.SQLITE_DB_PATH || (process.env.VERCEL ? "/tmp/bridge.sqlite" : path.join(process.cwd(), "data", "bridge.sqlite"));
fs.mkdirSync(path.dirname(dbPath), { recursive: true });
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  institution TEXT DEFAULT '',
  roll_number TEXT DEFAULT '',
  role TEXT DEFAULT 'Student',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  experiment_id TEXT NOT NULL,
  components TEXT NOT NULL DEFAULT '[]',
  wires TEXT NOT NULL DEFAULT '[]',
  title TEXT DEFAULT '',
  completed_steps TEXT NOT NULL DEFAULT '[]',
  total_steps INTEGER NOT NULL DEFAULT 0,
  is_validated INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  score INTEGER,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, experiment_id)
);
`);

const columns = db.prepare("PRAGMA table_info(progress)").all().map(column => column.name);
const addColumn = (name, definition) => {
  if (!columns.includes(name)) {
    db.prepare(`ALTER TABLE progress ADD COLUMN ${name} ${definition}`).run();
  }
};

addColumn("title", "TEXT DEFAULT ''");
addColumn("completed_steps", "TEXT NOT NULL DEFAULT '[]'");
addColumn("total_steps", "INTEGER NOT NULL DEFAULT 0");
addColumn("is_validated", "INTEGER NOT NULL DEFAULT 0");
addColumn("time_spent", "INTEGER NOT NULL DEFAULT 0");
addColumn("score", "INTEGER");

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const publicUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar || undefined,
  institution: user.institution || "",
  rollNumber: user.roll_number || "",
  role: user.role || "Student",
  joinedAt: user.created_at,
});

const publicProgress = (row) => ({
  id: row.experiment_id,
  title: row.title || row.experiment_id,
  completedSteps: JSON.parse(row.completed_steps || "[]"),
  totalSteps: row.total_steps || 0,
  isValidated: Boolean(row.is_validated),
  lastModified: row.updated_at,
  timeSpent: row.time_spent || 0,
  attemptCount: 1,
  score: row.score,
});

module.exports = {
  db,
  hashToken,
  publicUser,
  publicProgress,
};
