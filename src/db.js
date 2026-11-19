import Database from "better-sqlite3";

const db = new Database(process.env.DATABASE_PATH || "./data.sqlite");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  sub TEXT NOT NULL UNIQUE,              -- TrustNet PPID, the only identity we hold
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sid TEXT,                              -- TrustNet session id, for back-channel logout
  id_token TEXT,                         -- kept only as the logout hint
  csrf TEXT NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_sid ON sessions(sid);
CREATE TABLE IF NOT EXISTS auth_requests (
  state TEXT PRIMARY KEY,
  nonce TEXT NOT NULL,
  verifier TEXT NOT NULL,
  return_to TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch())
);
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,            -- unguessable; the invite link
  name TEXT NOT NULL,
  budget TEXT,
  exchange_date TEXT,
  organiser_id INTEGER NOT NULL REFERENCES users(id),
  drawn_at INTEGER
);
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  nickname TEXT NOT NULL,
  UNIQUE (group_id, user_id)
);
CREATE TABLE IF NOT EXISTS exclusions (
  id INTEGER PRIMARY KEY,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  a INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  b INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS assignments (
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  giver_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, giver_id)
);
CREATE TABLE IF NOT EXISTS wishes (
  id INTEGER PRIMARY KEY,
  member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  url TEXT,
  claimed_by INTEGER REFERENCES members(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS purge_deliveries (
  delivery_id TEXT PRIMARY KEY
);
`);

export default db;
