---
name: xai-search
description: Use xAI Grok with the web_search tool to answer queries with live web citations.
metadata: {"openclaw":{"emoji":"🔎","requires":{"bins":["node"],"env":["XAI_API_KEY"]},"primaryEnv":"XAI_API_KEY"}}
---

# xAI Search

## What this skill does

- Uses the xAI Responses API with the `web_search` tool enabled.
- Returns a JSON result containing the answer text plus any citations/sources.

## Command

```bash
node {baseDir}/scripts/xai-search.mjs "<query>" --model grok-4-1-fast-reasoning --maxSources 8
```

## Output

- Success: `{ "ok": true, "data": { "model": "...", "text": "...", "citations": [...] } }`
- Failure: `{ "ok": false, "error": { "message": "...", "details": ... } }`

## Usage guidance

- Prefer short, specific queries.
- If you need strict domains, pass `--allow domain1,domain2`.
- To avoid domains, pass `--exclude domain1,domain2`.
