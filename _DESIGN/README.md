# `_DESIGN` — visual system and screen catalogue

Standalone, human-inspectable design reference. It is a **visual laboratory**,
not a miniature application: data and behaviour are fake, but the geometry,
hierarchy, states, responsiveness, and accessibility are realistic enough to
serve as the production frontend's visual specification.

This directory is deliberately **separate from the production frontend**. Keep
production components out of it.

## Status

- Screens are Jinja2 templates rendered into the gitignored `dist/`.
- The festive `v3` palette is the product palette; every product screen locks it
  with `data-style-lock="v3"`. The playground keeps the monochrome token
  baseline and links to a v3 component preview.
- One template per `_DOCS` screen doc, named by the screen slug. Documented
  state variants live inside that template behind a catalogue-only state bar.
- `styles/app.css` is the shared product layer; screens consume it instead of
  copying landing styles.

## Build and open

One-time dependency:

```sh
python3 -m pip install -r _DESIGN/requirements.txt
```

Render the catalogue:

```sh
python3 _DESIGN/build.py                  # render + internal-link check
python3 _DESIGN/build.py --no-link-check  # partial builds only
```

Inspect it:

```sh
python3 -m http.server -d _DESIGN/dist 8000
# open http://localhost:8000/
```

`dist/` is generated and gitignored. Edit `src/`, `styles/`, or `playground/`,
never `dist/`. The build fails on a broken internal link.

## Structure

```text
_DESIGN/
├── README.md          # this file
├── decisions.md       # design decisions (read before changing anything)
├── build.py           # Jinja2 render + asset copy + internal-link check
├── requirements.txt   # Jinja2
├── src/
│   ├── layouts/       # screen shell + product shell (app.html)
│   ├── partials/      # head
│   ├── pages/         # one template per screen (mirrors dist/ 1:1)
│   └── js/            # design-lab scripts (style/theme/state toggles)
├── styles/            # CSS only
│   ├── app.css        # shared festive product layer (tokens + components)
│   ├── v1/theme.css   # palette version 1
│   ├── v2/theme.css   # palette version 2
│   └── v3/theme.css   # seasonal festive palette (product)
├── logo/              # owner-supplied marks (optional)
├── playground/        # design system (plain HTML/CSS/JS)
│   ├── index.html     # monochrome token/component baseline
│   ├── product.html   # festive v3 component preview
│   ├── css/{tokens,base,components,product}.css
│   └── js/playground.js
└── dist/              # generated
```

## Screen catalogue

Source: `src/pages/screens/<slug>.html` → output `dist/screens/<slug>.html`.
One template per `_DOCS` screen doc, named by the screen slug. The `_DOCS`
screen docs are the source of truth for behaviour: when a doc and a rendering
disagree, the doc wins and the rendering is the defect.

Add a row here when you add a screen template.

| Template | Doc id | Route | Notes |
| --- | --- | --- | --- |
| `index.html` | — | `/screens/` | catalogue hub |
| `home.html` | `screen-home` | `/` | signed-out festive landing |
| `home-signed-in.html` | `screen-home-signed-in` | `/` | groups dashboard; groups/first-group/nickname states |
| `join.html` | `screen-join` | `/g/:token` | invite; signed-out/signed-in/nickname/closed states |
| `group-open.html` | `screen-group-open` | `/g/:token` | organiser and member views |
| `group-drawn.html` | `screen-group-drawn` | `/g/:token` | reveal; member and organiser views |
| `not-found.html` | `screen-not-found` | `*` | unknown page and bad invite token |
| `_template.html` | `screen-<slug>` | `</path>` | starter |

## How to edit a screen

1. Change `src/pages/screens/<slug>.html` for copy/layout; extend the shared
   layout, reuse `styles/app.css`, and add a component rule there when the same
   pattern appears twice. Page-specific CSS belongs in the `head` block only
   when it cannot become a shared component.
2. Documented states live in the same template behind the `data-state-switcher`
   bar; add a button and a `data-state-panel` (or `data-view`) target.
3. Put a new icon in `src/partials/` and a matching nav row in the layout.
4. Add or update the screen doc row here in the same change.
5. Run `python3 _DESIGN/build.py` and inspect `dist/`.

## Rules

- **Tokens first.** Components consume semantic tokens, never raw values;
  palettes are token overrides, never component edits.
- **Fix the system, not the symptom.** If several screens look wrong, fix the
  token or shared rule, not each screen.
- **One shell, one nav, one sprite.** Do not duplicate the shell per page.
- **State variants are lab chrome.** Toggle them with the state bar
  (`data-state-switcher`); never ship the bar as part of a product screen.
- **The doc is the source of truth for behaviour.** Never add elements the doc
  does not specify.
- **Keep in sync.** When a `_DOCS` screen doc changes, update its template in
  the same change.
- **A11y.** Keyboard-reachable focus, logical order, labels, no meaning by color
  alone.
- **Read `decisions.md` before changing an established decision.**
