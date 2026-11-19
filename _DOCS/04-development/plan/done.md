# Completed plans

Reference plan with done points. Newest first.

## Festive design across every screen `[x]`

**Done 2026-11-19.** Owner-requested Change 4; owner reviewed the `_DESIGN`
renderings and asked to proceed with the design implementation on all pages.

- **Problem.** Only the signed-out landing used the festive v3 design; the
  signed-in home, invite, group open, group drawn, and 404 pages still used the
  old production UI.
- **Change.** Replaced `views.layout` with the `_DESIGN` product shell and
  reproduced the approved templates in `views.home`, `views.join`,
  `views.group`, and a new `views.notFound`; both 404 routes now use the shell.
  `public/style.css` carries the v3 `.qs-page` tokens and the shared `qs-*`
  component layer; `public/app.js` selects `.qs-copy`. The five new screen docs
  were approved and the design catalogue state caught up.
- **Tests.** `node --check` on the changed JS; dev-login flows for create, join,
  organiser/member, open/drawn, wishes, claims, exclusions, draw, flash errors,
  nickname-missing states, and both 404s.
- **Verified.** Playwright at 1440px (light and dark) and 390px; landing parity
  after the base-rule cleanup; no CSP errors beyond the expected 404 documents.
- **Not done.** Live TrustNet sign-in; sequence diagrams (M4).

## Festive landing ported to production `[x]`

**Done 2026-11-19.** Owner-requested Change 3.

- **Problem.** The approved festive landing existed only in `_DESIGN`; the
  production `/` still used the old generic hero.
- **Change.** Moved the `_DESIGN` markup into `views.landing`, added a
  full-bleed layout option for the signed-out landing, and added the v3 tokens
  and landing rules to `public/style.css`. "Start a group" and "Sign in" go to
  `/login`; the `?cancelled=1` notice is preserved above the hero. Inline snow
  styles became modifier classes so the CSP stays `default-src 'self'`.
- **Tests.** `node --check src/views.js src/server.js`; `GET /` 200; two
  `/login` links; cancelled notice renders; `/nope` 404 and `/login` keep the
  shared shell.
- **Verified.** Playwright at 1440px (light and dark) and 390px, plus the
  cancelled state; no CSP or console errors beyond the pre-existing favicon
  404.
- **Not done.** The other screens are still on the production UI only.

## Sign-out returns to the homepage `[x]`

**Done 2026-11-19.** Owner-requested Change 2.

- **Problem.** Sign-out redirected through the TrustNet logout endpoint, so the
  browser did not reliably land on the Quiet Santa homepage. A stale form with
  no local session returned a 403 instead of finishing sign-out.
- **Change.** `POST /logout` deletes the local session, clears the cookie, and
  redirects to `/`; no local session also redirects to `/`. TrustNet SSO is not
  ended from this app, and the docs now say so.
- **Tests.** Dev-login sign-out redirects to `/`; stale form with no session
  also redirects to `/`.
- **Verified.** Local only; live TrustNet login/logout was not exercised.
- **Not done.** Ending the TrustNet SSO session from the app (would need the
  provider's post-logout flow and a registered redirect).

## TrustNet nickname claim `[x]`

**Done 2026-11-19.** Owner-approved Change 1.

- **Problem.** The app asked everyone to type a nickname when creating or
  joining a group, even though TrustNet already declares and can share a
  `nickname` claim.
- **Change.** Requested the claim at `/login`; seed `members.nickname` from the
  stored ID token (dev login uses its `as=` handle); removed both nickname
  inputs; auto-suffixed duplicates; added a TrustNet re-approval path for a
  missing claim; recorded ADR-0002 and updated the flows, architecture, data
  inventory, and README.
- **Tests.** `node --check src/*.js`; dev-login create/join; duplicate suffix
  (`bob`, `bob (2)`); missing-claim notices and refused join; `/login?reauth=1`
  URL contains the `claims` parameter and `prompt=consent`.
- **Verified.** Local only. Live claim disclosure needs one real TrustNet
  sign-in.
- **Not done.** Existing memberships are not renamed; later TrustNet nickname
  changes are not synced; `_DESIGN` still has no Quiet Santa screens.

## Documentation scaffold and local run `[x]`

**Done 2026-11-19.** Owner-approved scope: full scaffold adapted to the
Node/Express/SQLite app.

- **Problem.** The app had code and a short README but no documented-first
  repo structure; `oauth.env` used variable names the app does not read.
- **Change.** Added `_DOCS`, `_DESIGN`, `_DEV`, `_TEST`, `.github`, `AGENTS.md`,
  and an adapted `CLAUDE.md`/`README.md`. Rewrote `_DEV` for a single Node
  origin. Rewrote `oauth.env` as `TRUSTNET_*` + live issuer.
- **Tests.** `npm install`; `node --env-file=oauth.env src/server.js`;
  `GET /` 200; `GET /login` 302 to `https://id.trustnet.app`.
- **Verified.** Local start only; live sign-in completion not exercised.
- **Not done.** Lint/unit/e2e gates, screen/state diagrams, migrations,
  rate limiting — queued in [`queue.md`](queue.md).
