# Local development

The runnable stack lives in [`../../_DEV/`](../../_DEV/); its README is the
canonical quick start. This file records the topology and the deliberate
local-vs-production differences.

## Topology

| Local | Production | Serves |
|---|---|---|
| `http://localhost:5556` | `https://<BASE_URL host>` | the app: pages, forms, OIDC callback, webhooks |
| `./data.sqlite` | persistent volume | all state |

There is no separate API, proxy, cache, or database container.

## Ports

| Service | Port | Notes |
|---|---|---|
| app | 5556 | the only origin the browser talks to |
| SQLite | — | file, not a socket |

## Two local modes

| Mode | Env file | Sign-in |
|---|---|---|
| Live TrustNet | `oauth.env` | real OIDC against `TRUSTNET_ISSUER` |
| Fake login | `.env` with `DEV_FAKE_LOGIN=1` | `/dev/login?as=<name>` |

Both are gitignored. Never put live credentials into a committed file.

## Deliberate differences from production

- Plain HTTP and `localhost` instead of the public domain (cookie `Secure`,
  HSTS, and host proof are absent locally).
- `DEV_FAKE_LOGIN` may be on; it is ignored when `NODE_ENV=production`.
- Back-channel logout and purge webhooks cannot reach localhost; test them on
  a deployed copy.
- Data is throwaway; deleting `data.sqlite*` resets the app.

## Startup

```sh
npm install
node --env-file=oauth.env src/server.js   # or: npm start with .env
# http://localhost:5556
```
