# Flow — Sign in with TrustNet

- **Actor:** Visitor with or without an account.
- **Trigger:** Any page that needs identity (`/`, `/login`, an invite link).
- **Outcome:** A local session bound to the TrustNet subject, or a cancelled
  sign-in that shares nothing.

## Steps

1. Visitor opens `/`. Signed out, the landing page is shown.
2. Visitor follows the sign-in link to `/login`.
3. `src/auth.js` builds an authorization-code + PKCE request to
   `TRUSTNET_ISSUER` with scope `openid`, a `claims` request for `nickname`
   (`{"id_token":{"nickname":null}}`), `state`, `nonce`, and
   `redirect_uri = <BASE_URL>/redirect`.
4. TrustNet authenticates the person and redirects to `/redirect`.
5. The app validates `state`, exchanges the code at the token endpoint,
   verifies the ID token (issuer, audience, nonce), reads the approved
   `nickname` claim when present, then upserts the user by `sub` and creates a
   session row. `sub` remains the only identity key; the nickname only seeds
   `members.nickname`.
6. The visitor is returned to the page that asked for sign-in.
7. Cancelling at TrustNet returns to `/` with `?cancelled` and the notice
   "Sign-in cancelled. Nothing was shared."

## Nickname claim

The app never asks for a nickname in its own forms. When a signed-in person
creates or joins a group, `sessionNickname` reads the claim from the stored ID
token. Duplicate names inside one group get a numeric suffix (`Alex`,
`Alex (2)`).

If the claim is absent (denied, undeclared, or the persona has none), the home
and join pages show a "Sign in again and share a nickname" link to
`/login?reauth=1&next=…`. Re-approval starts a fresh OIDC request even when a
local session exists and adds `prompt=consent`; a successful callback replaces
the old local session. The app does not invent a nickname.

## Local fake login

When `NODE_ENV !== "production"` and `DEV_FAKE_LOGIN=1`, `/dev/login?as=<name>`
creates a synthetic session so several people can be tested in one browser
profile set. The handle after `as=` is used as the nickname. It never runs in
production (`src/auth.js` gate).

## Sign-out

`POST /logout` deletes the local session row, clears the session cookie, and
redirects to `/`. It does not end the TrustNet SSO session; that is controlled
by TrustNet (and its back-channel logout). A stale sign-out form with no local
session also lands on `/`.

## Postcondition

The browser holds an opaque session cookie; the database holds one `users` row
for this TrustNet subject and one `sessions` row. The stored ID token may
include the approved `nickname` claim.
