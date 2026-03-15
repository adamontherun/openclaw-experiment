---
name: nightly-database-backup
description: Back up OpenClaw database files for the main agent and the VolleyIntel workspace to Google Drive using gog. Use when the nightly database backup cron job runs.
---

# Nightly Database Backup

Back up the OpenClaw database files for both database sets:

- Main agent: `~/.openclaw/memory`
- VolleyIntel: `~/.openclaw/workspace-volleyintel/memory`

Use Google Drive account `adaminhonolulu@gmail.com`.

## Workflow

1. Run `zsh /Users/adamsmith/.openclaw/workspace/skills/nightly-database-backup/scripts/backup.sh`.
2. If the script reports success, finish with a short summary of how many files were uploaded and which Drive folder was used.
3. If the script fails, report the failure clearly and stop.
