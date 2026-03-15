# Adam's Notion Workspace

## Workspace Structure

### Personal
Parent: Page
Page ID: `54b5aaf3-ce0b-46ef-bd5c-9dcea96138bb`

#### OpenClaw To-dos
Type: Page with to-do blocks
Page ID: `2ffe5313-0ab7-81c5-8111-cde2ef495713`
Path: Personal > OpenClaw To-dos
URL: https://www.notion.so/OpenClaw-To-dos-2ffe53130ab781c58111cde2ef495713

**Current tasks:**
- Setting up the Openclaw Twitter client
- Adding a Brave Search API key
- Creating a Kids Soccer Schedule skill ✅
- Adding a Daily Stock News Sweep
- Adding a Reddit skill ✅
- Set up ClawdHub
- Add Ollama model to OpenClaw
- Evaluate more cheap models

## Quick Reference

When Adam refers to pages by name in conversation, map them to IDs:

| Name | Type | Page ID | Notes |
|------|------|---------|-------|
| Personal | Page | `54b5aaf3-ce0b-46ef-bd5c-9dcea96138bb` | Top-level page |
| OpenClaw To-dos | To-do list page | `2ffe5313-0ab7-81c5-8111-cde2ef495713` | Under Personal |
| Sleep Tracker | ~~Database~~ Migrated to local SQLite | `~/.openclaw/memory/sleep.sqlite` | Was under Personal; migrated 2026-02-19 |

## Adding New Pages

When Adam mentions a new Notion page:

1. Search for it using the Notion API
2. Get its page ID and structure
3. Add it to this file under the appropriate section
4. Update the Quick Reference table

## Common Operations

### Add a to-do item to OpenClaw To-dos

```bash
NOTION_KEY="$NOTION_API_KEY"
curl -X PATCH "https://api.notion.com/v1/blocks/2ffe5313-0ab7-81c5-8111-cde2ef495713/children" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2025-09-03" \
  -H "Content-Type: application/json" \
  -d '{
    "children": [
      {
        "object": "block",
        "type": "to_do",
        "to_do": {
          "rich_text": [{"text": {"content": "Your task here"}}],
          "checked": false
        }
      }
    ]
  }'
```

### Check a to-do item

```bash
NOTION_KEY="$NOTION_API_KEY"
curl -X PATCH "https://api.notion.com/v1/blocks/{block_id}" \
  -H "Authorization: Bearer $NOTION_KEY" \
  -H "Notion-Version: 2025-09-03" \
  -H "Content-Type: application/json" \
  -d '{"to_do": {"checked": true}}'
```
