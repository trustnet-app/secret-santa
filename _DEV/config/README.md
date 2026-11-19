# `_DEV/config`

Committed, product-shaped configuration for local dependencies.

Quiet Santa has no external dependencies: the app is one Node process and the
store is `data.sqlite`. Runtime configuration is read from env files
(`../oauth.env` or `../.env`), which are gitignored and never committed.

Add a subdirectory per component only if a real dependency appears, and
document the deliberate differences from production in
[`../../_DOCS/03-runtime/`](../../_DOCS/03-runtime/).

## Rules

- Committed configs are not secrets.
- Secrets are referenced by path, never inlined.
