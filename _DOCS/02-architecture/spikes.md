# Spikes — open go/no-go questions

Time-boxed investigations with evidence. The question and outcome live here;
evidence lives in `spikes/`.

## Register

| ID | Question | Status | Outcome | Evidence |
|---|---|---|---|---|
| `SP-01` | Does the draw retry loop (500 shuffles) satisfy realistic exclusion sets? | `open` | — | — |
| `SP-02` | Can TrustNet reach localhost callbacks for a dev run? | `pass` | No — back-channel logout and purge need a deployed URL | — |

Status: `open` · `pass` · `fail` · `partial`.

## Rules

- One question per spike; write the outcome even when negative.
- Link every open spike from `07-open_questions/index.md`.
- Spike code is throwaway and lives outside production modules.
