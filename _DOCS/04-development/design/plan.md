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

Every current screen is approved and ported to production with the v3 palette:
the signed-out landing, signed-in home, join, group open, group drawn, and
not-found. The festive v3 layer is shared through `styles/app.css` and the
product shell in `layouts/app.html`; the screens lock v3. Production reproduces
the catalogue through the `qs-*` layer in `public/style.css`. Change 4 is
archived in [`../../plan/done.md`](../../plan/done.md).

## Rules

- `_DOCS` is the source of truth for behaviour; `_DESIGN` is the source of truth
  for visual composition.
- Tokens first: change the token/rule, not individual screens.
- When a screen doc changes, update its `_DESIGN` template in the same change.
- A hard-to-reverse design decision goes in
  [`../../../_DESIGN/decisions.md`](../../../_DESIGN/decisions.md).

## Open design questions

_None._
