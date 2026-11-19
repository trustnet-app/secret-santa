# `01-product` — agent instructions

This directory is the specification of intended behaviour for user-facing flows
and stateful entities. Read it before proposing or writing code that touches a
user-facing flow.

## Reading order

1. `index.md` — the registry. Find the diagram whose scope covers your task.
2. That diagram's **frontmatter** — check `status`. `draft` means the design is
   not settled; ask before implementing against it. `deprecated` means ignore it.
3. That diagram's **Purpose** section — confirm relevance in one read.
4. The **dictionary / transition / step-contract table** — the authoritative
   machine-readable content. Prefer it over the Mermaid block.
5. `related` in frontmatter — follow to the connected state/sequence diagrams
   before concluding you have the full picture.

The Mermaid block and its table always describe the same thing. If they
disagree, **the table wins** and the mismatch is a defect worth reporting.

## What each type authorises you to assume

- **flow** — the set of steps and their order, plus which branches exist. Every
  branch condition is spelled out in *Decision rules*; do not infer conditions.
- **state** — the complete set of legal states and transitions. The *Illegal
  transitions* section is binding: do not add code paths that produce those
  transitions, even if they look convenient.
- **sequence** — the call order, payload shapes, and failure responses. The
  *Non-functional notes* cover timeouts, retries, and auth expectations.
- **screen** — the layout regions, copy structure, actions, and navigation
  outcomes. Authority stays server-side even when a rule is duplicated in the UI.

## Ground rules

- **Diagrams are the source of truth for intent, not for current code.** If the
  code and a diagram disagree, say so explicitly rather than silently picking
  one.
- **Never invent nodes, states, or steps.** If the task needs something absent
  from the diagram, stop and flag the gap. An unlisted state is a design
  question, not an implementation detail.
- **Never delete an Open questions item** to make a task look finished.
- **When editing a diagram:** update the Mermaid block, its table, `version`,
  `updated`, and the *Changelog* row together.
- **When adding a diagram:** copy the matching template from `templates/`, keep
  the section headings intact, and add a row to `index.md` in the same change.
- Keep `id` values unique repo-wide and cross-references bidirectional.

## Open questions

Open questions originating here are mirrored centrally in
[`../07-open_questions/index.md`](../07-open_questions/index.md). Resolve them
in the source doc and the index in the same change; see
[`../AGENTS.md`](../AGENTS.md) for the full directive.
