---
name: daily-brief
description: Generate a concise daily brief covering aerospace and AI/agent updates, then send it as a nicely formatted Telegram message. Use when Adam asks for a daily brief, news roundup, or when triggered by the daily-brief cron job.
---

# Daily Brief

Compile a high-signal daily brief, send it to Telegram as formatted text, and append the sent version to the archive.

## Steps

### 1. Read the archive and build an exclusion list

Read `daily_brief_archive.md` in the workspace. Focus on the last 7 days of entries.

Before gathering any data, extract a bullet-point list of every distinct story, development, or data point already covered. For example: "Toyota 200 engineers / TPS deployment", "Neutron tank rupture Jan 21", "Claude Sonnet 4.6 release", "HASTE vertical at Wallops". This is your **exclusion list**.

Any item on the exclusion list MUST NOT appear in today's brief, even if your searches surface it again. The only exception is a genuinely new development on a previously covered story (e.g. a new earnings result, a launch that actually happened, a price move after the prior brief). In that case, lead with what is new and do not re-summarize the background.

### 2. Gather data

Use Web (tavily-search + web_search) and Reddit (reddit-readonly) only. The brief must focus on items from the past 24 hours. Do not use X/Twitter as a source.

**Web (tavily-search and web_search)**

Use both in parallel for coverage. Enforce recency by checking publish dates and your exclusion list.

**Tavily (tavily-search skill)** — best for news: use `--topic news --days 1` so results are limited to the last day. Use `-n 8` (or similar) per query. Run from the skill dir: `node {baseDir}/../tavily-search/scripts/search.mjs "query" --topic news --days 1 -n 8`.

- Joby: `Joby Aviation latest news`, `Joby Aviation certification`, `Joby eVTOL launch`
- Rocket Lab: `Rocket Lab Neutron updates`, `Rocket Lab launch`, `Rocket Lab HASTE`
- OpenClaw: `OpenClaw release`, `OpenClaw security`, `OpenClaw skills`
- AI agents: `AI agents frameworks`, `LangGraph`, `Claude Agent`, `agent tool calling`

**web_search (built-in)** — use for broader discovery; keep `count` modest (3–6). Phrase queries to anchor time when useful (e.g. "past 24 hours", "today", current month). No provider-specific options; rely on query wording and recency checks below.

**Recency (required):** For promising results from either source, use `web_fetch` on the URL and read the publish date. Exclude items older than 24 hours or already on your exclusion list.

**Reddit (reddit-readonly skill)**

**Subreddits** (sort by Top past 24h + Hot, limit 5-10 each):
- r/JobyAviation
- r/RocketLab or r/RKLB
- r/OpenClaw (fall back to adjacent subs if needed)
- r/ArtificialIntelligence
- r/AI_Agents or r/AgentsOfAI

**Keyword searches** (past 24h):
- "AI agents"
- "LangGraph"
- "Claude Agent SDK"
- "Open Claw"

**Selection criteria:** news, launches, partnerships, technical updates, credible analysis. Prefer meaningful engagement. Skip memes, duplicates, low-effort, hype/spam.

### 3. Compile the brief

Use the Output Structure and Tone below.

**Deduplication (critical):** Before writing each bullet, check it against your exclusion list from Step 1. If a story was already covered in the archive — even with slightly different wording — drop it. If your searches only turned up previously covered stories for a section, write "No significant new developments in the past 24 hours" for that section rather than rehashing old news. A short brief with genuinely new items is far better than a long brief full of repeats.

**Output structure:** Start with the sections (no executive summary at the top): Joby Aviation, Rocket Lab, OpenClaw, AI Agents / Ecosystem, Themes & What to Watch. Tone: concise, high-signal, executive-ready (5-minute read). Include links and short synthesis, not a post dump.

**Links (required):** For each section except Themes & What to Watch, you MUST include a links block directly below that section's content. Capture URLs from the sources you used: tavily-search output and web_search `citations`; Reddit `permalink`. Format: `<ul class="section-links"><li><a href="URL">short label or URL</a></li>` — one `<li>` per source. Example: `<ul class="section-links"><li><a href="https://reddit.com/r/JobyAviation/...">r/JobyAviation post</a></li><li><a href="https://...">SimplyWall.st</a></li></ul>`. Do not omit links or group them at the bottom.

### 4. Write the Telegram version

Write the brief as a Telegram-friendly message using simple markdown-style formatting that OpenClaw can render cleanly for Telegram.

Formatting rules:

- Start with `*Daily Brief - YYYY-MM-DD*`
- Use section headers in bold: `*Joby Aviation*`, `*Rocket Lab*`, `*OpenClaw*`, `*AI Agents / Ecosystem*`, `*Themes & What to Watch*`
- Use short bullets with `- `
- Keep links inline on their own bullets using markdown links like `[label](URL)`
- Keep it compact and easy to scan on mobile
- Target about 2500-3500 characters total
- Do not use tables
- Do not use raw HTML tags
- Do not use code blocks unless absolutely necessary

### 5. Append to the archive

Append the sent brief to the end of `daily_brief_archive.md` with this structure:

```text
## YYYY-MM-DD

<final Telegram message text>
```

Keep this archive update simple. Do not try to rewrite older sections.

### 6. Send the Telegram message

Send the final brief to Telegram with:

```bash
openclaw message send --channel telegram --target -5277817028 --message "<final brief text>"
```

Rules:

- Do not create or attach any file
- Do not use native cron announce delivery for this job
- Retry the Telegram send once if it fails
- Final response should be a short confirmation that the archive was updated and the Telegram message send succeeded
