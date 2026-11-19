# Development log

Running record of where the build actually is: what landed, what it cost, what
is deliberately not done yet. Newest first.

This is the **status** file. Intent lives in [`plan/queue.md`](plan/queue.md);
decisions belong in [ADRs](../02-architecture/decisions/); open go/no-go
questions in [`spikes.md`](../02-architecture/spikes.md).

---

## 2026-11-19 — Sign-out returns home; live claim request verified

**State:** landed / verified (local only).

- **What changed.** `POST /logout` deletes the local session, clears the cookie,
  and redirects to `/` without waiting on TrustNet's logout endpoint; a stale
  form with no local session also lands on `/`. The docs now state that the
  TrustNet SSO session is not ended from this app.
- **What was checked.** The source already requested
  `{"id_token":{"nickname":null}}`; the `:5556` process was still running the
  pre-change code. Restarted it with
  `node --env-file=oauth.env src/server.js`; the live authorization URL now
  carries `claims=%7B%22id_token%22%3A%7B%22nickname%22%3Anull%7D%7D`.
- **Verified.** `node --check src/auth.js`; dev-login sign-out redirects to `/`
  and the session is gone; a stale sign-out form also redirects to `/`; live
  `GET /` 200 and live `/login` carries the claim with the registered
  `redirect_uri`.
- **Not done.** Live TrustNet sign-in and TrustNet SSO logout were not
  exercised; sign-out is local-only by design.

---

## 2026-11-19 — TrustNet nickname claim; no in-app onboarding

**State:** landed / verified (local only; live claim pending one real sign-in).

- **What changed.** `/login` requests `{"id_token":{"nickname":null}}`;
  `sessionNickname` reads the approved claim from the stored ID token (dev login
  uses its `as=` handle). `/groups` and `/g/:token/join` no longer read
  `req.body.nickname`; they seed `members.nickname` from the claim and
  auto-suffix duplicates (`Alex`, `Alex (2)`). A missing claim shows a
  `/login?reauth=1` link (with `prompt=consent`); re-approval starts a fresh
  OIDC request and replaces the old local session. Added ADR-0002 and updated
  the sign-in/group flows, core/overview, architecture, data inventory, and
  README.
- **Verified.** `node --check src/*.js`; dev-login flow on `:5599` with a temp
  DB: create a group as `alice`, join as `bob`, no nickname inputs; a synthetic
  session with nickname `bob` joined as `bob (2)`; a session without a nickname
  showed the re-approval notice and a POST join was refused; `/login?reauth=1`
  returned a TrustNet URL with the `claims` parameter and `prompt=consent`.
- **Surprises / cost.** The live discovery document advertises
  `claims_parameter_supported:false`; TrustNet's quickstart says it still parses
  the parameter, so this is expected. Live TrustNet sign-in was not completed.
- **Not done.** Existing memberships are not renamed; later TrustNet nickname
  changes are not synced; no lint/unit/e2e gate; `_DESIGN` still has no Quiet
  Santa screens.

---

## 2026-11-19 — Callback moved to /redirect on :5556

**State:** landed / verified (local only).

- **What changed.** The OIDC callback route changed from `/auth/callback` to
  `/redirect`, and the default `BASE_URL`/`PORT` moved from `:3000` to
  `:5556` to match the registered client redirect
  `http://localhost:5556/redirect`. Updated `oauth.env`, `.env.example`,
  `_DEV`, `_TEST`, CI, README, and the runtime/architecture docs.
- **Verified.** `node --check` on `src/*.js`; `GET /` 200 on :5556;
  `GET /login` 302 to TrustNet with `redirect_uri=http://localhost:5556/redirect`.
- **Surprises / cost.** Port 5556 is normally the `trustnet-dev-mock-rp`
  container; it was stopped to free the port (restart with
  `docker start trustnet-dev-mock-rp-1`).
- **Not done.** Live sign-in completion still depends on the portal accepting
  the localhost redirect.

---

## 2026-11-19 — Documentation scaffold and local run

**State:** landed / verified (local only).

- **What changed.** Added the `_DOCS`, `_DESIGN`, `_DEV`, and `_TEST` scaffold
  from `APP_TEMPLATE`, an adapted `CLAUDE.md` with Quiet Santa invariants, a
  merged `README.md`, and project-specific docs (overview, product flows,
  architecture + ADR-0001, runtime, development, operations, compliance, open
  questions). Rewrote `oauth.env` with the variable names `src/auth.js` reads
  and the live TrustNet issuer.
- **Verified.** `npm install` succeeded (105 packages). `node
  --env-file=oauth.env src/server.js` starts and `GET /` returns 200;
  `GET /login` redirects to `https://id.trustnet.app/oauth2/auth` with
  `redirect_uri=http://localhost:3000/auth/callback`, client
  `e53af0af-…`, scope `openid`, PKCE S256.
- **Surprises / cost.** `oauth.env` arrived with generic `client_id` /
  `client_secret` / `redirect_uri` names and a `:5556/redirect` callback; port
  5556 is the TrustNet dev mock-RP container. The client id is not registered
  with the local Hydra (`:4444`), so the run uses live TrustNet.
- **Not done.** No real OIDC sign-in was completed (would hit live TrustNet);
  the portal registration for `localhost:3000/auth/callback` is unverified.
  No lint, unit, or e2e gate; `_TEST` only has the smoke spec. No screen/state
  diagrams.
- **Deviations from the plan.** `_DEV` was rewritten for a single Node origin
  (no Postgres/Redis); `_DEV/proxy` is retained only as documentation.

---
