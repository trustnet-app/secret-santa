# `_DESIGN` — visual system and screen catalogue

Standalone, human-inspectable design reference. It is a **visual laboratory**,
not a miniature application: data and behaviour are fake, but the geometry,
hierarchy, states, responsiveness, and accessibility are realistic enough to
serve as the production frontend's visual specification.

This directory is deliberately **separate from the production frontend**. Keep
production components out of it.

## Status

- Screens are Jinja2 templates rendered into the gitignored `dist/`.
- Start monochrome, then layer palette overrides as token changes only.
- One template per `_DOCS` screen doc, named by the screen slug.

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
│   ├── layouts/       # app shell(s)
│   ├── partials/      # head, nav, icons
│   ├── pages/         # one template per screen (mirrors dist/ 1:1)
│   └── js/            # design-lab scripts
├── styles/            # CSS only
│   ├── v1/theme.css   # palette version 1
│   └── v2/theme.css   # palette version 2
├── logo/              # owner-supplied marks (optional)
├── playground/        # monochrome design system (plain HTML/CSS/JS)
│   ├── index.html, tokens.html, components.html, …
│   ├── css/{tokens,base,components}.css
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
| `index.html` | — | `/` | catalogue hub |
| `_template.html` | `screen-<slug>` | `</path>` | starter |

## How to edit a screen

1. Change `src/pages/screens/<slug>.html` for copy/layout; extend the shared
   layout and keep page-specific CSS in the `head` block.
2. Put a new icon in `src/partials/` and a matching nav row in the layout.
3. Add or update the screen doc row here in the same change.
4. Run `python3 _DESIGN/build.py` and inspect `dist/`.

## Rules

- **Tokens first.** Components consume semantic tokens, never raw values;
  palettes are token overrides, never component edits.
- **Fix the system, not the symptom.** If several screens look wrong, fix the
  token or shared rule, not each screen.
- **One shell, one nav, one sprite.** Do not duplicate the shell per page.
- **The doc is the source of truth for behaviour.** Never add elements the doc
  does not specify.
- **Keep in sync.** When a `_DOCS` screen doc changes, update its template in
  the same change.
- **A11y.** Keyboard-reachable focus, logical order, labels, no meaning by color
  alone.
- **Read `decisions.md` before changing an established decision.**
