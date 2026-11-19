# Implementation plan

The main queue of plans. When a section is in focus, a detailed plan is written
in [`wip.md`](wip.md). Completed sections are archived in [`done.md`](done.md).

The plan is refined with and approved by the project owner **before**
implementation — see [`../../../CLAUDE.md`](../../../CLAUDE.md). Progress and
outcomes are recorded in [`log.md`](../log.md); this file holds intent.

Status legend: `[ ]` planned · `[~]` in progress / awaiting confirmation ·
`[x]` done (logged) · `[!]` blocked / dropped.

---

## Milestones

- [ ] **M1 — Verification gate.** Add `node --check` CI, a minimal unit suite
      for `src/draw.js` (3+ members, exclusions, impossible sets), and wire the
      Playwright smoke to `_DEV`. Exit criteria: CI runs on every push.
- [ ] **M2 — Schema migrations.** Introduce a versioned migration step (e.g.
      `PRAGMA user_version` + ordered SQL) so new columns apply to existing
      `data.sqlite` files. ADR required.
- [ ] **M3 — Abuse controls.** Rate-limit `/login`, join, and wish posts; decide
      invite-token expiry/revocation. Threat entries T4/T6.
- [ ] **M4 — Product docs.** Screen docs for landing, home, join, group (open and
      drawn states), and sequence diagrams for callback/logout/purge.
- [ ] **M5 — Operator basics.** Health endpoint, session sweep, backup runbook,
      and a staging environment decision.

---

## Open change requests

_None._

## Completed change requests

- [x] **Change 1 — Use the TrustNet nickname claim.** Removed in-app nickname
      onboarding, requested the declared `nickname` claim, and seeded
      membership names from it (auto-suffix duplicates). Archived in
      [`done.md`](done.md).

---

## Cross-cutting / standing items

- **CI from day one**, not at the end.
- **Logging discipline** — every part records verified vs merely written.
- **Docs stay in sync** — behaviour changes update the matching doc.

---

## Completed

Archived in [`done.md`](done.md) with detail in [`log.md`](../log.md).
