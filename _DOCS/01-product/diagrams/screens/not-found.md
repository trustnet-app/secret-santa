---
id: screen-not-found
type: screen
title: Not found
status: approved
version: 0.1.1
updated: 2026-11-19
owners: []
route: any unmatched path; /g/{unknown-token}
area: public
related:
  flows: [group-exchange]
  states: []
  sequences: []
  code: [src/server.js, src/views.js]
---

# Not found — screen

## Purpose

The fallback for an unmatched path or an invite token that does not exist. It
reuses the product shell and returns the visitor to a safe place when a route
exists (the generic case).

## Layout

- **Product nav** — Quiet Santa wordmark on the left; the auth action on the
  right.
- **Message card** — a centred panel with the "Not found" eyebrow, the heading,
  the supporting line, and (generic case) the back action.
- **Two states** — an unknown path ("Nothing here.") and a bad invite token
  ("That invite link doesn’t exist.").

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Eyebrow | Not found | no |
| Unknown path heading | Nothing here. | no |
| Unknown path action | Back to the start | no |
| Bad invite heading | That invite link doesn’t exist. | no |
| Bad invite supporting line | Check it was copied in full. | no |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Back to the start | Unknown-path action | `/`. |

## Validation

- No input is read. An unknown token is detected before any group data is
  rendered.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Back to the start | Unknown-path action | `/` (landing or signed-in home). |
| Recovered invite | The visitor opens a valid link | `screen-join`, `screen-group-open`, or `screen-group-drawn`. |

## Edge cases

- Signed out or signed in: production picks the nav auth action from the
  session; the catalogue shows the signed-in variant.
- Bad invite token: no recovery action is offered; the visitor asks the sender
  for a fresh link.
- The generic and invite states share the shell and card geometry.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial screen doc for the festive v3 design. |
| 2026-11-19 | 0.1.1 | Owner-approved; ported to production with the festive v3 design. |
