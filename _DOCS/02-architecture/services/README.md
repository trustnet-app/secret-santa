# services

One document per deployable service or component. Each document states its
**ownership boundary**: what it owns, what it explicitly does not own, and how
other services interact with it.

## Index

| Service | Doc |
|---|---|
| app (Node process) | [app.md](app.md) |

## Template

```markdown
# <service name>

## Responsibility
What this service is responsible for, in one paragraph.

## Owns
- <data / behaviour this service is the source of truth for>

## Does NOT own
- <things other services own; link to them>

## Interfaces
| Interface | Direction | Contract |
|---|---|---|
| <HTTP/gRPC/queue/CLI> | inbound/outbound | <doc or OpenAPI link> |

## Data
| Store | Data | Notes |
|---|---|---|
| <db/table> | <what> | <retention, encryption, PII> |

## Failure and scaling notes
- <what happens when dependencies fail; how the service scales>

## Open questions
- [ ] <Unresolved decision.>
```

## Rules

- A service doc must be enough for an agent to decide whether a change belongs
  here.
- Cross-service calls that bypass a documented interface are an architecture
  violation.
- Keep the service list here in sync with the deployment topology.
