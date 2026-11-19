# Reported changes

Live tracker for minor change requests from the owner. Classify each one —
**design-related** changes are worked in `_DESIGN` first; everything else is
analyzed and planned first — then plan in [`plan/wip.md`](plan/wip.md),
implement, and archive in [`plan/done.md`](plan/done.md) and [`log.md`](log.md).
See the change-request workflow in [`../../CLAUDE.md`](../../CLAUDE.md).

Status: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked.

## Open

_None reported._

## Done

- [x] **Change 1 — Use the TrustNet nickname claim; no in-app onboarding.**
      Requested the declared `nickname` claim, removed both nickname inputs,
      seeded `members.nickname` from the claim, auto-suffixed duplicates, and
      sent a missing claim to TrustNet re-approval. Archived in
      [`plan/done.md`](plan/done.md).
- [x] **Change 0 — Documentation scaffold and local run.** Added the
      `APP_TEMPLATE` scaffold adapted to this app and rewrote `oauth.env` for
      the live TrustNet client; verified local start and the `/login` redirect.
      Archived in [`plan/done.md`](plan/done.md).
