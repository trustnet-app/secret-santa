# Environments

| Environment | Purpose | Data | Access |
|---|---|---|---|
| local | development | synthetic or throwaway | any developer |
| production | real users | real | restricted |

There is no staging environment yet; its absence is an open question.

## Per-environment configuration

| Variable | Local | Production |
|---|---|---|
| `BASE_URL` | `http://localhost:5556` | public HTTPS URL, no trailing slash |
| `PORT` | `5556` | host-provided |
| `NODE_ENV` | unset | `production` |
| `DATABASE_PATH` | `./data.sqlite` | persistent volume path |
| `DEV_FAKE_LOGIN` | `1` only with fake login | never (ignored anyway) |
| `TRUSTNET_*` | dedicated local client | production client |

## Parity checklist

- [ ] `BASE_URL` matches the TrustNet redirect registration exactly.
- [ ] `NODE_ENV=production` (fake login off, secure cookies).
- [ ] `DATABASE_PATH` points at persistent storage.
- [ ] Back-channel logout and purge URLs are reachable from the internet.
- [ ] Backup/restore of `data.sqlite` exercised for this deploy.

## Promotion

Currently `local → production`; the same source is deployed, configuration is
the only difference. Adding staging is tracked in
[`../07-open_questions/index.md`](../07-open_questions/index.md).
