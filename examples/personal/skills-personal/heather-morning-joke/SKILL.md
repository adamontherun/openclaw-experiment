---
name: heather-morning-joke
description: Generate a daily morning dad joke for Heather and deliver it via native OpenClaw cron announce to iMessage from Adam and Rusty. Use when Adam asks for a joke for Heather or when triggered by the Daily morning joke for Heather cron job.
---

# Heather Morning Joke

Generate one fresh, wholesome dad joke for Heather, emit the final plain-text message for native OpenClaw cron delivery to iMessage, and log only a short rolling history.

## Steps

### 1. Fetch fresh Reddit jokes (required)

Fetch 5 to 10 recent r/dadjokes posts with the reddit-readonly skill.

Use:

- `node {baseDir}/../reddit-readonly/scripts/reddit-readonly.mjs posts dadjokes --sort hot --time day --limit 10`

If the first fetch fails, retry once with `--sort top --time day`.

If Reddit still fails, use xai-search as fallback with:

- `node {baseDir}/../xai-search/scripts/xai-search.mjs "best new dad jokes today reddit dadjokes" --model grok-4-1-fast-reasoning --maxSources 8`

### 2. Read rolling dedup history

Read `recent_jokes.md` in this folder. Use only this file for repeat prevention.

Never read legacy full archives.

### 3. Choose or adapt the joke from fetched sources

Pick one candidate from fetched Reddit (or xai-search fallback) and adapt it for Heather if needed.

Rules:

- Do not invent from scratch when fetched candidates are available.
- Do not reuse any joke from `recent_jokes.md`.
- Do not use the pattern "Why did X fall in love with Y" or close variants.
- Keep it short and clean for iMessage.
- Keep tone loving, playful, and surprising.

### 4. Apply day-of-week format rotation

Default rotation:

- Monday: pun or wordplay
- Tuesday: "What do you call...?"
- Wednesday: knock-knock or call-and-response
- Thursday: observational one-liner
- Friday: absurdist or anti-joke
- Saturday: topical joke
- Sunday: wholesome groaner

If a fetched joke is excellent but mismatched, quality wins over strict rotation.

### 5. Emit final delivery text

Message rules:

- from Adam and Rusty
- one main joke
- 1 to 2 emojis
- loving sign-off
- no markdown formatting artifacts
- no escaped characters or escape sequences
- never include literal `\n`, `\t`, `\\`, or JSON-style quoting in the final sent text
- use normal plain text only, with natural line breaks if needed

Final response rules:

- The final response must be only the message text that should be delivered to Heather.
- Do not call `openclaw message send`.
- Do not include explanations, status text, JSON, or markdown.
- The cron job will deliver the final plain text to Heather via iMessage.

### 6. Update rolling history

Append today's entry to `recent_jokes.md` using:

- date (YYYY-MM-DD)
- final sent joke text
- source label (`reddit`, `x`, or `xai-search`)

Then keep only the latest 5 entries and remove older ones.
