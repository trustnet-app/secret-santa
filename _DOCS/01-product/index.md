# 01-product

Product intent for Quiet Santa: who it serves, the concepts the UI and code
share, and the flows that must not drift.

## Index

| Area | Doc |
|---|---|
| Core concepts and personas | [`core/`](core/README.md) |
| Sign-in flow | [`diagrams/flows/sign-in.md`](diagrams/flows/sign-in.md) |
| Group lifecycle flow | [`diagrams/flows/group-exchange.md`](diagrams/flows/group-exchange.md) |
| Screens | `diagrams/screens/` (see "Gaps" below) |
| States | `diagrams/states/` |
| Sequences | `diagrams/sequences/` |

## The product in one paragraph

A person signs in with TrustNet, creates a group with a name, and shares the
invite link. Others sign in and join with the nickname TrustNet shares, then add
up to twenty wishes. There is no in-app nickname entry. Before the draw the organiser may remove members and
add keep-apart pairs; at least three members are required. The organiser runs
the draw once; afterwards the group is read-only except for wishes and claims.
Each member sees only their own assignment and can mark wishes they intend to
buy.

## Gaps (flagged, not invented)

- No screen or state docs exist yet; the rendered UI is the only record. Adding
  them is queued in [`../04-development/plan/queue.md`](../04-development/plan/queue.md).
- No sequence diagram exists for the TrustNet callback, back-channel logout, or
  purge webhook; behaviour is documented in
  [`../02-architecture/README.md`](../02-architecture/README.md) and
  `src/auth.js`.
