# Quiet Santa — Overview

## Thesis

Quiet Santa is a Secret Santa with wishlists. It keeps the exchange inside
invite-only groups and uses TrustNet for sign-in, so it holds **no email
addresses and no real names** — only a pairwise pseudonymous subject, the
nickname TrustNet shares for each group, and the wishes people type. It serves
friends, families, and small teams who want the fun of a draw without handing
another service their contact list.

Core terms: a **group** is an invite-only exchange addressed by an unguessable
token; a **member** is a user with a nickname from TrustNet inside one group; a
**wish** is an item a member types for their group; a **draw** is the one-time
assignment of givers to giftees. Services and boundaries: see
[ADR-0001](02-architecture/decisions/0001-single-node-sqlite.md).

## Why it matters

- **Privacy by default** — no email, no name, no marketing; the identity is a
  TrustNet PPID. See [`01-product/core/`](01-product/core/).
- **The organiser cannot see the draw** — only the giver sees their giftee, and
  only in their own session. See
  [`02-architecture/threat-model.md`](02-architecture/threat-model.md).
- **Known critical risk** — anyone with database access can read the
  assignments and wishes. The mitigation is deployment hygiene (single host,
  restricted file access, backups encrypted at rest), not application logic.

## Reading order

| Section | What's in it |
|---|---|
| [01-product/](01-product/) | Personas, core concepts, flows, screens, states, sequences |
| [02-architecture/](02-architecture/) | Components, service boundaries, ADRs, spikes, threat model |
| [03-runtime/](03-runtime/) | Environments, local dev, secrets, infrastructure |
| [04-development/](04-development/) | **Approved plan** (`plan/queue.md`) · **build status** (`log.md`) · standards · guards |
| [05-operations/](05-operations/) | Deployment and operations |
| [06-compliance/](06-compliance/) | Privacy mapping, data inventory |
| [07-open_questions/](07-open_questions/) | Every unresolved question in one inventory |
