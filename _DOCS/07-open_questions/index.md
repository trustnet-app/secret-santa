# Open Questions — Index

Every open question in `_DOCS` is tracked here, organized by the source file.
This is the single source of truth for what is unresolved; the source docs
carry the detail.

**Tags:** `blocker` = must be resolved before the referenced surface can be
promoted or before a named milestone proceeds. `non-blocker` = deferred detail
or follow-up.

**Counts:** 1 blocker · 3 non-blockers · 4 total (2026-11-19).

---

## `_DOCS/02-architecture/services/app.md`

- [blocker] **How are schema changes applied to an existing `data.sqlite`?**
  — the app only runs `CREATE TABLE IF NOT EXISTS`; new columns silently do not
  apply. Source: *Open questions* (milestone M2).

## `_DOCS/02-architecture/threat-model.md`

- [non-blocker] **Is invite-link access acceptable without expiry/revocation?**
  — anyone with the link can join while the group is open.
- [non-blocker] **Should join and sign-in attempts be rate-limited?**
  — no limits exist today (milestone M3).

## `_DOCS/06-compliance/README.md`

- [non-blocker] **What retention applies to wishes and assignments?**
  — group deletion is not implemented; data persists indefinitely.

<!--
  When a question is resolved, remove it from its source doc AND from this
  index in the same change, and update the counts.
-->
