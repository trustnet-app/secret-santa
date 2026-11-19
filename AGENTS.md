<!--
  AGENTS.md — entry point for AI coding agents.

  This file is the first thing an agent should read. It points at the binding
  workflow and at the documentation that is the source of truth. Delete the
  optional Graft block if the project does not use the `graft` context graph.
-->

<!-- graft:start -->
## Graft — repo context graph (optional)

This repo is indexed in `graft/`: small linked markdown nodes that explain each
system and carry exact file:line spans, kept in sync with the code through git.
If the `graft` CLI is installed, use it before grepping or opening source files:

- `graft map` — token-budgeted orientation.
- `graft ask "<question>" --source` — ranked nodes with relevant spans inlined.
- `graft grep "<literal>"` — exhaustive over indexed files (for "every
  occurrence" tasks).
- `graft skeleton <file>` — signatures + spans, cheaper than reading a file.
- `graft callers <symbol>` / `--direction out` — exact call edges.
- After big code changes, run `graft build` (deterministic, no API key).

Remove this block if the project does not use `graft`.
<!-- graft:end -->

## Workflow

The binding workflow rules (plan first, confirm between parts) live in
[`CLAUDE.md`](CLAUDE.md). Read it before starting work.

- When the owner says **"fix reported bugs"**, follow the bug-fix workflow:
  investigate `_DOCS/04-development/bugs.md`, plan in
  `_DOCS/04-development/plan/wip.md`, record per-bug status in `bugs.md`, stop
  for confirmation, then archive to `_DOCS/04-development/plan/done.md`.
- When the owner says **"implement changes"**, follow the change-request
  workflow: classify each entry in `_DOCS/04-development/changes.md` —
  **design-related** changes are worked in `_DESIGN` first, **everything else**
  is analyzed and planned first — record status in `changes.md`, stop for
  confirmation, then archive to `_DOCS/04-development/plan/done.md`.

## Documentation is the source of truth

- Product intent: `_DOCS/01-product/` (flows, screens, states, sequences).
- Architecture intent: `_DOCS/02-architecture/` (services, ADRs, spikes).
- Current build status: `_DOCS/04-development/log.md`.
- Approved plan: `_DOCS/04-development/plan/wip.md` and `queue.md`.
- Unresolved questions: `_DOCS/07-open_questions/index.md`.

If code and a diagram disagree, say so explicitly rather than silently picking
one. Never invent a flow step, state, or transition that the docs do not
describe; flag the gap instead.

## Ground rules

- Do not write code without an approved plan.
- Do not edit `_DOCS` or `_DESIGN` silently to match code; a doc change is a
  decision and needs the owner's agreement.
- Do not delete an open question to make work look finished.
- Keep cross-references bidirectional and update the central index in the same
  change.
- Run the project's lint/typecheck/test commands before declaring work done.
