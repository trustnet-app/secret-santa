# Architecture Decision Records

Short, numbered, immutable records of non-obvious decisions. One file per
decision: `NNNN-short-title.md`. Never rewrite an accepted ADR — supersede it
with a new one.

## Template

```markdown
# NNNN — Title

- Status: proposed | accepted | superseded by NNNN
- Date: YYYY-MM-DD

## Context
Why a decision is needed.

## Decision
What we chose, stated plainly.

## Consequences
What becomes easier, harder, and what we must enforce.
```

## Index

| # | Title | Status |
|---|---|---|
| 0001 | [Single Node process with SQLite](0001-single-node-sqlite.md) | **accepted** |
| 0002 | [Member nicknames from the TrustNet nickname claim](0002-trustnet-nickname-claim.md) | **accepted** |
