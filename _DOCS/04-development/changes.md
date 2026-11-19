# Reported changes

Live tracker for minor change requests from the owner. Classify each one —
**design-related** changes are worked in `_DESIGN` first; everything else is
analyzed and planned first — then plan in [`plan/wip.md`](plan/wip.md),
implement, and archive in [`plan/done.md`](plan/done.md) and [`log.md`](log.md).
See the change-request workflow in [`../../CLAUDE.md`](../../CLAUDE.md).

Status: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked.

## Open

_None._

## Done

- [x] **Change 4 — Homepage style across the remaining screens.** The approved
      festive design now drives the signed-in home, join, group open, group
      drawn, and not-found screens in production, with the matching screen docs
      approved. Archived in [`plan/done.md`](plan/done.md).
- [x] **Change 3 — Festive homepage redesign.** The signed-out `/` now renders
      the approved festive landing and v3 palette from `_DESIGN`; sign-in,
      anchors, and the cancelled notice behave as documented. Archived in
      [`plan/done.md`](plan/done.md).
- [x] **Change 2 — Sign-out returns to the homepage.** Sign-out now deletes the
      local session and redirects to `/` without waiting on TrustNet's logout
      endpoint; a stale form with no session also lands on `/`. Archived in
      [`plan/done.md`](plan/done.md).
- [x] **Change 1 — Use the TrustNet nickname claim; no in-app onboarding.**
      Requested the declared `nickname` claim, removed both nickname inputs,
      seeded `members.nickname` from the claim, auto-suffixed duplicates, and
      sent a missing claim to TrustNet re-approval. Archived in
      [`plan/done.md`](plan/done.md).
- [x] **Change 0 — Documentation scaffold and local run.** Added the
      `APP_TEMPLATE` scaffold adapted to this app and rewrote `oauth.env` for
      the live TrustNet client; verified local start and the `/login` redirect.
      Archived in [`plan/done.md`](plan/done.md).
