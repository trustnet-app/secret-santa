# 06-compliance

Privacy and compliance artefacts for Quiet Santa. The data inventory is
authoritative: it turns "we handle data responsibly" into a checkable claim.

## Contents

| File | Covers |
|---|---|
| `data-inventory.md` | Every store/column with personal data, purpose, retention |
| `gdpr.md` | Lawful basis, subject rights (to be written) |
| `erasure-runbook.md` | How the TrustNet purge webhook erases a person (to be written) |
| `toms.md` | Technical and organisational measures (to be written) |

## Rules

- A new personal-data column requires an inventory entry in the same change
  (guard G10).
- `purge_deliveries` is append-only so erasure remains provable (guard G11).
- Erasure is driven by TrustNet's purge webhook; manual erasure follows the
  same deletion path.
- Test data is synthetic (guard G9).

## Open questions

- [ ] What retention applies to wishes and assignments after an exchange ends?
- [ ] Is the app a controller or a processor for group content?
