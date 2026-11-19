# app — the single deployable service

## Responsibility

Serves the Quiet Santa pages and form actions, runs the OIDC sign-in with
TrustNet, keeps sessions, receives TrustNet webhooks, and performs the draw.

## Owns

- All HTML rendering and form handling (`src/server.js`, `src/views.js`).
- The TrustNet OIDC client and session lifecycle (`src/auth.js`).
- The draw algorithm and its exclusion retries (`src/draw.js`).
- The SQLite schema and file (`src/db.js`, `DATABASE_PATH`).

## Does NOT own

- Identity, authentication factors, and the pairwise subject — owned by
  TrustNet (live issuer `https://id.trustnet.app`).
- Email delivery, reminders, or any contact channel — deliberately absent.
- Deployment, TLS termination, and backups — see
  [`../../05-operations/`](../../05-operations/).

## Interfaces

| Interface | Direction | Contract |
|---|---|---|
| HTTP pages and forms | inbound | Routes in `src/server.js` |
| `GET /login`, `GET /redirect` | inbound from browser/TrustNet | OIDC authorization code + PKCE; requests the `nickname` claim |
| `POST /auth/backchannel-logout` | inbound from TrustNet | Signed logout token; deletes by `sid` |
| `POST /auth/purge` | inbound from TrustNet | Signed erasure event; deletes by subject |
| `GET /dev/login?as=` | inbound, dev only | Disabled when `NODE_ENV=production` |
| TrustNet token/JWKS endpoints | outbound | `TRUSTNET_ISSUER`, `TRUSTNET_WEBHOOK_JWKS` |

## Data

| Store | Data | Notes |
|---|---|---|
| SQLite `users` | TrustNet `sub` | Pseudonymous; the only identity |
| SQLite `sessions` | session id, `sid`, `id_token`, CSRF, expiry | The ID token is the logout hint and carries the approved nickname claim |
| SQLite `groups`, `members` | names/nicknames, budget, date, token | Nickname comes from the TrustNet claim; `token` is unguessable |
| SQLite `wishes` | text, URL, claimant | Free text may contain personal data; treat as sensitive |
| SQLite `exclusions`, `assignments` | member ids | The assignment is the protected secret |
| SQLite `purge_deliveries` | delivery id | Replay guard |

## Failure and scaling notes

- Single process, single file; scale is vertical. A crash loses nothing past
  the last committed SQLite write (WAL).
- If TrustNet is unreachable, existing sessions keep working until expiry;
  new sign-ins fail closed.
- The SQLite file must sit on persistent storage; ephemeral disks lose all data.

## Open questions

- [ ] Schema migrations: the app only runs `CREATE TABLE IF NOT EXISTS`; adding
      a column silently does nothing on existing files. Tracked in
      [`../../07-open_questions/index.md`](../../07-open_questions/index.md).
