---
name: notion-workspace
description: Manage Adam's Notion workspace pages and databases. Use when Adam asks to add, update, check, or interact with his Notion pages (like "add to my OpenClaw todos" or "update my Personal page"). This skill provides quick access to page IDs and common operations.
---

# notion-workspace

Provides quick access to Adam's Notion workspace structure and common operations.

## Overview

This skill maintains a map of Adam's Notion pages and their IDs, making it easy to:
- Add items to to-do lists
- Update pages by name
- Reference pages without searching
- Extend with new pages as needed

## Usage

1. **Read the workspace structure** first:
   ```bash
   read references/workspace.md
   ```

2. **Look up page IDs** in the Quick Reference table

3. **Use the Notion API** with the page IDs (API key from `NOTION_API_KEY` in env, e.g. `~/.openclaw/.env`)

## Common Patterns

### Adding to a to-do list

When Adam says "add X to my OpenClaw todos", read `references/workspace.md` to get the page ID, then use the "Add a to-do item" operation.

### Referencing pages by name

Instead of searching every time, use the Quick Reference table in `workspace.md` to map names to IDs.

### Adding new pages

When Adam mentions a new page:
1. Search for it using the Notion API
2. Get its structure and ID
3. Update `references/workspace.md` with the new page info

## Notes

- Notion auth should use `NOTION_API_KEY` (env)
- Always use `Notion-Version: 2025-09-03` header
- See the main `notion` skill for full API reference
