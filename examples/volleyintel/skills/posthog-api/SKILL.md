---
name: posthog-api
description: Pull VolleyIntel traffic and product usage metrics from PostHog API scripts.
metadata:
  openclaw:
    requires:
      bins:
        - node
---

# PostHog API

Use this skill to fetch PostHog metrics for VolleyIntel reporting workflows.

## Commands

Run from this skill directory:

```bash
node {baseDir}/scripts/posthog.mjs web
node {baseDir}/scripts/posthog.mjs usage
```

## Modes

- `web`: website pageview trend and totals
- `usage`: product engagement events and recent activity

## Requirements

- `POSTHOG_PERSONAL_API_KEY`
- `POSTHOG_PROJECT_ID`

If env vars are not set in process env, the script falls back to `~/.openclaw/.env`.

## Output

Each command returns JSON to stdout with:

- `mode`
- query result payloads
- status metadata from PostHog API responses
