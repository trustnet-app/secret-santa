# deployment

## Topology

| Environment | Host(s) | Purpose | Data |
|---|---|---|---|
| local | developer machine | development | throwaway |
| production | TBD — single host with persistent disk | real users | real |

There is no staging environment yet.

## Environments

- **Config source** — env vars on the host/platform (local: `oauth.env` or
  `.env`). See [`../../03-runtime/environments.md`](../../03-runtime/environments.md).
- **Differences from local** — HTTPS `BASE_URL`, `NODE_ENV=production`, no fake
  login, persistent `DATABASE_PATH`.
- **Access** — deployers only; the SQLite file and env vars are the sensitive
  assets.
- **Backups** — copy `data.sqlite` (or SQLite `.backup`) on a schedule; store
  encrypted at rest; exercise restore before launch.

## Release procedure

1. `npm ci` on the source; no build artifact.
2. Stop the app (SQLite backup first).
3. Update env vars if the release changes configuration.
4. Start with `NODE_ENV=production node src/server.js`.
5. Smoke: `GET /` is 200 and `GET /login` redirects to TrustNet with the
   expected `redirect_uri`.
6. Rollback: stop, restore the previous source and `data.sqlite` backup, start.

## Config / credential parity checklist

- [ ] `BASE_URL` matches the registered TrustNet redirect exactly.
- [ ] `NODE_ENV=production`.
- [ ] `DATABASE_PATH` on persistent storage with backup enabled.
- [ ] TrustNet back-channel logout and purge URLs reachable publicly.
- [ ] Production `TRUSTNET_CLIENT_ID/SECRET` distinct from local.
