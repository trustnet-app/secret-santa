# Core concepts

## Personas

| Persona | Description | Needs |
|---|---|---|
| Participant | Friends, family, or colleagues in an exchange | Join by link, add wishes, learn their giftee, mark what they plan to buy |
| Organiser | The participant who created the group | Name the group, set a budget/date, manage members and keep-apart pairs, run/undo the draw |
| TrustNet | The identity provider | Authenticate the person; provide a pairwise `sub` and the approved `nickname` claim; notify logout and erasure |

There is no administrator persona and no operator UI.

## Domain concepts

- **Group** — invite-only exchange. Fields: name, token, budget text, exchange
  date (optional `YYYY-MM-DD`), organiser, `drawn_at`.
- **Member** — user + group + per-group nickname taken from the TrustNet
  `nickname` claim (case-insensitive unique after auto-suffixing duplicates).
- **Wish** — up to 20 per member in `server.js`; text (120 chars), optional
  `http(s)` URL, optional `claimed_by` member.
- **Exclusion** — organiser-defined keep-apart pair (symmetric, de-duplicated).
- **Assignment** — one row per giver; only the visitor's own row is read for
  display.
- **Session** — opaque cookie bound to a server row; carries the TrustNet `sid`
  and `id_token` as a logout hint and as the source of the nickname claim.
- **Purge delivery** — replay guard for TrustNet erasure webhooks.

## Lifecycle

```text
created → open (join, wishes, exclusions, members managed)
        → drawn (join and roster changes stop; wishes and claims continue)
        → open again (organiser undraws; assignments deleted)
```

A group never has more than one draw at a time; `groups.drawn_at` is the switch.
