---
name: life-ops
description: Life Ops indexer that ingests Gmail (inbox + sent), Google Calendar, and iMessages, extracts structured facts, and provides semantic search across personal communications. Use for ingestion runs and when answering questions about schedules, commitments, tasks, deliveries, or anything from Adam's messages and calendar.
metadata: {"openclaw":{"emoji":"🧠","requires":{"bins":["python3","gog","imsg"]}}}
---

# Life Ops Indexer

Personal life operations index. Ingests Gmail (inbox + sent), Google Calendar, and iMessages. Extracts structured facts (events, tasks, commitments, deadlines, deliveries, decisions, etc.) and stores them in SQLite with vector embeddings for semantic search.

## Ingestion

Run the full ingestion pipeline (fetch new items, filter noise, extract facts via LLM, embed, store):

```bash
python3 {baseDir}/scripts/life_ops.py ingest
```

Options:
- `--hours-back 9` — Gmail lookback window (default 9 hours)
- `--days-forward 30` — Calendar lookahead window (default 30 days)

The command:
1. Fetches new Gmail messages (inbox + sent), Calendar events, and iMessages since last checkpoint
2. Filters noise (promotions, newsletters, spam) using configurable rules
3. Sends kept items to OpenAI for structured fact extraction
4. Embeds fact cards and raw text chunks for semantic search
5. Updates checkpoints
6. Prints JSON stats: items processed, kept, filtered, facts extracted

## Query — Semantic Search

Search across all fact cards and raw message text:

```bash
python3 {baseDir}/scripts/life_ops.py search --query "<question>" --limit 10
```

Options:
- `--since YYYY-MM-DD` — filter to facts created after date
- `--until YYYY-MM-DD` — filter to facts created before date
- `--tag <tag>` — filter by tag (e.g. school, family, deadline)

When answering user questions:
1. Run a search with the user's question
2. Synthesize an answer from the top results
3. Cite the source type (gmail/calendar/imessage) and date
4. Prefer the most recent, highest-confidence facts
5. All timestamps in search results are in **HST** (Hawaii Standard Time, UTC-10). Do not re-convert them.
6. The sender phone number or email in a raw_text chunk is **not** necessarily the person performing an action — read the message content carefully to determine who is doing what (e.g., "+18083723005 says 'my mom will pick them up'" means the mom is picking up, not the sender).

## Query — Structured Facts

List/filter extracted facts directly:

```bash
python3 {baseDir}/scripts/life_ops.py facts --limit 20
```

Options:
- `--tag <tag>` — filter by tag
- `--status current` — only current facts (default), or `superseded`
- `--action-owner adam` — filter by who owns the action
- `--fact-type <type>` — filter by primary fact type
- `--since YYYY-MM-DD` / `--until YYYY-MM-DD` — date range

Useful query patterns:
- Upcoming deadlines: `facts --tag deadline --status current`
- Adam's open tasks: `facts --action-owner adam --tag task`
- School-related: `facts --tag school`
- Follow-ups needed: `facts --tag follow_up_needed`
- Family logistics: `facts --tag family --since <date>`

## Delta Summary

Show what changed since the last ingestion run (or since a date):

```bash
python3 {baseDir}/scripts/life_ops.py summary
python3 {baseDir}/scripts/life_ops.py summary --since 2026-02-19
```

Returns: items processed, facts extracted, superseded facts, upcoming deadlines/events.

## Status

Check system health, checkpoint times, and counts:

```bash
python3 {baseDir}/scripts/life_ops.py status
```

## Noise Rules

Manage noise filtering rules:

```bash
python3 {baseDir}/scripts/life_ops.py noise-rules list
python3 {baseDir}/scripts/life_ops.py noise-rules add --type sender --pattern "no-reply@" --rule-action discard
python3 {baseDir}/scripts/life_ops.py noise-rules remove --id 5
python3 {baseDir}/scripts/life_ops.py noise-rules toggle --id 3
```

Rule types: `sender`, `label`, `keyword`
Actions: `discard` (skip entirely), `deprioritize` (still process but lower priority)

## Initialize

First-time setup (creates DB and seeds default noise rules):

```bash
python3 {baseDir}/scripts/life_ops.py init
```

## Tag Taxonomy

Facts are tagged with one or more of:
`event`, `deadline`, `task`, `requirement`, `schedule_change`, `reservation`, `delivery`, `purchase`, `finance`, `school`, `sports`, `family`, `home`, `travel`, `work`, `admin`, `info_reference`, `decision`, `waiting_on`, `follow_up_needed`

## Database

SQLite at `~/.openclaw/memory/life-ops.sqlite`. Separate from the knowledge base.

## Important Notes

- Gmail and Calendar require `gog` auth: `gog auth add adaminhonolulu@gmail.com --services gmail,calendar`
- iMessages work via macOS Messages.app (no auth needed)
- Ingestion is idempotent — safe to run multiple times
- Each run processes only new items since the last checkpoint
- The system does NOT generate relationship health scores, social ratings, or unsolicited "check in with X" nudges
