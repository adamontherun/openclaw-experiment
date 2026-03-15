---
name: idea-bank
description: Store and manage brainstormed social content ideas in a SQLite database.
metadata:
  openclaw:
    requires:
      bins:
        - node
        - sqlite3
---

# Idea Bank

Use this skill to store brainstorm ideas and retrieve the next unused idea for social content creation.
Store ideas only in `memory/ideas.db` through `scripts/ideas.mjs`.
Do not create or update `idea-bank.md` or other ad-hoc idea files.

## Commands

Run from this skill directory:

```bash
node {baseDir}/scripts/ideas.mjs add --name "Roster-spot mythbusting post"
node {baseDir}/scripts/ideas.mjs next
node {baseDir}/scripts/ideas.mjs mark-used --name "Roster-spot mythbusting post"
node {baseDir}/scripts/ideas.mjs list
node {baseDir}/scripts/ideas.mjs list --unused true
```

## Operator cheat sheet

```bash
node {baseDir}/scripts/ideas.mjs add --name "<idea text>" --db memory/ideas.db
node {baseDir}/scripts/ideas.mjs next --db memory/ideas.db
node {baseDir}/scripts/ideas.mjs list --unused true --db memory/ideas.db
node {baseDir}/scripts/ideas.mjs mark-used --name "<exact idea text>" --db memory/ideas.db
```

## Likely Telegram trigger phrases

Use this skill when Adam sends messages like:

- add this idea: "<idea>"
- save this brainstorm: "<idea>"
- put this in idea bank: "<idea>"
- drop an idea in the idea bank: "<idea>"
- drop an idea in the idea bank to have a post about "<idea>"
- log this content idea: "<idea>"
- what ideas do we have?
- list unused ideas
- show me the next idea
- pick the next brainstorm idea
- mark this idea used: "<idea>"
- we used this idea: "<idea>"

Map to commands:

- add/save/put/log idea -> `add`
- list/show ideas -> `list --unused true` unless Adam asks for all ideas
- next/pick idea -> `next`
- mark/we used -> `mark-used`
- after `add`, confirm with the exact stored idea text from DB output

## Database

- Default DB path: `memory/ideas.db`
- Table columns:
  - `idea_name`
  - `has_been_used`

Use `--db <path>` to override the database path when needed.

## Modes

- `add`: create or reset an idea with `has_been_used = false`
- `next`: return the oldest unused idea
- `mark-used`: set `has_been_used = true` for an idea
- `list`: return ideas, optional `--unused true` filter

## Output

Each command returns JSON with:

- `ok`
- `mode`
- `dbPath`
- idea payloads (`idea` or `ideas`)
