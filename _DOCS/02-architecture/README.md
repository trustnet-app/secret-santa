# 02-architecture

How Quiet Santa is built: boundaries, the domain model, protocol flows,
decisions, and risky unknowns. This folder explains **why** the system has the
shape it does.

## Shape

One Node.js process serves HTML, form actions, the OIDC callback, the
back-channel logout endpoint, and the purge webhook. State lives in one SQLite
file on a persistent disk. There is no separate API, queue, cache, or frontend
build. See [ADR-0001](decisions/0001-single-node-sqlite.md).

| Component | Module | Responsibility |
|---|---|---|
| Web app | `src/server.js` | Pages, group actions, draw/undraw |
| Auth | `src/auth.js` | OIDC code flow + PKCE, sessions, logout, purge webhook |
| Draw | `src/draw.js` | Ring shuffle with exclusion retries |
| Persistence | `src/db.js` | Schema, pragmas, WAL |
| Rendering | `src/views.js` | HTML templates |

## Protocol flows

1. **Sign-in** — authorization code + PKCE, scope `openid`, a `claims`
   request for `nickname`, `state` + `nonce` validated, ID token verified
   against the issuer's JWKS. The claim seeds member names; `sub` remains the
   only identity key. See
   [`01-product/diagrams/flows/sign-in.md`](../01-product/diagrams/flows/sign-in.md).
2. **Back-channel logout** — TrustNet POSTs a signed logout token to
   `/auth/backchannel-logout`; the app matches `sid` and deletes sessions.
3. **Purge webhook** — TrustNet POSTs a signed erasure event to `/auth/purge`;
   `purge_deliveries` guards replays, and the user's rows are deleted.

## Contents

| Path | Purpose |
|---|---|
| `services/` | Deployable component and its boundary |
| `infrastructure/` | Database, secrets, networking, external systems |
| `decisions/` | Numbered, immutable ADRs |
| `spikes.md` | Open go/no-go questions and outcomes |
| `spikes/` | Spike evidence |
| `threat-model.md` | Assets, adversaries, threats, mitigations |

## Rules

- **An accepted ADR is binding.** Supersede it; never rewrite it.
- Non-obvious boundaries (data ownership, who may call what) belong in an ADR
  or service doc, not only in code.
- Threat-model entries name the asset, adversary, attack, and mitigation.
