# Roadmap

The path from current state to the next release. The roadmap is a summary; the
authoritative queue is [`queue.md`](queue.md).

## Where the project stands

The core exchange works end to end in code: TrustNet sign-in (live issuer
configured locally), invite-only groups, wishes and claims, keep-apart pairs,
draw/undraw, back-channel logout, and the erase webhook. It starts locally on
`:5556`. There is no automated verification gate, no migration tool, and no
operator surface.

## Milestones

| Milestone | Goal | Exit criteria | Status |
|---|---|---|---|
| `M1` | Verification gate | CI runs syntax check + draw unit tests + smoke e2e | `[ ]` |
| `M2` | Schema migrations | Existing `data.sqlite` upgrades without manual DDL | `[ ]` |
| `M3` | Abuse controls | Rate limits on login/join/wishes; invite expiry decision | `[ ]` |
| `M4` | Product docs | Screens + sequences documented from the code | `[ ]` |
| `M5` | Operator basics | Health, session sweep, backup runbook, staging decision | `[ ]` |

## Deployment gates

1. **Callback registration matches `BASE_URL`** — sign-in fails otherwise;
   owner: whoever registers the TrustNet client.
2. **Persistent volume + backup** — data loss otherwise; owner: deployer.
3. **`NODE_ENV=production`** — otherwise fake login stays available; owner:
   deployer.

## Open work

- Bugs: [`bugs.md`](../bugs.md) — none.
- Changes: [`changes.md`](../changes.md) — none open.
- Questions: [`07-open_questions/index.md`](../../07-open_questions/index.md) —
  five open.

## Bottom line

The app is functional but unverified beyond a manual local start. M1 and the
callback registration are the shortest path to a trustworthy release.
