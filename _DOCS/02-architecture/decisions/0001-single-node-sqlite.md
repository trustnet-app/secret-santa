# 0001 — Single Node process with SQLite

- Status: accepted
- Date: 2026-11-19

## Context

Quiet Santa is a small, seasonal app for invite-only Secret Santa groups. It
must be cheap to host, easy to back up, and must not collect emails or names.
The existing implementation is a single Express process with `better-sqlite3`,
`jose` for OIDC, and server-rendered HTML; there is no build step.

## Decision

Keep one deployable Node.js process that serves HTML, form actions, the OIDC
callback, and TrustNet webhooks, backed by one SQLite file on persistent
storage. Do not introduce a separate API, cache, queue, or client build until a
documented requirement forces it.

## Consequences

- **Easier:** one artifact to deploy, no service discovery, trivial local start,
  data backup is one file.
- **Harder:** scale is vertical; deploys need a persistent volume; a single
  host is a single point of failure.
- **Enforced:** the database file must never live on ephemeral storage; the
  process must run with `NODE_ENV=production` and a public HTTPS `BASE_URL`;
  schema changes need an explicit migration story (open question), not edits
  that rely on `CREATE TABLE IF NOT EXISTS`.
