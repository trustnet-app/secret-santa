# DevOps goal

The measurable target for the operations layer. A goal that cannot be tested
is a wish.

## Goal

Quiet Santa can be deployed to a single host with a persistent disk, backed up,
and restored with documented commands, without exposing assignments or secrets.

## Exit criteria

- [ ] A clean host is provisioned with documented steps.
- [ ] A release is deployable and rollback-able with exact commands.
- [ ] `data.sqlite` backup exists and a restore has been exercised.
- [ ] The deploy smoke check proves `/` and `/login` behave correctly.
- [ ] Config/credential parity is checked against
      [`../03-runtime/environments.md`](../03-runtime/environments.md).
- [ ] Runbooks exist for backup/restore and lost-TrustNet incident classes.

## Non-goals (for now)

- Horizontal scaling, HA, and multi-region — revisit if traffic or an SLA
  demands it.
- Container orchestration — a single process and a volume are enough for 0001.
