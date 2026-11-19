# Design workflow

Visual work is driven by `_DESIGN` first: the rendering is the visual
specification, and production frontend work reproduces it. This file records
how design changes move through the project.

## Order of work (design-related changes)

1. **Brief** — capture the requested change and the flow/screen it affects.
2. **Design** — update `_DESIGN` (playground + screen catalogue) and the
   matching `_DOCS` screen/flow doc.
3. **Review** — owner reviews the rendering; the doc wins on behaviour.
4. **Implement** — only then port to the production frontend.
5. **Verify** — design and production must agree; note intentional drift.

## Current state

`_DESIGN` contains the template catalogue (playground, shell, one starter
screen) but **no Quiet Santa screens yet**. The production UI lives in
`src/views.js` and `public/style.css`; it is the only visual record until the
screen docs and `_DESIGN` templates exist.

## Rules

- `_DOCS` is the source of truth for behaviour; `_DESIGN` is the source of truth
  for visual composition.
- Tokens first: change the token/rule, not individual screens.
- When a screen doc changes, update its `_DESIGN` template in the same change.
- A hard-to-reverse design decision goes in
  [`../../../_DESIGN/decisions.md`](../../../_DESIGN/decisions.md).

## Open design questions

- [ ] Which screens need a `_DESIGN` template first (landing, home, join,
      group open, group drawn)?
