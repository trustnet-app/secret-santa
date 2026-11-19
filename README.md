# Quiet Santa

Secret Santa with wishlists, free to use. People sign in with TrustNet; the app
stores a pseudonymous ID, the nickname TrustNet shares for each group and the
wishes people type. No emails, and no in-app nickname onboarding.

Node 22.9+, Express, SQLite (one file), no build step.

## Try it locally

Against live TrustNet (what `oauth.env` is for):

```sh
npm install
node --env-file=oauth.env src/server.js
# open http://localhost:5556
```

Without a TrustNet account:

```sh
npm install
cp .env.example .env        # set DEV_FAKE_LOGIN=1
npm start
```

Open `http://localhost:5556/dev/login?as=alice`, start a group, then join it as
`bob` and `carol` in private windows (`/dev/login?as=bob`) using the invite
link. The fake handle after `as=` is used as the nickname. The fake login is
switched off when `NODE_ENV=production`.

## Connect TrustNet

Register the app at <https://me.trustnet.app/rp/new>. For local work, turn on
the **Local development** switch (allows `http://localhost`, skips host proof).

| Portal field                  | Value                                      |
| ----------------------------- | ------------------------------------------ |
| Redirect URI                  | `<BASE_URL>/redirect`                 |
| Post-logout redirect URI      | `<BASE_URL>/` (with the trailing slash)    |
| Back-channel logout URI       | `<BASE_URL>/auth/backchannel-logout`       |
| Purge webhook URL (optional)  | `<BASE_URL>/auth/purge`                    |
| Scopes                        | `openid` only                              |
| Grant types                   | `authorization_code`                       |
| Claims                        | `nickname` (with a reason shown at consent)|

The app requests the nickname claim at sign-in with the standard `claims`
parameter. It never asks for a nickname in its own forms; if the claim is
missing, it sends the person back to TrustNet to approve it.

Put the `client_id` and `client_secret` (shown once) into the env file, set
`DEV_FAKE_LOGIN=0`, and restart. For production, prove your domain with the DNS
TXT record the portal gives you, set `BASE_URL` to the public HTTPS address and
run with `NODE_ENV=production`.

TrustNet must be able to reach the back-channel logout and purge URLs from the
internet, so those two only work on a deployed copy, not on localhost.

## Where things are

- `src/auth.js` — sign-in, callback, back-channel logout, erasure webhook, sessions
- `src/server.js` — pages and actions
- `src/draw.js` — the draw
- `src/views.js` — HTML (app name is `APP_NAME` at the top)
- `src/db.js` — schema
- `public/` — stylesheet and a few lines of script

## Repo layout

This repository is **documented first, planned before it is built, and worked by
both humans and AI agents**. The binding workflow is in [`CLAUDE.md`](CLAUDE.md);
the agent entry point is [`AGENTS.md`](AGENTS.md).

| Path | Job | Question it answers |
|---|---|---|
| [`_DOCS/`](_DOCS/) | Specification and decision record | *What are we building, and why?* |
| [`_DESIGN/`](_DESIGN/) | Visual/UX laboratory (Jinja2 catalogue) | *What does it look like?* |
| [`_DEV/`](_DEV/) | Local environment (compose, proxy, config, seed) | *How do I run it locally?* |
| [`_TEST/`](_TEST/) | End-to-end suite (Playwright against `_DEV`) | *Does it work end to end?* |
| `src/`, `public/` | The application | *How does it work?* |

Start reading at [`_DOCS/00-overview.md`](_DOCS/00-overview.md); the approved
plan lives in [`_DOCS/04-development/plan/`](_DOCS/04-development/plan/).

## Good to know

- A TrustNet user who signs in with a different persona arrives as a different
  person here, because the ID is per persona.
- Quiet Santa is free to use. There is no email, ad, or tracking model.
- Nicknames come from TrustNet. Two people with the same nickname in one group
  get a numeric suffix (`Alex`, `Alex (2)`).
- Signing out ends the Quiet Santa session and returns to the homepage; it does
  not end your TrustNet session.
- The organiser cannot see who drew whom. Anyone with database access can.
- Deploy on a host with a persistent disk for the SQLite file (a small VPS,
  Fly.io or Railway with a volume). Back the file up.
- Not included yet: editing a group, leaving a group yourself, reminders,
  rate limiting. Tracked in
  [`_DOCS/07-open_questions/index.md`](_DOCS/07-open_questions/index.md).
