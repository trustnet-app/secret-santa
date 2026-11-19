# Open Questions — Resolution Plan

How the project addresses the open questions tracked in [`index.md`](index.md).

Process: pick a workstream → resolve the questions in the **source docs**
(decision, `[x]` flip, changelog per `../AGENTS.md`) → sync `index.md` in the
same change → commit. A question is resolved when its source doc no longer
lists it **and** the index no longer lists it.

Priorities: **blockers first**, then non-blockers grouped by milestone.

## Workstream 1 — Blockers

- ~~TrustNet callback registration~~ — resolved 2026-11-19: the app now runs
  on `:5556` and serves the callback at `/redirect`, matching the registered
  `http://localhost:5556/redirect`.
- **Schema migrations** (`02-architecture/services/app.md`) — write ADR-0002 for
  a versioned migration approach (`PRAGMA user_version` + ordered SQL), then
  implement in milestone M2.

## Workstream 2 — Product and abuse

- **Invite expiry/revocation** (`02-architecture/threat-model.md`) — decide
  whether tokens expire or can be rotated, then implement in M3.
- **Rate limiting** (`02-architecture/threat-model.md`) — choose limits for
  login, join, and wish posts in M3.

## Workstream 3 — Compliance

- **Retention of wishes and assignments** (`06-compliance/README.md`) — decide a
  retention rule and a group-deletion path; add to the data inventory.

## Definition of done

- Every open item is resolved in its source doc and this index, or carried into
  `04-development/plan/queue.md` as a milestone item.
- The blocker count is zero before a production release.
