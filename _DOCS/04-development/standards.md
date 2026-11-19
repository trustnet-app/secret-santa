# Development standards

Quiet Santa's coding and review conventions.

## Stack and commands

- Node.js >= 22.9, ES modules, Express 4, `better-sqlite3`, `jose`.
- No build step; `src/` is served directly and `public/` is static.

```sh
npm install
npm start                                   # uses .env if present
node --env-file=oauth.env src/server.js     # explicit env file
node --check src/*.js                       # syntax check (no linter configured)
```

No lint, typecheck, or unit-test command exists yet; adding them is queued in
[`plan/queue.md`](plan/queue.md). The e2e suite is a smoke test only.

## Code organization

- `src/server.js` — routes and form actions; keep handlers thin.
- `src/auth.js` — OIDC, sessions, logout, purge; the only reader of TrustNet
  credentials.
- `src/draw.js` — pure draw algorithm; no I/O.
- `src/db.js` — schema and pragmas; the only place that opens the database.
- `src/views.js` — HTML. Every interpolated value is escaped (`esc`).
- `public/` — stylesheet plus the minimal client script.

## Review rules

- Any change touching **auth, sessions, the draw, wishes, or deletion** must
  reference the relevant flow/ADR/threat entry.
- A change that alters an architecture invariant requires an ADR first.
- Schema changes must state their migration and privacy impact; the app has no
  migration tool, so a migration plan is mandatory.

## Planning & workflow

- `plan/queue.md` — milestone queue; `plan/wip.md` — the active approved plan;
  `plan/done.md` — completed archives.
- Outcomes and verification land in [`log.md`](log.md).
- No code without an approved plan.

## Testing (baseline)

- Syntax check: `node --check src/*.js`.
- E2E: [`_TEST/`](../../_TEST/) (Playwright against `_DEV`, smoke only).
- Fixtures must be synthetic; never copy production data.
- The draw deserves deterministic unit tests (group sizes 3+, exclusions,
  impossible sets) — queued.

## Lint & typecheck

Not configured. Run `node --check src/*.js` before declaring work done, and
record any manual verification in `log.md`.
