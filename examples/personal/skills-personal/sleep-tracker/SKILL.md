---
name: sleep-tracker
description: Track and analyze Adam's sleep quality, alcohol consumption, and food intake in a local SQLite database. Use when Adam mentions sleep quality, wants to log sleep data, asks for insights about sleep patterns, or when the daily sleep reminder triggers.
---

# Sleep Tracker

Track sleep quality correlated with alcohol and food intake to identify patterns affecting Adam's sleep.

## SQLite Database

- **Path:** `~/.openclaw/memory/sleep.sqlite`
- **Table:** `sleep_entries`

## Schema

| Column | Type | Constraint |
|--------|------|------------|
| sleep_date | TEXT | PRIMARY KEY, YYYY-MM-DD |
| sleep_quality | TEXT | Excellent, Good, Fair, Poor, Terrible |
| alcohol | TEXT | None, 1 drink, 2 drinks, 3+ drinks |
| alcohol_details | TEXT | What specifically (wine, whiskey, beer, etc.) |
| food | TEXT | What and how much for dinner |
| wake_ups | INTEGER | How many times woke up in the night |
| stomach_issues | INTEGER | 1 = yes, 0 = no |
| notes | TEXT | Any other relevant notes |
| created_at | TEXT | ISO 8601 UTC |
| updated_at | TEXT | ISO 8601 UTC |

## Workflow

### Logging Sleep Data

Adam will reply to the daily Telegram check-in (or mention sleep at any time) in natural language, for example "Slept okay, had two glasses of wine and pasta, woke up once, stomach was fine." Parse his reply into the columns above. If something critical is ambiguous or missing, ask a quick follow-up, but do not demand a rigid format.

Determine `sleep_date` first:

1. If Adam provides a specific date, use it.
2. If Adam says "last night" or does not specify a date, use yesterday in HST.

Map natural language to the closest values:

- **sleep_quality**: Excellent / Good / Fair / Poor / Terrible — infer from phrases like "great", "okay", "rough", "terrible", etc.
- **alcohol**: None / 1 drink / 2 drinks / 3+ drinks — infer from context ("a couple beers" = 2 drinks)
- **alcohol_details**: What specifically (wine, whiskey, beer, etc.) — pull from his description
- **food**: What and how much for dinner — use his own words
- **wake_ups**: Number of times — infer from "woke up once", "slept through", etc.
- **stomach_issues**: 1/0 — infer from "stomach was off", "sour stomach", "felt fine", etc.
- **notes**: Anything else relevant he mentions

Before writing, check for an existing entry on the same date:

```bash
sqlite3 ~/.openclaw/memory/sleep.sqlite "SELECT * FROM sleep_entries WHERE sleep_date = '2026-02-16';"
```

If a row exists, update it:

```bash
sqlite3 ~/.openclaw/memory/sleep.sqlite "UPDATE sleep_entries SET sleep_quality='Poor', alcohol='2 drinks', alcohol_details='1 wine, 1 whiskey', food='Large dinner, too much food', wake_ups=2, stomach_issues=1, notes='Woke ~1:30am', updated_at=strftime('%Y-%m-%dT%H:%M:%SZ','now') WHERE sleep_date='2026-02-16';"
```

If no row exists, insert:

```bash
sqlite3 ~/.openclaw/memory/sleep.sqlite "INSERT INTO sleep_entries (sleep_date, sleep_quality, alcohol, alcohol_details, food, wake_ups, stomach_issues, notes) VALUES ('2026-02-16', 'Poor', '2 drinks', '1 wine, 1 whiskey', 'Large dinner, too much food', 2, 1, 'Woke ~1:30am');"
```

### Analyzing Patterns

When Adam asks for insights:

1. Query recent entries (last 2-4 weeks):

```bash
sqlite3 -header -column ~/.openclaw/memory/sleep.sqlite "SELECT * FROM sleep_entries WHERE sleep_date >= date('now', '-28 days') ORDER BY sleep_date DESC;"
```

2. Analyze correlations between:
   - Alcohol consumption and sleep quality
   - Food amount/type and stomach issues
   - Wake ups and alcohol/food patterns
3. Provide actionable insights

## Daily Reminder

A cron job runs at 8:15 AM HST and checks whether Adam already submitted sleep feedback today (HST) by querying the SQLite database. If an entry exists for yesterday's date (HST), skip outreach. If not, send a friendly Telegram message asking how he slept. Adam replies in natural language and the agent parses his response into structured SQLite data.

**Cron delivery**: use direct send logic to `telegram:-5251546190` (sleep tracker group) only when outreach is needed.

## Adam's Context

- Struggles with broken sleep, especially when needing to pee or having sour stomach
- Looking to identify patterns between dinner/alcohol and sleep quality
- HST timezone - always use HST dates when logging
