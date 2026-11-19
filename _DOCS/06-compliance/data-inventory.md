# Data inventory

Every store and column that can hold personal data. Keep in sync with
`src/db.js` in the same change.

| Store | Column | Personal data? | Purpose | Retention |
|---|---|---|---|---|
| `users` | `sub` | Yes — TrustNet PPID | Identity for sign-in | Until purge webhook deletes the user |
| `users` | `created_at` | Metadata | Audit | Same as the row |
| `sessions` | `id`, `csrf`, `expires_at` | Pseudonymous | Session integrity | Until expiry/logout; expired rows not yet swept |
| `sessions` | `sid`, `id_token` | Yes — TrustNet tokens, including the approved `nickname` claim | Back-channel logout hint; nickname source for new memberships | Until logout/purge |
| `auth_requests` | `state`, `nonce`, `verifier` | No | OIDC round-trip | Not yet swept (see open questions) |
| `groups` | `name`, `budget`, `exchange_date` | Possible (free text) | Exchange metadata | Until group deletion (not implemented) |
| `members` | `nickname` | Yes — nickname shared by TrustNet | Identify within a group | With the member/group |
| `wishes` | `text`, `url`, `claimed_by` | Yes — free text can identify | The wishlist | With the member/group |
| `exclusions` | member ids | Indirect | Draw constraints | With the group |
| `assignments` | member ids | Indirect — the protected secret | The draw | With the group |
| `purge_deliveries` | `delivery_id` | No (TrustNet delivery id) | Replay guard | Kept to prove erasure |

New memberships copy the nickname from the approved ID-token claim; the app
stores no separate nickname profile.

## Deletion paths

- **TrustNet purge webhook** — deletes the user and cascades sessions,
  memberships, wishes, and assignments.
- **Group deletion** — not implemented; wishes and assignments persist.
- **Session expiry** — enforced on read; rows are not yet physically swept.

## Third parties

| Processor | Data | Notes |
|---|---|---|
| TrustNet | OIDC identifiers, tokens, approved nickname | Identity provider; no email stored here |
| Hosting provider | Disk containing `data.sqlite` | Must provide persistent, access-controlled storage |
