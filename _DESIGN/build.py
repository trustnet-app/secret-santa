#!/usr/bin/env python3
"""Render the `_DESIGN` catalogue from Jinja2 sources into dist/.

`src/pages/**` mirrors the output tree 1:1 under `dist/`. Shared shells and
partials live in `src/layouts` / `src/partials`; palettes stay in `styles/`
(CSS only) and the playground design system stays in `playground/`. The build is
deterministic and refuses to finish if an internal href/src in the output does
not resolve to a file under dist/.
"""

from __future__ import annotations

import argparse
import shutil
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "src"
PAGES = SRC / "pages"
PLAYGROUND = ROOT / "playground"
STYLES = ROOT / "styles"
LOGO = ROOT / "logo" / "logo-mark.png"
FAVICON = ROOT / "logo" / "favicon.png"
OUT = ROOT / "dist"

try:
    from jinja2 import Environment, FileSystemLoader, select_autoescape
except ModuleNotFoundError:
    sys.exit(
        "jinja2 is not installed.\n"
        f"  python3 -m pip install -r {ROOT / 'requirements.txt'}"
    )


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[tuple[str, int]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.links.append((value, self.getpos()[0]))


def clean_output() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for child in OUT.iterdir():
        if child.is_dir() and not child.is_symlink():
            shutil.rmtree(child)
        else:
            child.unlink()


def copy_assets() -> None:
    if PLAYGROUND.is_dir():
        shutil.copytree(PLAYGROUND, OUT / "playground")
    if (SRC / "js").is_dir():
        shutil.copytree(SRC / "js", OUT / "js")
    for source in sorted(STYLES.rglob("*.css")):
        target = OUT / source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
    if LOGO.is_file() or FAVICON.is_file():
        assets = OUT / "assets"
        assets.mkdir(parents=True, exist_ok=True)
        if LOGO.is_file():
            shutil.copy2(LOGO, assets / "logo-mark.png")
        if FAVICON.is_file():
            shutil.copy2(FAVICON, assets / "favicon.png")


def render_pages(env: Environment) -> None:
    for source in sorted(PAGES.rglob("*.html")):
        rel = source.relative_to(PAGES)
        target = OUT / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        root = "../" * (len(rel.parts) - 1)
        template = env.get_template(f"pages/{rel.as_posix()}")
        target.write_text(
            template.render(root=root, slug=source.stem), encoding="utf-8"
        )
        print(f"  rendered {rel.as_posix()}")


def page_url(path: Path) -> str:
    rel = path.relative_to(OUT).as_posix()
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("index.html")]
    return "/" + rel


def check_links() -> list[str]:
    errors: list[str] = []
    for page in sorted(OUT.rglob("*.html")):
        collector = LinkCollector()
        collector.feed(page.read_text(encoding="utf-8"))
        for link, line in collector.links:
            parsed = urlsplit(link)
            if parsed.scheme or parsed.netloc or link.startswith("#"):
                continue
            path = unquote(parsed.path)
            if not path:
                continue
            resolved = Path(urljoin(page_url(page), path))
            target = OUT / str(resolved).lstrip("/")
            if path.endswith("/") or target.is_dir():
                target = target / "index.html"
            try:
                target.resolve().relative_to(OUT.resolve())
            except ValueError:
                errors.append(f"{page.relative_to(OUT)}:{line}: escapes dist: {link}")
                continue
            if not target.is_file():
                errors.append(f"{page.relative_to(OUT)}:{line}: missing target: {link}")
    return errors


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--no-link-check",
        action="store_true",
        help="skip the internal-link check (only for a partial migration build)",
    )
    args = parser.parse_args()

    if not PAGES.is_dir():
        sys.exit(f"missing page sources: {PAGES}")

    env = Environment(
        loader=FileSystemLoader(SRC),
        autoescape=select_autoescape(("html", "xml")),
        keep_trailing_newline=True,
    )

    clean_output()
    copy_assets()
    render_pages(env)

    if not args.no_link_check:
        errors = check_links()
        if errors:
            print("\nBROKEN INTERNAL LINKS:", file=sys.stderr)
            for error in errors:
                print(f"  {error}", file=sys.stderr)
            sys.exit(1)

    print(f"built {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
