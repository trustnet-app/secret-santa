# Networking — hosts, TLS, TrustNet callbacks

## Local

| URL | Serves |
|---|---|
| `http://localhost:5556` | the whole app (pages, forms, auth, webhooks) |
| `http://localhost:5556/login` | sign-in start (redirects to TrustNet) |
| `http://localhost:5556/redirect` | OIDC callback |

The Node process is the only origin; there is no local reverse proxy.

## Production

- One public HTTPS host; `BASE_URL` set to it with no trailing slash.
- `NODE_ENV=production` (disables fake login; sets secure cookie behaviour from
  `BASE_URL` starting with `https://`).
- TrustNet must reach the back-channel logout and purge URLs from the internet,
  so both only work on a deployed copy.

## TrustNet registrations

| Field | Value |
|---|---|
| Redirect URI | `<BASE_URL>/redirect` |
| Post-logout redirect | `<BASE_URL>/` |
| Back-channel logout | `<BASE_URL>/auth/backchannel-logout` |
| Purge webhook | `<BASE_URL>/auth/purge` |
| Scopes / grant | `openid` / `authorization_code` |
| Claims | `nickname` (declared with a reason shown at consent) |

## Callback registration

The local live client is registered with `http://localhost:5556/redirect`; the
app runs on `:5556` and serves the callback at `/redirect` to match. Keep the
portal registration and `BASE_URL` in sync.
