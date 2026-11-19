# `_DOCS` — agent instructions

This directory is the specification of intended behaviour for the project. Read
it before proposing or writing code that touches a user-facing flow or a
stateful entity.

## Reading order

1. `00-overview.md` — what the project is and the order to read the rest.
2. The numbered folder that owns your task (`01-product`, `02-architecture`,
   `03-runtime`, `04-development`, `05-operations`, `06-compliance`).
3. For any diagram, start at `01-product/index.md` (the registry), then read the
   diagram's frontmatter, Purpose, machine-readable table, and `related` links.
4. `04-development/plan/wip.md` + `queue.md` — the approved plan.
5. `04-development/log.md` — where the build actually is.

## What each folder authorises you to assume

- **`01-product/`** — the user-visible contract: flows, screens, states,
  sequences. The tables are authoritative over the Mermaid blocks.
- **`02-architecture/`** — component boundaries, ADRs, spikes. An accepted ADR
  is binding until superseded by a newer ADR.
- **`03-runtime/`** — how it runs (environments, secrets, local dev).
- **`04-development/`** — how work is planned, logged, and guarded.
- **`05-operations/`** — deployment and operational procedure.
- **`06-compliance/`** — legal/privacy obligations.

## Ground rules

- **Docs are the source of truth for intent, not for current code.** If code and
  a doc disagree, say so explicitly rather than silently picking one.
- **Never invent nodes, states, or steps.** If the task needs something absent
  from the diagram, stop and flag the gap.
- **Never delete an Open question** to make a task look finished.
- **When editing a diagram:** update the Mermaid block, its table, `version`,
  `updated`, and the Changelog row together. Partial edits break the contract.
- **When adding a diagram:** copy the matching template from
  `01-product/templates/`, keep the section headings intact, and add a row to
  `01-product/index.md` in the same change.
- Keep `id` values unique repo-wide and cross-references bidirectional.

## Open questions are tracked centrally (STRONG directive)

- Every open question in this tree — Open questions sections, Deferred
  sections, unresolved `[ ]` decision items, `TBD`s, and open spikes — must be
  mirrored in `07-open_questions/index.md`, organized by the file path it
  refers to, each tagged `blocker` or `non-blocker`.
- `07-open_questions/plan.md` holds the plan for addressing them. When a
  question is resolved, update the source doc (flip `[x]`, changelog row,
  version) **and** the index in the same change — never one without the other.
- Adding a new open question requires adding it to the index in the same change.
- Tagging rule: `blocker` = must be resolved before the referenced surface can
  be implemented/promoted, or before a named milestone/launch can proceed;
  `non-blocker` = deferred detail or follow-up.
- Implementation work items in `04-development/plan/queue.md` are tasks, not
  questions — do not mirror them here.

## Plan and status files

- `04-development/plan/queue.md` — the approved queue of milestones.
- `04-development/plan/wip.md` — the single active detailed plan.
- `04-development/plan/done.md` — archived completed plans.
- `04-development/log.md` — what actually happened, newest first.
- `04-development/bugs.md` / `changes.md` — trackers for owner reports.

The binding process is in [`../CLAUDE.md`](../CLAUDE.md).
