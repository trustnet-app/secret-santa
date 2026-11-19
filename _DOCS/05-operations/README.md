# 05-operations

How Quiet Santa is deployed and operated: environments, release process,
monitoring, and runbooks.

## Contents

| Path | Purpose |
|---|---|
| `deployment/` | Deployment topology, environments, release procedure |
| `plans/` | Operations work queue |
| `devops_goal.md` | The measurable target for the ops layer |
| `runbooks/` | Backup/restore, rollback, incident procedures |

## Rules

- Local and production config parity is documented; drift is a bug.
- Runbooks are written for a tired human at 03:00: exact commands, expected
  output, stop condition.
- Secrets never appear here; reference the secret path.
- A production incident produces a log entry and, when behaviour must change, a
  bug entry.

## Current state

No deployment exists yet. The app runs locally on `:5556`; a host with a
persistent disk is the intended production shape (ADR-0001).
