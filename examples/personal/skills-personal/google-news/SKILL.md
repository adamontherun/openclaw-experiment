---
name: google-news
description: Access Google News via the OpenClaw-managed browser for top stories or topic search. Use when Adam wants to check his news feed, get headlines, or search for news on particular subjects.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Google News Skill

Access Google News through the **OpenClaw-managed browser** (`profile="openclaw"`). No Chrome extension required; works when Adam is away. Top stories and search work without login; for a personalized home feed, Adam can sign into Google once in the openclaw browser.

## Features

### 1. Top Stories

Get the top news stories from Google News home (default view, or personalized if logged in).

**URL:** https://news.google.com

**What to extract:** Headlines, source names, time posted, brief snippets, story links.

### 2. News Search

Search for specific topics or keywords.

**URL:** https://news.google.com/search?q={encoded_query}

**What to extract:** Article headlines, sources, timestamps, snippets, result URLs.

## How to Use

**Browser:** Always use the browser tool with `profile="openclaw"`. Do not use `profile="chrome"` (extension relay).

### Get Top Stories

When Adam asks: "What's in the news?", "Show me my news feed", "What are the top stories today?", "Check Google News"

**Steps:**
1. Use the browser tool with `profile="openclaw"` and navigate to https://news.google.com
2. Wait for the page to load
3. From the page content, extract article cards: headline (often h3/h4 or headline classes), source name, relative time (e.g. "2 hours ago"), snippet
4. Return the top 5–10 stories in the format below

### Search News

When Adam asks: "Search news for [topic]", "What's the latest on [subject]?", "Find news about [keyword]"

**Steps:**
1. Encode the query and build URL: https://news.google.com/search?q={encoded_query}
2. Use the browser tool with `profile="openclaw"` and navigate to that URL
3. Wait for results to load
4. Extract headlines, sources, times, snippets, and links for the top 5–10 results
5. Return in the format below

Optional: use the script for URLs and extraction hints — `python3 {baseDir}/scripts/google_news.py guide` (top stories) or `python3 {baseDir}/scripts/google_news.py guide "search query"` (search).

## Output Format

Top stories:
```
📰 Top Stories from Google News:

1. Headline Title
   📰 Source Name • 2 hours ago
   Brief snippet...

2. Headline Title
   📰 Source Name • 4 hours ago
   Brief snippet...
```

Search results:
```
🔍 News Search: "query"

📰 Article Headline
📰 Source • 3 hours ago
Snippet text...
🔗 link
```

## Implementation Notes

- Uses **OpenClaw-managed browser** (`profile="openclaw"`), not the Chrome extension
- Works when Adam is away; no tab attachment needed
- **Personalized feed:** If Adam wants his personalized home feed, he can sign in once: `openclaw browser start` then `openclaw browser open https://news.google.com` and log in; session persists in the profile
- Extract text only; links go to Google News / original sources
- Respect rate limiting; avoid rapid repeated loads
