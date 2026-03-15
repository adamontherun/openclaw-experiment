---
name: volleyintel-brief
description: Build a daily business brief with Reddit Ads and Search Console via browser automation plus PostHog, Clerk, social engagement, social mentions, and social content run metrics from SQLite, then send to Telegram.
metadata:
  openclaw:
    requires:
      browser: openclaw
      bins:
        - node
---

# VolleyIntel Daily Brief

Create one concise daily brief and send it to `telegram:-5271219210`.

## Required skills

- `skills/posthog-api`
- `skills/clerk-api`

## Sources

1. Reddit Ads via browser automation:
- Open `https://ads.reddit.com/`
- Click "Go to Dashboard"
- Use the date picker to select "Last 7 days"
- Pull spend, impressions, clicks, CTR, conversions for the period

2. Google Search Console via browser automation:
- Open `https://search.google.com/search-console`
- Click "Performance" → "Full report"
- Pull clicks, impressions, CTR, average position for volleyintel.com
- Click "Pages" tab for top pages
- Click "Queries" tab for top queries

3. PostHog via `skills/posthog-api`:

```bash
node skills/posthog-api/scripts/posthog.mjs web
node skills/posthog-api/scripts/posthog.mjs usage
```

4. Clerk via `skills/clerk-api`:

```bash
node skills/clerk-api/scripts/clerk.mjs
```

5. Social engagement from `memory/engagement.db`:

```bash
TZ=Pacific/Honolulu node scripts/engagement.mjs list --date "$(TZ=Pacific/Honolulu date +%F)" --db memory/engagement.db
```

Use the database output as the source of truth. Summarize:
- total engagement actions today
- accounts engaged today by platform
- reply count today by platform
- any platform with zero logged actions
- never omit this section; if count is zero, explicitly say `No engagement actions logged today`

6. Social mentions from `memory/mentions.db`:

```bash
TZ=Pacific/Honolulu node skills/social-monitor/scripts/mentions.mjs list --date "$(TZ=Pacific/Honolulu date +%F)" --db memory/mentions.db
```

Use the database output as the source of truth. Summarize:
- total new mentions today
- mention count by platform
- the most important new mentions, if any
- explicitly say `No new mentions today` when count is zero
- never omit this section

7. Social content runs from `memory/content.db`:

```bash
sqlite3 memory/content.db ".mode json" "SELECT id, topic, seed_source, image_file, published, created_at, published_at FROM runs WHERE date(datetime(created_at, '-10 hours')) = '$(TZ=Pacific/Honolulu date +%F)' ORDER BY id DESC;"
```

Use the database output as the source of truth. Summarize:
- total social content runs created today
- number published today
- latest run id and topic
- seed source breakdown (`idea-bank` vs `trending`)
- explicitly say `No social content runs today` when count is zero
- never omit this section

## Output format

Use this structure:

- `VolleyIntel Daily Brief - YYYY-MM-DD`
- `REDDIT ADS`
- `WEBSITE (Search Console)`
- `TRAFFIC (PostHog)`
- `PRODUCT USAGE (PostHog)`
- `USERS AND BILLING (Clerk)`
- `SOCIAL ENGAGEMENT`
- `SOCIAL MENTIONS`
- `SOCIAL CONTENT RUNS`

Each section should include current value and one short trend note.
Do not omit any section in the structure above, even when the value is zero or there is no activity.

Use Clerk as the source of truth for user counts, signups, and billing.
