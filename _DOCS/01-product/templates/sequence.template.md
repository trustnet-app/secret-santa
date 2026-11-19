---
id: seq-<slug>
type: sequence
title: <Name of the interaction being traced>
status: draft            # draft | review | approved | deprecated
version: 0.1.0
updated: <YYYY-MM-DD>
owners: []
trigger: <what starts this exchange>
participants: []         # e.g. [user, web, api, db]
sync: <sync | async | mixed>
idempotent: <yes | no>
related:
  flows: []
  states: []
  code: []
---

# <Title> — sequence

## Purpose

<!-- 1-3 sentences. Which step of which flow this expands, and what contract it pins down. -->

## Diagram

<!-- Participant aliases MUST match the Participants table. Keep `autonumber` so steps are citable. -->

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant W as Web App
    participant A as API
    participant D as Database

    U->>W: submits form
    W->>A: POST /resource
    A->>A: validate payload
    alt valid
        A->>D: insert record
        D-->>A: row id
        A-->>W: 201 Created
        W-->>U: confirmation
    else invalid
        A-->>W: 422 Unprocessable
        W-->>U: field errors
    end
```

## Participants

| Alias | Name | Kind | Responsibility |
| --- | --- | --- | --- |
| U | User | actor | <provides input> |
| W | Web App | client | <renders, validates locally> |
| A | API | service | <authoritative validation, persistence> |
| D | Database | store | <durable state> |

## Step contract

<!-- The machine-readable contract. Numbers match `autonumber` in the diagram. -->

| # | From → To | Message | Payload / shape | Notes |
| --- | --- | --- | --- | --- |
| 1 | U → W | submits form | <fields> | <...> |
| 2 | W → A | POST /resource | <request body> | <auth header> |
| 3 | A → A | validate payload | — | <rules referenced> |
| 4 | A → D | insert record | <columns> | <transaction boundary> |
| 5 | D → A | row id | <id> | — |
| 6 | A → W | 201 Created | <response body> | — |
| 7 | W → U | confirmation | — | <redirect target> |

## Failure modes

| Step | Failure | Response | Retry / recovery |
| --- | --- | --- | --- |
| 2 | <network timeout> | <client error state> | <retries, backoff> |
| 4 | <constraint violation> | <409 Conflict> | <no retry, surface to user> |

## Non-functional notes

- **Timeouts** — <per hop budget.>
- **Retries** — <policy, and whether the operation is safe to repeat.>
- **Auth** — <what is checked, where.>

## Open questions

- [ ] <Unresolved decision.>

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| <YYYY-MM-DD> | 0.1.0 | Initial draft. |
