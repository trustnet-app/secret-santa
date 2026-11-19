# 0002 — Member nicknames from the TrustNet nickname claim

- Status: accepted
- Date: 2026-11-19

## Context

Quiet Santa used to ask each person to type a nickname when creating or joining
a group. TrustNet can disclose a `nickname` claim, already declared for this RP
with a reason shown at consent. Asking again duplicates onboarding and creates
a second, avoidable place where personal data is entered.

## Decision

- Request `nickname` in the ID-token target with the standard `claims`
  parameter at `/login`.
- Use the claim only to populate `members.nickname`; `sub` remains the only
  identity key. Do not add a user-level nickname column.
- Remove all in-app nickname inputs.
- If the claim is absent, do not invent a value: show a link to
  `/login?reauth=1&next=…`, which starts a fresh OIDC request with
  `prompt=consent` and replaces the local session on success.
- Disambiguate duplicate names inside a group with a numeric suffix (`Alex`,
  `Alex (2)`).
- Existing memberships keep the nickname stored when they joined; later
  TrustNet changes do not rewrite them.
- Dev fake login uses its `as=` handle as the nickname.

## Consequences

- **Easier:** no nickname onboarding; one source for names; member names stay
  per group.
- **Harder:** creating or joining depends on the claim being approved; a denied
  claim means a re-approval round-trip.
- **Enforced:** the app never falls back to an email, real name, or generated
  pseudonym; no in-app nickname form may be reintroduced without superseding
  this ADR.
