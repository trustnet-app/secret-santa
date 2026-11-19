---
id: screen-join
type: screen
title: Join a group (invite link)
status: approved
version: 0.1.1
updated: 2026-11-19
owners: []
route: /g/{token}
area: public
related:
  flows: [group-exchange, sign-in]
  states: []
  sequences: []
  code: [src/views.js, src/server.js]
---

# Join a group (invite link) — screen

## Purpose

The invite-link landing at `/g/{token}` for someone who is not a member of the
group. It shows the group facts, the organiser and the member count, then starts
TrustNet sign-in or joins the visitor. A member who opens the same link goes
straight to the group screen instead.

## Layout

- **Product nav** — Quiet Santa wordmark on the left; Sign in when signed out,
  Sign out when signed in.
- **Invite card** — a centred card with the wax-seal mark, eyebrow "You’re
  invited", the group name, the facts (budget and exchange date), and the
  invitation line. The card’s inner dashed frame is decorative.
- **State action** — below the invitation line, one of: the signed-out sign-in
  action with the TrustNet trust line; the join action with the identity line;
  the nickname notice with the re-approval action; or the closed notice.
- **Errors** — a flash error appears above the state action.

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Nav wordmark | Quiet Santa | yes |
| Nav action (signed out) | Sign in | no |
| Nav action (signed in) | Sign out | no |
| Eyebrow | You’re invited | no |
| Group heading | {group} | no |
| Fact | Budget {budget} | no |
| Fact | Exchange on {date} | no |
| Invitation line | {organiser} invited you to a Secret Santa. {n} people have joined so far. | no |
| Invitation line (n = 1) | {organiser} invited you to a Secret Santa. 1 person has joined so far. | no |
| Signed-out action | Sign in to join | no |
| Trust line | You sign in with TrustNet. No email address reaches this site, and creating a TrustNet account brings you straight back here. | yes |
| Signed-in action | Join the group | no |
| Identity line | You’ll appear as {nickname}. This comes from TrustNet. | yes |
| Nickname notice | TrustNet didn’t share a nickname, so you can’t join yet. | yes |
| Re-approval action | Sign in again and share a nickname | no |
| Closed notice | The names have already been drawn, so this group is closed. Ask {organiser} to undo the draw if you should be in it. | yes |
| Flash error | {error} | no |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Sign in to join | Signed-out action | `/login?next=/g/{token}`; TrustNet returns to the group. |
| Join the group | Signed-in action | `POST /g/{token}/join`; the group screen opens with a "You’re in" notice. |
| Re-approve nickname | Nickname action | `/login?reauth=1&next=/g/{token}`. |
| Sign out | Nav action (signed in) | `POST /logout`; lands on `/`. |

## Validation

- The invite token must exist; an unknown token renders the not-found screen.
- Joining is refused after the draw (`requireOpen`).
- An approved TrustNet `nickname` claim is required; the server refuses a join
  without one.
- Duplicate nicknames inside one group get a numeric suffix (`Alex`, `Alex (2)`).
- A signed-in visitor with an existing membership renders the group screen
  instead of this one.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Signed in, not a member | Sign in to join | TrustNet authorization, returning to this screen. |
| Joined | Join the group | `screen-group-open` with a notice. |
| Nickname re-approval | Re-approval action | TrustNet authorization, returning to this screen. |
| Names already drawn | Open a drawn group as a non-member | This screen with the closed notice. |
| Unknown token | Open a bad invite link | `screen-not-found` (bad invite link). |
| Already a member | Open the invite link | `screen-group-open` or `screen-group-drawn`. |
| Signed out | Sign out | `/` (landing). |

## Edge cases

- One member: the invitation line uses the singular "1 person has".
- Drawn group: no join action; the closed notice explains the undo path.
- Missing nickname: no join action; only the re-approval path.
- Duplicate nickname: the join succeeds with the auto-suffixed name.
- No budget or date: the corresponding fact chip is absent.
- Long group names and organiser nicknames must wrap inside the card.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial screen doc for the festive v3 design. |
| 2026-11-19 | 0.1.1 | Owner-approved; ported to production with the festive v3 design. |
