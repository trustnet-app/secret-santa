---
id: screen-group-open
type: screen
title: Group (open)
status: approved
version: 0.1.1
updated: 2026-11-19
owners: []
route: /g/{token}
area: dashboard
related:
  flows: [group-exchange]
  states: []
  sequences: []
  code: [src/views.js, src/server.js, src/draw.js]
---

# Group (open) — screen

## Purpose

The group screen while `groups.drawn_at` is empty. Members add and claim wishes,
the organiser manages the roster and keep-apart pairs, and the organiser runs the
draw. Members see the same wishlists without the organiser tools.

## Layout

- **Product nav** — Quiet Santa wordmark on the left; Sign out on the right.
- **Page header** — eyebrow "Open exchange", the group name, and the budget and
  exchange-date facts.
- **Invite people** — a highlighted panel with the invitation explanation and a
  readonly copy field containing the invite link. Shown to every member until
  the draw.
- **Wishlists** — the main column. "Your wishlist" holds the visitor’s own wishes
  with a remove action and the add form (wish text and optional link). "Everyone
  else’s wishes" groups the other members by nickname, with claim toggles.
- **Group sidebar** — "… in the group" lists the members with (you) and
  (organiser) markers. Organisers also see the keep-apart panel and the draw
  panel; members do not.
- **Organiser tools** — "Who must not draw each other" lists existing pairs and
  the add form; "Draw names" explains the consequence and runs the draw.
- **Notices and errors** — flash feedback appears above the invite panel.

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Nav wordmark | Quiet Santa | yes |
| Nav action | Sign out | no |
| Page eyebrow | Open exchange | no |
| Group heading | {group} | no |
| Fact | Budget {budget} | no |
| Fact | Exchange on {date} | no |
| Invite heading | Invite people | no |
| Invite explanation | Paste this link into your group chat. Anyone with the link can join until the names are drawn. | yes |
| Invite field label | Invite link | no |
| Your wishlist heading | Your wishlist | no |
| Your wishlist explanation | The others can see it and mark what they’re getting. You can’t see their marks. | yes |
| Remove wish | Remove | no |
| Wish field | A wish | no |
| Link field | Link (optional) | no |
| Add wish | Add wish | no |
| Others heading | Everyone else’s wishes | no |
| No wishes | No wishes yet. | no |
| Claim action | I’m getting this | no |
| Un-claim action | I’m not getting this after all | no |
| Claimed by other | Someone’s getting this | yes |
| Members heading | {n} in the group | no |
| Member markers | (you), (organiser) | no |
| Remove member | Remove | no |
| Keep-apart heading | Who must not draw each other | no |
| Keep-apart explanation | Optional. Useful for couples who already buy each other a present. | no |
| Pair | {a} and {b} | no |
| Person field | Person | no |
| Other person field | Other person | no |
| Keep apart action | Keep apart | no |
| Draw heading | Draw names | no |
| Draw explanation | Once you draw, the group closes to new people and everyone can unfold their slip. You won’t see who drew whom. | yes |
| Draw insufficient | You need at least three people. {n} more to go. | no |
| Draw action | Draw names | no |
| Flash notice | {notice} | no |
| Flash error | {error} | no |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Copy the invite link | Select the readonly field | The link can be copied; no server call. |
| Remove a member | Organiser, Remove | `POST /g/{token}/members/{id}/remove`; the roster refreshes. |
| Add a keep-apart pair | Organiser, Keep apart | `POST /g/{token}/exclusions`; the pair appears in the list. |
| Remove a keep-apart pair | Organiser, Remove | `POST /g/{token}/exclusions/{id}/delete`. |
| Draw names | Organiser, Draw names | `POST /g/{token}/draw`; on success the drawn screen opens. |
| Add a wish | Add wish | `POST /g/{token}/wishes`; the wish appears in the visitor’s list. |
| Remove a wish | Remove on own wish | `POST /g/{token}/wishes/{id}/delete`. |
| Claim a wish | I’m getting this | `POST /g/{token}/wishes/{id}/claim`; the row shows the claim state. |
| Un-claim a wish | I’m not getting this after all | The same claim route clears the visitor’s claim. |
| Sign out | Nav action | `POST /logout`; lands on `/`. |

## Validation

- All group actions re-check membership and organiser rights server-side.
- Removing members and changing exclusions are refused after the draw.
- Mutating routes are refused when the group is drawn (`requireOpen`).
- A draw requires at least three members.
- Keep-apart pairs must be two distinct members of the group and are
  de-duplicated in either order.
- A member may have at most twenty wishes; wish text is required and cleaned to
  120 characters; the link is stored only when it is `http`/`https`.
- Claims are only accepted on another member’s wish, and only when unclaimed or
  already claimed by the visitor.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Draw succeeded | Draw names | `screen-group-drawn` with a notice. |
| Draw impossible | Draw names | This screen with the "No draw fits those keep-apart rules" error. |
| Member removed / pair changed | Organiser action | This screen, refreshed. |
| Wish added / removed / claimed | Wish action | This screen, refreshed. |
| Signed out | Sign out | `/` (landing). |

## Edge cases

- Fewer than three members: the draw panel explains how many more are needed and
  offers no draw action.
- No wishes yet for a member: "No wishes yet."
- A wish claimed by another member: struck through with "Someone’s getting
  this"; the visitor cannot claim it.
- No keep-apart pairs: the list is empty; the add form remains.
- Member view: organiser-only panels and remove actions are absent.
- Long wish text, nicknames, and group names must wrap without overflow.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial screen doc for the festive v3 design. |
| 2026-11-19 | 0.1.1 | Owner-approved; ported to production with the festive v3 design. |
