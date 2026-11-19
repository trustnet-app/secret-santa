# Security guards — living contract

Enforceable rules, not aspirations. A PR violating a guard does not merge;
changing a guard requires an ADR.

## Logging

- **G1. Never log sensitive values** — tokens, cookies, CSRF values, client
  secrets, wishes, or TrustNet `sub`. IDs and counts only.
- **G2. Error handlers scrub payloads** before logging.
- **G4. Dev-only behaviour** (fake login, verbose errors) is tied to
  `NODE_ENV !== "production"` and must never run where real data exists.

## Secrets

- **G5. Secrets come from runtime env files**, never from code or git.
  `*.env` files are gitignored.
- **G6. Local and production use distinct TrustNet clients.**

## Data handling

- **G7. No personal data in logs, metrics labels, or URLs.** Invite tokens are
  the only identifier allowed in a URL.
- **G8. Assignment rows are read only for the current member.** No query may
  fetch another member's `assignments` row for rendering or export.
- **G9. Fixtures are synthetic.**
- **G10. A new column storing personal data updates
  [`../06-compliance/`](../06-compliance/) in the same change.**
- **G11. `purge_deliveries` stays append-only** so webhook replays remain
  detectable.
- **G12. Expose the minimum fields.** The organiser UI never receives receiver
  identities; the wish owner never sees `claimed_by`.

## Boundaries

- **G13. Webhook endpoints are server-side only** and verify TrustNet
  signatures; they are never called from the browser.
- **G14. Validate every target:** exclusions must reference two distinct
  members of the same group; wish URLs must be `http(s)`.
- **G15. The draw is derived in exactly one place** (`src/draw.js`).
- **G16. Authorisation is server-side** (`requireUser`, `requireMember`,
  `requireOrganiser`, `requireOpen`); hidden UI controls are not controls.
- **G17. Fake login is never enabled in production** (`DEV_FAKE_LOGIN` gate).
