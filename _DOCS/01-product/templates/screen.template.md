---
id: screen-<slug>
type: screen
title: <Name of the screen>
status: draft            # draft | review | approved | deprecated
version: 0.1.0
updated: <YYYY-MM-DD>
owners: []
route: <url path>
area: <auth | dashboard | admin | public>   # which area hosts it
related:
  flows: []              # e.g. [flow-user-login]
  states: []
  sequences: []
  code: []
---

# <Title> — screen

## Purpose

<!-- 1-3 sentences. Which flow step(s) render this screen and what the user
achieves here. -->

## Layout

<!-- The screen's regions, keyed to the flow node labels that produce them
(e.g. "form fields", "inline error region", "primary action"). -->

## Copy

<!-- Screen copy is specified as STRUCTURE with placeholders, not final
microcopy. Voice/tone is finalized in _DESIGN (design system). Placeholders:
{service} (display name), {user} (display name), {n} (count).
Strings marked Pinned are load-bearing (legal/UX guarantees); they must not
change without a spec change. -->

| Element | Copy (placeholder form) | Pinned |
| --- | --- | --- |
| <region/element> | <string with placeholders> | no / yes |

## Actions

<!-- Every user action on the screen. Client-side only; authority stays
server-side. -->

| Action | Trigger | Result |
| --- | --- | --- |
| <label> | <user gesture> | <what happens> |

## Validation

<!-- Client-side rules are convenience only; list them here and point at the
authoritative check. -->

## Navigation outcomes

<!-- Where the user can go from this screen and what makes each path happen. -->

| Outcome | Trigger | Next screen / exit |
| --- | --- | --- |
| <name> | <event> | <screen id or exit> |

## Edge cases

- <Unusual state and how the screen handles it.>

## Open questions

- [ ] <Unresolved decision.>

## Changelog

| Date | Version | Change |
| --- | --- | --- |
| <YYYY-MM-DD> | 0.1.0 | Initial draft. |
