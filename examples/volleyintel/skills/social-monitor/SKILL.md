---
name: social-monitor
description: Monitor mentions on X, Reddit, Instagram, and Threads and log mention results to SQLite.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Social Monitor

Check direct mentions of VolleyIntel across all business channels.

## Required platform skills

- X via `skills/x-browser`
- Reddit via `skills/reddit-browser`
- Instagram via `skills/instagram-browser`
- Threads via `skills/threads-browser`

## Run policy

- Check all four platforms every run.
- Do not skip any platform.
- Use this script for mention logging:

```bash
node skills/social-monitor/scripts/mentions.mjs list --db memory/mentions.db
```

## Sources

### X

Use `skills/x-browser` to check:
- direct mentions for `@volleyintel`
- search for `@volleyintel`
- search for `volleyintel`

### Reddit

Use `skills/reddit-browser` to search:
- `volleyintel`
- `volley intel`

### Instagram

Use `skills/instagram-browser` to search:
- `volleyintel`
- `@volleyintel`

### Threads

Use `skills/threads-browser` to search:
- `volleyintel`

## Logging

- Log each mention using:

```bash
node skills/social-monitor/scripts/mentions.mjs create \
  --platform "<x|reddit|instagram|threads>" \
  --username "<account>" \
  --post-url "<url>" \
  --context "<short_context>" \
  --db memory/mentions.db
```

- Before inserting a mention with a URL, check for duplicates:

```bash
node skills/social-monitor/scripts/mentions.mjs check \
  --platform "<x|reddit|instagram|threads>" \
  --post-url "<url>" \
  --db memory/mentions.db
```

## Finish

Do not send any Telegram summary from this skill. The daily `volleyintel-brief` reads `memory/mentions.db` and reports the results there.
