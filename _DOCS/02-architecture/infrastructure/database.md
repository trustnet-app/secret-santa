# Database — SQLite

- **Engine:** SQLite via `better-sqlite3`, one file at `DATABASE_PATH`
  (default `./data.sqlite`).
- **Pragmas:** `journal_mode = WAL`, `foreign_keys = ON` (`src/db.js`).
- **Schema creation:** idempotent `CREATE TABLE IF NOT EXISTS` on boot. There
  is no migration tool; schema evolution is an open question.
- **Tables:** `users`, `sessions`, `auth_requests`, `groups`, `members`,
  `wishes`, `exclusions`, `assignments`, `purge_deliveries`.
- **Sensitive rows:** `assignments` (who draws whom), `wishes` (free text),
  `sessions` (`id_token`). Database access defeats the organiser-privacy
  guarantee.

## Backups

- Copy the `.sqlite` file while the app is stopped, or use SQLite's online
  backup (`sqlite3 data.sqlite ".backup backup.sqlite"`).
- Keep backups encrypted at rest; they contain assignments and wishes.
- Restoring is only supported into the same app version (no migrations yet).

## Retention

- Sessions expire per `sessions.expires_at`; expired rows are not yet swept.
- Deletion is driven by the TrustNet purge webhook and group deletion (not yet
  implemented). See `_DOCS/06-compliance/`.
