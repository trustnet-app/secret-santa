# Secrets — Quiet Santa

**Never record a secret value in this file or anywhere committed.**

## Sources

| Environment | Source | Notes |
|---|---|---|
| local (live TrustNet) | `oauth.env` (gitignored) | `TRUSTNET_CLIENT_ID`, `TRUSTNET_CLIENT_SECRET` |
| local (fake login) | `.env` from `.env.example` | no TrustNet credentials needed |
| production | host secret store / platform env | same keys, distinct client registration |

## Inventory

| Secret | Purpose | Read by | Rotation |
|---|---|---|---|
| `TRUSTNET_CLIENT_SECRET` | Exchanges the OIDC code and authenticates webhook setup | `src/auth.js` | Rotate in the TrustNet portal, then redeploy |
| `TRUSTNET_CLIENT_ID` | Public client identifier; not secret, but paired with the secret | `src/auth.js` | With the registration |
| Session cookie value | Opaque session id, derived at runtime | `src/auth.js` | Per session |

## Rules

- Secrets are injected at runtime; never committed, never logged.
- `oauth.env` and `.env` are gitignored by the `*.env` rule.
- Rotating the client secret must not require a code change.
- The fake-login flag is not a secret but is production-sensitive; see guard G4.
