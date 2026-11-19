---
id: screen-home-signed-in
type: screen
title: Home (signed in)
status: approved
version: 0.1.1
updated: 2026-11-19
owners: []
route: /
area: dashboard
related:
  flows: [group-exchange]
  states: []
  sequences: []
  code: [src/views.js, src/server.js]
---

# Home (signed in) — screen

## Purpose

The signed-in home at `/`. It lists the groups the visitor belongs to, starts a
new group, and surfaces the TrustNet nickname requirement when the claim is
missing. Signed-out visitors see the landing instead (`screen-home`).

## Layout

- **Product nav** — Quiet Santa wordmark on the left; Sign out on the right.
- **Page header** — eyebrow "Your exchanges" and the page heading. With groups,
  the heading is "Your groups"; without groups, it is "Start your first group"
  with its supporting line.
- **Your groups** — a panel containing the group cards. Each card shows the group
  name and its state: "Names drawn" or "{n} joined, waiting for the draw".
- **New group** — a panel with the create form: group name, optional budget,
  optional gift exchange date, and the primary action. With existing groups the
  panel heading is "Start another group"; on the first-group screen the header
  above already carries the heading.
- **Nickname notice** — when the session has no approved nickname claim, the
  create form is replaced by the notice and a re-approval action.
- **Errors** — a flash error appears above the create region.

## Copy

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| Nav wordmark | Quiet Santa | yes |
| Nav action | Sign out | no |
| Page eyebrow | Your exchanges | no |
| Heading (has groups) | Your groups | no |
| Heading (no groups) | Start your first group | no |
| Empty supporting line | It takes a minute. The name, budget and date can’t be edited afterwards, so check them. | yes |
| Group count | {n} groups | no |
| Group state (drawn) | Names drawn | no |
| Group state (open) | {n} joined, waiting for the draw | no |
| New-group heading | Start another group | no |
| Form note | Your name in this group comes from the nickname TrustNet shares. | yes |
| Field | Group name | no |
| Field | Budget (optional) | no |
| Field | Gift exchange date (optional) | no |
| Primary action | Start the group | no |
| Nickname notice | TrustNet didn’t share a nickname, so you can’t start a group yet. | yes |
| Re-approval action | Sign in again and share a nickname | no |
| Flash error | {error} | no |

## Actions

| Action | Trigger | Result |
| --- | --- | --- |
| Open a group | Select a group card | `/g/{token}` (the group screen). |
| Start the group | Submit the create form | `POST /groups`; on success the new group screen opens. |
| Re-approve nickname | Re-approval action | `/login?reauth=1&next=%2F`. |
| Sign out | Nav action | `POST /logout`; lands on `/`. |

## Validation

- Group name is required and cleaned to 60 characters; the server rejects an
  empty name.
- Budget is optional, cleaned to 30 characters.
- Gift exchange date is optional and accepted only as `YYYY-MM-DD`.
- An approved TrustNet `nickname` claim is required to create a group; the server
  refuses the POST when it is missing.
- Budget and date cannot be edited after creation.

## Navigation outcomes

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| Group opened | Group card | `screen-group-open` or `screen-group-drawn` for that token. |
| Group created | Start the group | The new group screen. |
| Nickname re-approval | Re-approval action | TrustNet authorization, returning to `/`. |
| Signed out | Sign out | `/` (landing). |
| Validation error | Failed create | This screen with the flash error. |

## Edge cases

- No groups: the header becomes "Start your first group" and the create panel
  carries the form without a duplicate heading.
- Missing nickname: the group list still renders; the create region becomes the
  notice plus the re-approval action.
- Duplicate group names are allowed; groups are identified by token.
- Group names and nicknames may be long and must wrap without overflow.
- The flash error is one-time and cleared on render; it is never read from a
  link.

## Open questions

_None._

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| 2026-11-19 | 0.1.0 | Initial screen doc for the festive v3 design. |
| 2026-11-19 | 0.1.1 | Owner-approved; ported to production with the festive v3 design. |
