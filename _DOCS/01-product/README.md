# `_DOCS/01-product/` — product specification

Source of truth for **what Quiet Santa does and for whom**. Code and UI must
match this folder; when they disagree, say so and settle it with the owner
before changing either.

## Layout

| Path | Holds |
|---|---|
| `core/` | Personas, domain concepts, vocabulary |
| `diagrams/flows/` | User-facing flows (step lists with URLs) |
| `diagrams/screens/` | Screen contracts (fields, states, copy) |
| `diagrams/states/` | Lifecycle states and allowed transitions |
| `diagrams/sequences/` | Cross-actor message sequences |
| `templates/` | Blank templates for the four diagram kinds |

## Rules

- Document the flow before the screen, the screen before the code.
- Never invent a step, state, or transition that the app does not implement;
  add an entry to [`../07-open_questions/index.md`](../07-open_questions/index.md)
  instead.
- Keep every diagram linked from `index.md`.
- Use the terms defined in `core/` and in [`../../CLAUDE.md`](../../CLAUDE.md).
