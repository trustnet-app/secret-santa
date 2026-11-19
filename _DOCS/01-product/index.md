# 01-product

Product intent for Quiet Santa: who it serves, the concepts the UI and code
share, and the flows that must not drift.

## Index

| Area | Doc |
|---|---|
| Core concepts and personas | [`core/`](core/README.md) |
| Sign-in flow | [`diagrams/flows/sign-in.md`](diagrams/flows/sign-in.md) |
| Group lifecycle flow | [`diagrams/flows/group-exchange.md`](diagrams/flows/group-exchange.md) |
| Screens | [`home.md`](diagrams/screens/home.md) (signed out), [`home-signed-in.md`](diagrams/screens/home-signed-in.md), [`join.md`](diagrams/screens/join.md), [`group-open.md`](diagrams/screens/group-open.md), [`group-drawn.md`](diagrams/screens/group-drawn.md), [`not-found.md`](diagrams/screens/not-found.md) |
| States | `diagrams/states/` |
| Sequences | `diagrams/sequences/` |

## The product in one paragraph

Quiet Santa is free to use. A person signs in with TrustNet, creates a group
with a name, and shares the invite link. Others sign in and join with the nickname TrustNet shares, then add
up to twenty wishes. There is no in-app nickname entry. Before the draw the organiser may remove members and
add keep-apart pairs; at least three members are required. The organiser runs
the draw once; afterwards the group is read-only except for wishes and claims.
Each member sees only their own assignment and can mark wishes they intend to
buy.

## Gaps (flagged, not invented)

- Every current screen now has an approved screen doc and a `_DESIGN` template:
  signed-out landing, signed-in home, join, group open, group drawn, and
  not-found. State and sequence docs remain missing; adding them is queued in
  [`../04-development/plan/queue.md`](../04-development/plan/queue.md).
- No sequence diagram exists for the TrustNet callback, back-channel logout, or
  purge webhook; behaviour is documented in
  [`../02-architecture/README.md`](../02-architecture/README.md) and
  `src/auth.js`.
