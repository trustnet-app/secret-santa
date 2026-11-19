# infrastructure

Supporting systems for Quiet Santa: the SQLite database file, the host, the
external identity provider, and the secret files.

## Contents

| File | Covers |
|---|---|
| `database.md` | SQLite file, schema, WAL, backups |
| `secrets.md` | Env files and TrustNet credentials |
| `networking.md` | Hosts, TLS, and the TrustNet callback URLs |

## Isolation model

- One app process and one database file per environment.
- Local runs use `oauth.env` (live TrustNet) or `.env` (fake login) — both
  gitignored.
- No shared database between environments; there is no staging stack yet.

## Rules

- New personal-data storage needs an entry in
  [`../../06-compliance/`](../../06-compliance/) in the same change.
- Record technology choices as ADRs; this folder holds operational detail.
