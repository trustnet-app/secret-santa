# `_TEST/` — end-to-end suite

Playwright, host Node, driving a **real browser** through the real screens
against the app started from `_DEV`. This is the regression net for Quiet
Santa's critical journeys.

```sh
cd _DEV && make e2e-full     # app up + suite
# app already up:
cd _DEV && make e2e
cd _DEV && make e2e-deps     # install browser + OS dependencies only
```

Default origin: `http://localhost:5556` (override with `APP_ORIGIN`).

## Layout

Specs are grouped by product capability. Keep non-spec helpers in `support/`
and cross-cutting infra checks in `platform/`.

| Folder | Covers |
|---|---|
| `auth/` | TrustNet sign-in start, fake login, sign-out |
| `registration/` | Group creation and joining (no email sign-up) |
| `consent/` | Reserved — no consent screen in this product |
| `dashboard/` | Signed-in group pages: wishes, claims, draw |
| `platform/` | Serving headers, smoke |
| `support/` | Shared helpers (no specs) |

## What each spec is for

| Spec | Asserts |
|---|---|
| `platform/01-smoke` | The app answers on the single origin |
| `_<capability>/…` | `<one line: the user outcome and the invariant it pins>` |

## Around every run

- **`global-setup.ts` preflight** polls the origin for `E2E_WAIT_MS` (default
  20s) so a stack that is down fails in seconds, naming the missing service.
- **Reset state per test.** Each spec's `beforeEach` resets what it depends on.
- **`global-teardown.ts` cleans up** best-effort; `E2E_KEEP_STATE=1` skips it.

## Things that look like tuning but are not

- **`workers: 1`.** Shared server-side state makes parallel flows interleave.
- **`data-testid` selectors only.** Behaviour stays stable across UI rewrites.
- **Distinct identities for cross-account tests.** The fake login
  (`/dev/login?as=…`) provides them; a test proving isolation must assert its
  premise.

## Not covered here

- Unit and integration tests (they live with the code; none yet).
- Visual regression and accessibility assertions, unless added explicitly.
