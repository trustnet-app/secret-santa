# CLAUDE.md — Quiet Santa invariants for AI-assisted coding

Quiet Santa is a Secret Santa with wishlists: people sign in with TrustNet and
exchange wishes inside invite-only groups. Its value proposition is **privacy by
default** — no emails, no marketing, and the organiser never learns who drew
whom. When generating or modifying code in this repo, treat the following as
hard constraints.

## Workflow (hard rule — plan first, confirm between parts)

**Never start writing code without an approved plan.** The cycle is:

1. **Plan** the work and **refine it with the project owner** in conversation
   until they approve it.
2. Write the approved plan into `_DOCS/04-development/plan/wip.md` (active work
   in progress), with milestones tracked in
   `_DOCS/04-development/plan/queue.md` and completed parts archived in
   `_DOCS/04-development/plan/done.md`. The plan files hold intent; they are
   updated when the plan changes, with the owner's agreement — never silently.
3. Implement **one part at a time**, exactly as planned. If reality forces a
   deviation, stop and renegotiate the plan first.
4. After each part: record what was actually done in
   `_DOCS/04-development/log.md` (what landed, what was verified vs merely
   written, surprises/cost, what is deliberately not done), mark the part's
   status in `wip.md`/`queue.md`, move completed items to `done.md`, and **stop
   — wait for the owner's confirmation before starting the next part.**

This applies to every session, including "small" changes that grow: if a task
turns out to need more than the current approved part, go back to step 1.

## Bug-fix workflow (trigger: "fix reported bugs")

Bug reports are tracked in `_DOCS/04-development/bugs.md`. When the owner says
**"fix reported bugs"**:

1. **Investigate** — read `bugs.md` and investigate every listed bug in the
   codebase.
2. **Plan** — write the investigation findings and fix plan into
   `_DOCS/04-development/plan/wip.md`.
3. **Track** — record each bug's progress and status in `bugs.md`, showing the
   status inline (`[ ] open`, `[~] in progress`, `[x] fixed`, `[!] blocked`).
4. **Stop** — wait for the owner's confirmation before writing any fix code.
5. **Archive** — once fixed, move the work from `wip.md` to
   `_DOCS/04-development/plan/done.md`.

This is the plan-first cycle applied to bugs; the same confirmation gate and
logging rules apply.

## Change-request workflow (trigger: "implement changes")

Minor change requests are tracked in `_DOCS/04-development/changes.md`. When
the owner says **"implement changes"** (or points you at `changes.md`):

1. **Classify** each listed change:
   - **Design-related** — anything that changes a layout, copy, or interaction
     → **work in `_DESIGN` first**: update the rendering and the matching
     `_DOCS` screen/flow doc, get them reviewed, and only then implement the
     production frontend against them.
   - **Anything else** — backend, behaviour, or other non-visual work →
     **analyze and plan first**: investigate the code and write findings + plan
     into `_DOCS/04-development/plan/wip.md`.
2. **Track** — record each change's progress and status in `changes.md`
   (`[ ] open`, `[~] in progress`, `[x] done`, `[!] blocked`).
3. **Stop** — wait for the owner's confirmation before implementing (and, for
   design-related changes, before leaving `_DESIGN` for the code).
4. **Archive** — once done, move the work from `wip.md` to
   `_DOCS/04-development/plan/done.md`.

## Terminology (be specific, no euphemisms)

- **TrustNet subject** — the pairwise pseudonymous identifier (`sub`, stored as
  `users.sub`) TrustNet returns for this person on this device; the only
  identity Quiet Santa holds. A different TrustNet persona is a different user.
- **Session** — the local server-side row in `sessions`, identified by an
  opaque cookie. It stores the TrustNet `sid` and the `id_token` only as a
  logout hint.
- **Group** — an invite-only gift exchange, addressed by an unguessable
  `groups.token` (the invite link).
- **Member** — a user inside a group, with a per-group `nickname`.
- **Wish** — an item typed by a member for their own group; members may claim
  wishes of their giftee.
- **Exclusion** — an organiser-defined pair that must not be drawn together.
- **Draw** — the one-time assignment of givers to giftees; `groups.drawn_at`
  records it. Members only ever see their own assignment; the organiser sees
  only that the draw happened.

## Read first

- `_DOCS/04-development/plan/wip.md` & `queue.md` — **the approved plan & work
  queue**. Work outside the plan is a workflow violation.
- `_DOCS/04-development/log.md` — **where the build currently is**: what
  landed, what is deliberately stubbed, what must not ship as-is.
- `_DOCS/00-overview.md` → then the numbered docs in order.
- `_DOCS/02-architecture/decisions/` — the stack and boundary decisions.
- `_DOCS/04-development/security-guards.md` — enforceable rules.
- `_DOCS/07-open_questions/index.md` — every unresolved question.

## Hard invariants (never violate, never "temporarily" bypass)

1. **Never log secrets, tokens, or personal data.** No `id_token`, cookie, CSRF
   value, `client_secret`, wish text, or TrustNet `sub` in logs.
2. **One identity source.** The TrustNet `sub` (PPID) is the only identity
   Quiet Santa stores; never add email, name, or address columns.
3. **The organiser must not learn the assignment.** Do not expose draw results
   in organiser-facing HTML, JSON, logs, or links; only the giver sees their
   giftee.
4. **Sign-in and authorisation are decided server-side.** UI hiding is
   convenience only; every group action re-checks membership/organiser rights.
5. **Fake login never runs in production.** `/dev/login` is enabled only when
   `NODE_ENV !== "production"` and `DEV_FAKE_LOGIN=1`.
6. **Secrets live only in gitignored env files** (`oauth.env`, `.env`) or the
   runtime secret store; never in code, docs, or commits.
7. **New personal-data columns require** an inventory entry in
   `_DOCS/06-compliance/` in the same change.

## Code placement

- `src/server.js` — pages and form actions; thin HTTP handlers.
- `src/auth.js` — TrustNet OIDC, sessions, back-channel logout, purge webhook.
- `src/draw.js` — the draw algorithm only.
- `src/db.js` — SQLite schema and pragmas.
- `src/views.js` — HTML rendering (`APP_NAME` lives at the top).
- `public/` — stylesheet and the few lines of client script.

Keep HTTP handlers thin; domain behaviour belongs in the module that owns it.
Schema changes currently go through `src/db.js` `CREATE TABLE IF NOT EXISTS`
statements; a real migration step is an open question (see
`_DOCS/07-open_questions/index.md`).

## Commands

```sh
npm install
npm start                 # node --env-file-if-exists=.env src/server.js
node --env-file=oauth.env src/server.js   # run with a specific env file
```

There is no lint, typecheck, unit-test, or e2e gate configured yet; adding them
is tracked in `_DOCS/04-development/plan/queue.md`. The Playwright scaffold in
`_TEST/` only runs a smoke check.

## When unsure

If a change touches **auth, sessions, the draw, private wishes, or data
retention**, stop, check the docs above, and prefer writing/updating an ADR in
`_DOCS/02-architecture/decisions/` over guessing.
