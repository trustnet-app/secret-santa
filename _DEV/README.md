# `_DEV` — local development environment

Runs Quiet Santa locally. There are no external dependencies: the app is one
Node process and state is one SQLite file.

This is **not** a throwaway harness: the configs here are product-shaped and the
`CLAUDE.md` invariants apply.

## Quick start (host)

```sh
cd ..
npm install
node --env-file=oauth.env src/server.js    # live TrustNet
# or: cp .env.example .env && set DEV_FAKE_LOGIN=1, then npm start
```

Open <http://localhost:5556>.

## Quick start (container)

```sh
make up      # builds node_modules inside a volume; uses ../oauth.env
make logs
make down    # keeps data.sqlite
make reset   # destroys the node_modules volume
```

## Topology

| Local | Deployed | Serves |
|---|---|---|
| `http://localhost:5556` | `https://<BASE_URL host>` | the whole app: pages, forms, OIDC, webhooks |

There is no proxy, Postgres, or Redis: the Node app is the single origin and
SQLite is the store (see ADR-0001).

## Environment

| File | Mode |
|---|---|
| `../oauth.env` (gitignored) | live TrustNet client |
| `../.env` (gitignored, from `.env.example`) | fake login with `DEV_FAKE_LOGIN=1` |

Never commit either file.

## Tests

```sh
make e2e-deps   # one-time Playwright install
make e2e        # smoke suite against the running app
```

## Invariants this environment enforces

- Secrets come from gitignored env files; never committed.
- Fake login is impossible with `NODE_ENV=production`.
- Test data is synthetic; `data.sqlite*` is disposable.
