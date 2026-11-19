# Development log

Running record of where the build actually is: what landed, what it cost, what
is deliberately not done yet. Newest first.

This is the **status** file. Intent lives in [`plan/queue.md`](plan/queue.md);
decisions belong in [ADRs](../02-architecture/decisions/); open go/no-go
questions in [`spikes.md`](../02-architecture/spikes.md).

---

## 2026-11-19 — Festive design ported to every screen

**State:** landed / verified (local only).

- **What changed.** Replaced the production shell with the `_DESIGN` product
  shell (`qs-*` layer): `views.layout` renders the festive nav, `main.qs-main`,
  and footer; `views.home`, `views.join`, `views.group`, and a new
  `views.notFound` reproduce the approved templates; the two 404 routes now use
  the product shell. `public/style.css` gains the v3 `.qs-page` token block and
  the shared `qs-*` component layer, and the legacy generic UI rules are gone.
  `public/app.js` selects the new `.qs-copy` fields. All five new screen docs
  moved from `draft` to `approved` on the owner's go-ahead.
- **Verified.** `node --check src/views.js src/server.js public/app.js`.
  Dev-login run on `:5599` against a temp DB: landing parity; empty and
  populated home; group create; join signed-out/signed-in/closed/nickname;
  organiser and member open; exclusion; draw; organiser and member drawn;
  reveal; wish add/claim/taken; flash error; both 404s. Playwright at 1440px
  (light and dark) and 390px; dark tokens, layout, and focus rings checked; no
  CSP errors (only the expected 404 document responses on the 404 routes).
- **Surprises / cost.** The `.santa-page` and `.qs-page` token blocks are
  intentionally separate; the legacy global base rules had to go so browser
  default paragraph margins match the design. No behaviour change.
- **Not done.** No live TrustNet sign-in; sequence diagrams remain (M4).

---

## 2026-11-19 — Festive design system across the remaining screens (design)

**State:** design review (not ported to production).

- **What changed.** Added `_DESIGN/styles/app.css` (shared festive component
  layer) and `_DESIGN/src/layouts/app.html` (product nav/footer shell). New
  screens: `home-signed-in.html`, `join.html`, `group-open.html`,
  `group-drawn.html`, and `not-found.html`, each with a catalogue-only state
  bar. Added `playground/product.html` (v3 component preview). New draft screen
  docs: `screen-home-signed-in`, `screen-join`, `screen-group-open`,
  `screen-group-drawn`, `screen-not-found`; updated the product index, design
  plan, and open-questions index (the "which screens" question is resolved).
  Refined `_DESIGN/decisions.md` #8 and added #9 (v3 product palette; one shared
  product layer). The landing CSS moved into the shared layer with no visual
  change.
- **Verified.** `python3 _DESIGN/build.py` (internal-link check) passes.
  Playwright at 1440px and 390px, light and dark, across every screen and state:
  groups/empty/nickname, join signed-out/signed-in/nickname/closed,
  organiser/member for open and drawn, 404 generic/bad-invite. State bar toggles
  panels, `data-view`, and the nav auth action; organiser-only regions hide for
  members. Landing visual parity checked after the CSS extraction.
- **Surprises / cost.** The verification browser served a stale `base.css` from
  disk cache; a fresh origin was needed to confirm the state-bar rules. No
  production code changed.
- **Not done.** Production port (Part 2 of Change 4) waits for owner review. The
  new screen docs are `draft`; state and sequence docs remain (M4).

---

## 2026-11-19 — Festive landing ported to production

**State:** landed / verified (local only).

- **What changed.** The signed-out `/` now renders the approved `_DESIGN`
  festive landing (`home.html`, v3 palette). `views.landing` carries the
  markup; `layout` gained a full-bleed option so the landing keeps its own nav
  and footer; `public/style.css` carries the v3 tokens, light/dark variants,
  and landing rules. "Start a group" and "Sign in" go to `/login`; the
  `?cancelled=1` notice is preserved above the hero. Inline snow styles became
  `santa-snow--*` classes, so the CSP still uses `default-src 'self'`.
- **Verified.** `node --check src/views.js src/server.js`; `GET /` 200; two
  `/login` links; cancelled notice renders; `/nope` 404 and `/login` still use
  the shared shell. Playwright at 1440px light and dark plus 390px, and the
  cancelled state; no CSP or console errors (only the pre-existing missing
  favicon).
- **Surprises / cost.** None beyond the scoped token block; the landing is the
  only full-bleed screen, so the signed-in and group pages are untouched.
- **Not done.** The signed-in home, join, and group screens still have only the
  production UI; tracked in [`design/plan.md`](../design/plan.md).

---

## 2026-11-19 — Festive landing design for review

**State:** design review (not implemented in production).

- **What changed.** Added `_DESIGN/styles/v3/theme.css` (seasonal pine, cream,
  cranberry, and antique gold), `_DESIGN/src/pages/screens/home.html` (the
  signed-out landing with a "Free to use" marker), the `screen-home` doc, and
  the catalogue/decision/index entries. Fixed the catalogue head so page titles
  and page CSS can override the shell; a screen can lock a palette with
  `data-style-lock`.
- **Verified.** `python3 _DESIGN/build.py` passes. Inspected light, dark, and
  390px mobile renderings in Playwright, including the free-service badge. No
  production code changed.
- **Surprises / cost.** Stitch is authenticated and project
  `13018025575239137304` was created, but the MCP screen-generation call timed
  out twice and no screen was created. Workspace creation is not exposed by the
  MCP tools, and the `stitch` CLI is not installed.
- **Not done.** Production port pending owner review of
  `http://localhost:8000/screens/home.html`; the other screens are still only in
  the production UI.

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
