---
name: buffer-api
description: Publish and inspect Buffer posts for X, Instagram, and Threads via GraphQL API.
metadata:
  openclaw:
    requires:
      bins:
        - node
---

# Buffer API

Use this skill for Buffer publishing workflows for X, Instagram, and Threads.

## Execution rules

- Authenticate API requests with `BUFFER_API_KEY` and run publishing through `node {baseDir}/scripts/buffer.mjs ...`.

## Commands

Run from this skill directory:

```bash
node {baseDir}/scripts/buffer.mjs channels
node {baseDir}/scripts/buffer.mjs scheduled
node {baseDir}/scripts/buffer.mjs post --channel "<channel_id>" --text "<copy>"
node {baseDir}/scripts/buffer.mjs publish --run-db "memory/content.db" --run-id "<run_id>"
```

Known channel IDs for this workspace:

- Instagram: `69b4999f7be9f8b17153ba90`
- Threads: `69b499b77be9f8b17153bb12`
- X: `69b499da7be9f8b17153bbd1`

## Modes

- `channels`: discover organization and connected channels
- `scheduled`: list scheduled posts
- `post`: create a text or image post for a single channel
- `publish`: read a content run from SQLite and post to X, Instagram, and Threads in one command

## Post mode options

- `--channel`: required Buffer channel ID
- `--text`: required post copy
- `--text-file`: optional text file path for post copy
- `--image-url`: optional public image URL for image posts
- `--image-file`: optional local image file path; uploads to Google Drive via `gog` and uses the generated public URL
- `--mode`: optional sharing mode (`shareNow`, `addToQueue`, or `customSchedule`)
- `--due-at`: optional ISO datetime, required when `--mode customSchedule`
- `--scheduling-type`: optional (`automatic` or `notification`)
- `--gog-account`: optional account email for `gog` Drive commands

## Publish mode options

- `--run-db`: optional SQLite path for content runs (default `memory/content.db`)
- `--run-id`: required run ID in the `runs` table
- `--mode`: optional sharing mode (default `shareNow`)
- `--gog-account`: optional account email for `gog` Drive commands

The publish command reads `copy_x`, `copy_instagram`, `copy_threads`, and `image_file` from the selected run and posts each one to the correct Buffer channel.

The same image is attached to X, Instagram, and Threads.
Instagram requires an image and post type metadata. This script sets Instagram post metadata automatically.

## Requirements

- `BUFFER_API_KEY`
- `gog` auth for Google Drive uploads when using `--image-file` or `--instagram-image-file`

If env vars are not set in process env, the script falls back to `~/.openclaw/.env`.

## Output

The command returns JSON to stdout with:

- `mode`
- `organization`
- mode-specific payload (`channels`, `posts`, or `createdPost`)
- `error` when `ok` is false
