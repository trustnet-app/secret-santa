# Flow — Group exchange

- **Actor:** Organiser and participants.
- **Trigger:** Someone wants to run a Secret Santa.
- **Outcome:** Every member has exactly one giftee, or the group is restored to
  the open state.

## Steps

1. A signed-in person posts `/groups` with a group name and optional budget and
   exchange date. The app takes the creator's nickname from the approved
   TrustNet nickname claim, creates the group, and adds the creator as a member
   (organiser).
2. The organiser shares `/g/<token>` (the invite link).
3. A signed-in visitor opens the link, sees the organiser's nickname and member
   count, and posts `/g/<token>/join`; the app joins them with their TrustNet
   nickname. There is no nickname form, and a duplicate name inside the group
   gets a numeric suffix.
4. Members add wishes (`POST /g/:token/wishes`), delete their own
   (`.../wishes/:id/delete`), and toggle a claim on someone else's wish
   (`.../wishes/:id/claim`). A member never sees who claimed their own wishes.
5. While the group is open, the organiser may remove a member
   (`.../members/:id/remove`) and add or delete exclusions
   (`.../exclusions`).
6. With at least three members, the organiser runs the draw
   (`POST /g/:token/draw`). The ring algorithm in `src/draw.js` retries up to
   500 shuffles to satisfy all exclusions; on failure the group stays open with
   the error "No draw fits those keep-apart rules."
7. After the draw, join/roster/exclusion routes are refused by `requireOpen`;
   wishes and claims remain available. Each member sees only their own
   assignment.
8. The organiser may undo the draw (`POST /g/:token/undraw`), deleting all
   assignments and clearing `drawn_at`.

## Nickname rule

Creating or joining requires an approved `nickname` claim. If it is missing,
the page offers `/login?reauth=1&next=…` so the person can approve it at
TrustNet; the app never asks for a nickname itself. Existing memberships keep
the name stored when they joined.

## Postcondition

Open: members and wishes may change. Drawn: assignments exist for every member,
`drawn_at` is set, and no route reveals another member's assignment.
