---
id: screen-group-drawn
type: screen
title: Group (drawn)
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
  code: [src/views.js, src/server.js]
---

# Group (drawn) — screen

## Purpose

The group screen after the draw. Each member unfolds only their own slip, reads
the group’s wishlists, and marks what they intend to buy. The organiser can tell
the group and undo the draw; nobody can learn another member’s assignment.

## Layout

- **Product nav** — Quiet Santa wordmark on the left; Sign out on the right.
- **Page header** — eyebrow "The draw is done", the group name, and the budget
  and exchange-date facts.
- **Reveal** — the visual centrepiece: a paper gift tag inside a festive panel.
  The tag is a disclosure: it starts folded and opens to show "You’re buying for"
  and the giftee’s nickname. Only the visitor’s own assignment is rendered.
- **Tell the group** — organiser only. A panel with the explanation and a
  readonly message containing the group name and invite link.
- **Wishlists** — "Your wishlist" and "Everyone else’s wishes" in the main
  column. The visitor’s match is marked with a "your match" badge; claim toggles
  remain available.
- **Group sidebar** — the member list, read-only (no remove actions). Organisers
  also see the undo panel; everyone sees the start-a-group action.

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Nav wordmark | Quiet Santa | yes |
| Nav action | Sign out | no |
| Page eyebrow | The draw is done | no |
| Group heading | {group} | no |
| Fact | Budget {budget} | no |
| Fact | Exchange on {date} | no |
| Reveal summary | Unfold your slip | no |
| Reveal line | You’re buying for | no |
| Reveal name | {giftee} | no |
| Tell heading | Tell the group | no |
| Tell explanation | Nobody gets an email, so paste this into your group chat. | yes |
| Tell message | The names are drawn for {group}. Open your slip here: {inviteUrl} | no |
| Your wishlist heading | Your wishlist | no |
| Your wishlist explanation | The others can see it and mark what they’re getting. You can’t see their marks. | yes |
| Remove wish | Remove | no |
| Wish field | A wish | no |
| Link field | Link (optional) | no |
| Add wish | Add wish | no |
| Others heading | Everyone else’s wishes | no |
| Match badge | your match | no |
| No wishes | No wishes yet. | no |
| Claim action | I’m getting this | no |
| Un-claim action | I’m not getting this after all | no |
| Claimed by other | Someone’s getting this | yes |
| Members heading | {n} in the group | no |
| Member markers | (you), (organiser) | no |
| Undo heading | Undo the draw | no |
| Undo explanation | Reopens the group so people can join or leave. Everyone gets a new match when you draw again. | no |
| Undo action | Undo the draw | no |
| Undo confirmation | Undo the draw? Everyone will get a new match next time. | yes |
| Start action | Start a group of your own | no |
| Flash notice | {notice} | no |
| Flash error | {error} | no |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Unfold the slip | Reveal summary | Opens the disclosure; the giftee’s nickname is shown. |
| Copy the tell-the-group message | Select the readonly message | The organiser can paste it; no server call. |
| Add a wish | Add wish | `POST /g/{token}/wishes`; the wish appears in the visitor’s list. |
| Remove a wish | Remove on own wish | `POST /g/{token}/wishes/{id}/delete`. |
| Claim a wish | I’m getting this | `POST /g/{token}/wishes/{id}/claim`. |
| Un-claim a wish | I’m not getting this after all | The same claim route clears the visitor’s claim. |
| Undo the draw | Organiser, Undo the draw | Confirmation, then `POST /g/{token}/undraw`; the group reopens. |
| Start a group of your own | Start action | `/`. |
| Sign out | Nav action | `POST /logout`; lands on `/`. |

## Validation

- Only the visitor’s own assignment is read and rendered; no route exposes
  another member’s assignment.
- Organiser-only actions re-check organiser rights server-side.
- Undo deletes every assignment and clears `groups.drawn_at` after the client
  confirmation.
- Wishes and claims remain available after the draw; the twenty-wish limit, wish
  text, and link rules are unchanged.
- Join, roster, and exclusion changes are refused after the draw.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Draw undone | Undo the draw | `screen-group-open` with a notice. |
| Start another group | Start a group of your own | `/` (signed-in home). |
| Signed out | Sign out | `/` (landing). |
| Wish / claim changed | Wish action | This screen, refreshed. |

## Edge cases

- The reveal starts folded in production; without opening it, the page still
  explains that a slip is available. Only the visitor’s own giftee is present in
  the HTML. The catalogue renders it open so the revealed state is reviewable.
- Organiser view adds the tell-the-group and undo panels; the member view omits
  them.
- No wishes yet for a member: "No wishes yet."
- A wish claimed by another member: struck through with "Someone’s getting
  this".
- Long giftee nicknames must wrap inside the tag; the tag width is capped.
- A drawn group with no assignment for the visitor is a data error; the reveal
  falls back to "nobody yet" rather than inventing a giftee.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial screen doc for the festive v3 design. |
| 2026-11-19 | 0.1.1 | Owner-approved; ported to production with the festive v3 design. |
