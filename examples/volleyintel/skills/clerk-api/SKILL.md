---
name: clerk-api
description: Pull VolleyIntel user and billing metrics from Clerk API scripts.
metadata:
  openclaw:
    requires:
      bins:
        - node
---

# Clerk API

Use this skill to fetch Clerk metrics for VolleyIntel reporting workflows.

## Command

Run from this skill directory:

```bash
node {baseDir}/scripts/clerk.mjs
```

## Data returned

- users created in last 24 hours
- total user count
- user billing subscription snapshot

## Requirements

- `CLERK_SECRET_KEY`

If env vars are not set in process env, the script falls back to `~/.openclaw/.env`.

## Output

The command returns JSON to stdout with:

- `users24h`
- `totalUsers`
- `subscriptions`
