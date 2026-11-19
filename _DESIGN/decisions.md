# Design decisions

Recorded so future agents/developers do not unknowingly reverse an established
decision. Any change here is a deliberate refinement, not an accident.

## 1. Monochrome first

Black, white, and grayscale during the exploration phase. Brand color and final
copy are deferred. The eventual identity is introduced by re-mapping semantic
tokens, never by editing component styles.

## 2. Token first

Components consume **semantic** tokens (`--text-primary`, `--surface`,
`--interactive`, …), not raw values and not raw neutral steps. Raw values are
only allowed inside `tokens.css`. This is what makes a theme a token change
instead of a component rewrite.

## 3. Spacing

- Base unit: **4px**.
- Restricted scale: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80`.
- No arbitrary per-screen spacing. If a value is not on the scale, use the
  nearest step or add a justified scale step.

## 4. Typography

- System font stack; a separate monospace stack for code/data.
- Modular scale, restricted weights (`400 / 500 / 600 / 700`).
- Roles: display, headings, body, small, label/caption.
- Headings use tighter leading/tracking; body uses normal leading.

## 5. Palettes

- `styles/v1/theme.css`, `styles/v2/theme.css`, and `styles/v3/theme.css` are
  token overrides scoped to a selector (e.g. `[data-style="v1"]`).
- Switching a palette must never change layout or copy.
- The chosen direction is recorded here when decided.

## 6. Accessibility

- Keyboard reachable, logical focus order.
- Labels are explicit; no placeholder-as-label.
- Meaning is never conveyed by color alone.
- Contrast meets WCAG AA for text and interactive elements.

## 7. Content

- Placeholder data is clearly fake and synthetic.
- Screen copy structure is specified in the `_DOCS` screen doc; final wording is
  settled in the design system.

## 8. Seasonal festive palette is the product palette

- `styles/v3/theme.css` is the product palette: pine, cream, cranberry, and
  antique gold.
- It is a token override, not a component rewrite; the monochrome playground
  remains the token baseline and links to a v3 component preview.
- Every product screen locks the palette with `data-style-lock="v3"` so the
  catalogue style toggle cannot change its geometry or copy.

## 9. One shared product layer

- `styles/app.css` is the single festive component layer: the landing primitives
  and the `qs-*` app components consume semantic tokens, never raw values.
- `layouts/app.html` owns the product nav and footer; screens do not duplicate
  the shell.
- Documented state variants (empty, signed-out, organiser/member, …) are toggled
  by a catalogue-only state bar. The bar is review chrome, not a product
  element.
