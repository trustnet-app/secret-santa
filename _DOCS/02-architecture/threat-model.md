# Threat model

Assets, adversaries, threats, and mitigations for Quiet Santa. Keep this short
enough to be read; it is a working document.

## Assets

| Asset | Why it matters | Where it lives |
|---|---|---|
| Draw assignments | Revealing them breaks the game and the organiser-privacy promise | SQLite `assignments` |
| Wishes | Free text may contain personal data or hints | SQLite `wishes` |
| TrustNet `sub` | Pseudonymous identifier; re-identification if linked | SQLite `users` |
| Sessions | Account takeover of a participant | Cookie + SQLite `sessions` |
| Client secret | Allows impersonating the app at TrustNet | `oauth.env` / secret store |
| Invite tokens | Grant access to a group's join page | `groups.token` in URLs |

## Adversaries

| Adversary | Capability | Motivation |
|---|---|---|
| Group member | Valid session, sees the group UI | Learn who draws whom, read others' claims |
| Organiser | Manages roster and draw | Learn the assignments |
| Internet attacker | Can hit public URLs | Join groups, replay webhooks, steal sessions |
| Host/database operator | Filesystem/DB access | Read everything stored |

## Threats

| ID | Threat | Asset | Mitigation | Residual risk |
|---|---|---|---|---|
| T1 | Organiser or member reads another's assignment | Assignments | Server reads only the visitor's row; organiser UI never renders it | Database access still reveals it (accepted) |
| T2 | Session hijack / CSRF | Sessions | `HttpOnly` session cookie, `SameSite`, CSRF token on POST, `no-store` | Malware on the client |
| T3 | Forged TrustNet webhooks | Sessions, user data | Verify signed tokens via `TRUSTNET_WEBHOOK_JWKS`; `client_id` check; replay guard for purge | Compromised TrustNet keys |
| T4 | Invite token guessing | Group access | 12 random bytes, base64url; join still requires sign-in | Anyone with the link can join while open |
| T5 | Fake login in production | All accounts | `/dev/login` requires `NODE_ENV !== "production"` and `DEV_FAKE_LOGIN=1` | Misconfiguration; covered by deploy checklist |
| T6 | Secrets in logs or git | Client secret, tokens | Logging guard G1; env files gitignored | Operator error |
| T7 | XSS through wishes, nicknames, group names | Sessions | Views escape values; CSP `default-src 'self'` | A missed escape |

## Trust boundaries

- **Browser ↔ app** — cookies and form posts; enforced by server-side session
  and CSRF checks.
- **App ↔ TrustNet** — OIDC tokens and signed webhooks; enforced by
  issuer/audience/signature validation.
- **App ↔ database file** — filesystem permissions; anyone who can read the
  file can read assignments.

## Open questions

- [ ] Is invite-link access acceptable with no per-link expiry or revocation?
- [ ] Should the app rate-limit join attempts and sign-in starts?
