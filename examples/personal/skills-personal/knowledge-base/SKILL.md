---
name: knowledge-base
description: Build and query a personal knowledge base with RAG using SQLite and OpenAI embeddings. Use when URLs are dropped in the KB Telegram group, when ingesting articles/YouTube/X/Reddit/PDFs, or when answering questions from previously ingested sources.
metadata: {"openclaw":{"emoji":"📚","requires":{"bins":["python3","summarize","node"]}}}
---

# Knowledge Base

Group ID for this workflow: `telegram:-5210101445`

Use this skill for two actions: ingestion and semantic query.

## Ingestion workflow

When a message contains one or more URLs:

**If any URL contains `podcasts.apple.com`:** Your **first** tool call must be tavily-search (step 3.5a). Do not call `summarize` first — it fails on Apple Podcasts and yields only a short excerpt. Re-read step 3.5 before choosing a tool.

1. Detect source type per URL:
- YouTube links: `youtube`
- X/Twitter links: `tweet`
- Reddit links: `reddit`
- PDF links: `pdf`
- Apple Podcasts (`podcasts.apple.com`): `podcast` — **always use the podcast flow below**
- Any URL the user labels as a podcast: `podcast`
- Everything else: `article`

2. Extract full content:
- Article: use `web_fetch` first.
- Paywalled/thin article: use browser automation with `profile="openclaw"` and extract readable page text.
- YouTube: run `summarize "<url>" --youtube auto --extract-only`.
- Reddit: run `node {baseDir}/../reddit-readonly/scripts/reddit-readonly.mjs thread "<url>"` for full thread and comments.
- **Podcast**: follow step 3.5 below. Do NOT use `summarize` on podcast URLs — it cannot extract full audio transcripts.

3. Linked-article rule:
- If a Reddit source includes an external article URL, ingest both the thread content and the linked article content.

3.5 Podcast flow (MANDATORY for any `podcasts.apple.com` URL or user-labeled podcast):

Apple Podcast pages do not contain transcripts. `summarize` will only get a small page excerpt, NOT the full episode content.

Rules (strict):
- Your FIRST tool call for Apple Podcasts must be tavily-search (step a).
- Do NOT call `summarize` for Apple Podcast URLs (even with `--extract-only`).
- Do NOT ingest partial excerpts as `article`. If you can't find a transcript/show-notes page via tavily-search, reply with failure and stop.
- When you do ingest, you MUST use `--type podcast`.
- The KB should store the **verbatim transcript text** (preferred) and/or full show notes. Do NOT replace the transcript with a short rewritten summary before ingesting.

a. Use tavily-search to find the full transcript and show notes:

```bash
node {baseDir}/../tavily-search/scripts/search.mjs "full transcript of <podcast name> episode <episode title>" -n 8 --deep
```

b. If the first query returns a summary but not a full transcript, run a second targeted query:

```bash
node {baseDir}/../tavily-search/scripts/search.mjs "<podcast name> <episode title> transcript site:podcastnotes.org OR site:snipd.com OR site:podcast-transcript.com" -n 8 --deep
```

c. Combine the best available content: transcript (preferred), show notes, episode summary.
d. Collect any notable links mentioned in the show notes for potential follow-up ingestion.
e. Ingest with `--type podcast`.

Podcast ingest format:
- Keep a small header (podcast name, episode title, source URL(s)).
- Then include `## Transcript` and paste the transcript text verbatim (or as much as the transcript page provides).
- Optionally append `## Show notes` and `## Links`.

4. Persist each source in SQLite via `kb.py ingest`:

```bash
python3 {baseDir}/scripts/kb.py ingest --url "<url>" --title "<title>" --type <article|youtube|tweet|reddit|pdf|podcast> <<'EOF'
<full extracted text>
EOF
```

5. Confirm ingestion with source title/type, chunk count, and extracted entities.

## Query workflow

When user asks a KB question:

1. Run semantic search. For temporal questions (e.g. "What did I learn about X last week?", "What was added yesterday?"), compute the date range and pass `--since` and/or `--until` (ISO date `YYYY-MM-DD` or full datetime):

```bash
python3 {baseDir}/scripts/kb.py search --query "<question>" --limit 10
```

For date-filtered queries:

```bash
python3 {baseDir}/scripts/kb.py search --query "Rocket Lab" --since 2026-02-12 --until 2026-02-18 --limit 10
```

2. Synthesize answer from top results.
3. Cite source titles + URLs used in the answer.
4. Prefer recent sources when scores are close.

## Database and embeddings

Initialize DB once:

```bash
python3 {baseDir}/scripts/kb.py init
```

The script uses OpenAI embeddings model `text-embedding-3-small`, matching OpenClaw memory search provider/model.

Useful commands:

```bash
python3 {baseDir}/scripts/kb.py stats
python3 {baseDir}/scripts/kb.py list --limit 20
python3 {baseDir}/scripts/kb.py list --since 2026-02-12 --until 2026-02-18
python3 {baseDir}/scripts/kb.py entities --limit 50
python3 {baseDir}/scripts/kb.py entities --since 2026-02-12 --until 2026-02-18
```
