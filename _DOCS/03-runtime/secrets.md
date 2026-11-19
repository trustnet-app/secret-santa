# Secrets

Where secrets come from and who may read them. **Never record a secret value in
this file or anywhere in the repo.**

## Sources

| Environment | Source | Notes |
|---|---|---|
| local | `oauth.env` or `.env` (gitignored) | live TrustNet client or fake login |
| production | host secret store / platform env vars | restricted access, rotation plan |

## Inventory

| Secret | Purpose | Read by | Rotation |
|---|---|---|---|
| `TRUSTNET_CLIENT_SECRET` | Token exchange / webhook trust | `src/auth.js` | portal rotation + redeploy |
| `TRUSTNET_CLIENT_ID` | Public client id | `src/auth.js` | with the registration |
| Session cookie ids | Opaque sessions | `src/auth.js` | per session |

## Rules

- Secrets are injected at runtime; never committed, never logged.
- Only `src/auth.js` reads TrustNet credentials.
- Rotating a secret must be possible without editing code.
- Test fixtures use synthetic credentials only; fake login needs none.
