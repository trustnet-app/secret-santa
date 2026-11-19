# 03-runtime

How Quiet Santa runs: environments, local development, configuration, and
secrets. `_DEV/` is **how to run it locally**; this folder explains **what the
environments are and why they differ**.

## Contents

| File | Covers |
|---|---|
| `local-dev.md` | The `_DEV/` stack: single Node origin on :5556 |
| `environments.md` | local / production differences and access |
| `secrets.md` | Where secrets come from and who can read them |

## Rules

- Record **deliberate differences** between local and production, and why.
- Every environment-specific pin (`BASE_URL`, `NODE_ENV`, callback URLs) is
  documented here.
- No secret values in this folder — only paths, names, and access rules.

## Local dev pointer

The runnable stack lives in [`../../_DEV/`](../../_DEV/). Its README is the
canonical quick start; this folder explains the environment, not the commands.
