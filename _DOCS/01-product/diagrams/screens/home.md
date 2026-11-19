---
id: screen-home
type: screen
title: Home (signed-out landing)
status: approved
version: 0.1.2
updated: 2026-11-19
owners: []
route: /
area: public
related:
  flows: []
  states: []
  sequences: []
  code: [src/views.js]
---

# Home (signed-out landing) — screen

## Purpose

The public landing at `/` for signed-out visitors. It explains the free
service, shows the three-step exchange, and starts TrustNet sign-in. Signed-in
visitors see the signed-in home instead.

## Layout

- **Product nav** — Quiet Santa wordmark on the left; "How it goes" anchor and
  "Sign in" action on the right.
- **Hero** — two columns on desktop. Left: eyebrow with a "Free to use" badge,
  headline, lede, primary action, secondary anchor, and the TrustNet trust line.
  Right: a decorative seasonal still life (gift tag, envelope, wax seal, pine
  sprigs, snow), marked `aria-hidden` because it repeats no information.
- **How it goes** — a heading and a three-step ordered list. Each step has a
  number, title, and one supporting line; desktop shows dashed connectors
  between steps.
- **Footer** — the privacy line and a small brand mark.
- The `_DESIGN` catalogue chrome around the rendering is not part of the
  production screen.

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Nav wordmark | Quiet Santa | yes |
| Nav anchor | How it goes | no |
| Nav action | Sign in | no |
| Hero eyebrow | Secret Santa, quietly done | no |
| Free badge | Free to use | yes |
| Hero headline | Draw names for Secret Santa without handing over anyone’s email. | yes |
| Hero lede | Start a group, drop the link in your group chat, and everyone unfolds their own slip. Wishlists are included, so nobody has to guess. | no |
| Primary action | Start a group | no |
| Secondary action | See how it works | no |
| Trust line | You sign in with TrustNet. It gives us a pseudonymous ID and the nickname you approve, and nothing else about you. | yes |
| How heading | Three quiet steps to a good gift. | no |
| Step 1 | Name your group and set a budget. | no |
| Step 1 supporting | A name, an optional budget, and a date if you have one. | no |
| Step 2 | Share the invite link. | no |
| Step 2 supporting | Everyone joins with their TrustNet nickname and adds a few wishes. | no |
| Step 3 | Press Draw names. | no |
| Step 3 supporting | Everyone sees only their own match. The organiser never sees who drew whom. | yes |
| Footer privacy | No emails, no ads, no tracking. We keep the nickname TrustNet shares and the wishlist you type here, and nothing else about you. | yes |
| Footer mark | Quiet Santa · free to use · made for small, private exchanges | no |
| Cancelled notice | Sign-in cancelled. Nothing was shared. | yes |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Start a group | Primary action | Starts sign-in at `/login`; after TrustNet returns, the signed-in home is shown. |
| Sign in | Nav action | Starts sign-in at `/login`. |
| How it goes | Nav anchor | Jumps to the "How it goes" section. |
| See how it works | Secondary action | Jumps to the "How it goes" section. |

## Validation

None on this screen. Sign-in and group creation are validated server-side.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Sign-in start | Start a group or Sign in | `/login` (TrustNet authorization) |
| Jump to steps | How it goes or See how it works | `#how-it-goes` on this screen |
| Sign-in cancelled | TrustNet returns with `?cancelled=1` | This screen with the cancelled notice |
| Already signed in | Visitor opens `/` | Signed-in home (not documented yet) |

## Edge cases

- `?cancelled=1` shows the pinned cancelled notice above the hero; no other
  state changes.
- Signed-in visitors do not see this screen; `/` renders the signed-in home.
- The still life is decorative and `aria-hidden`; the page remains complete
  without it.
- On narrow screens the hero stacks, the steps become one column, the nav
  anchor is hidden, and the primary action stays full width.
- Long copy must wrap without overflow; the TrustNet trust line stays readable.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial festive landing draft for owner review. |
| 2026-11-19 | 0.1.1 | Added the "Free to use" service marker. |
| 2026-11-19 | 0.1.2 | Approved and ported to the production frontend. |
