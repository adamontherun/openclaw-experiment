---
name: x-engage
description: Find top X recruiting accounts, follow them, engage with one post, and reply with a high-energy message.
metadata:
  openclaw:
    requires:
      browser: openclaw
      bins:
        - node
---

# X Engage

Run focused outbound engagement on X.

## Required platform skill

- X via `skills/x-browser`

## Search target

- Query: `volleyball recruiting`
- Search URL: `https://x.com/search?q=volleyball%20recruiting&src=typed_query&f=live`

## Execution

- Run the entire workflow in this session. Do not use `sessions_spawn` or subagents. Use browser and exec tools directly.

## Database contract

`memory/engagement.db` stores successful engagement actions for this workflow.
Use it to load the skip list before starting, then log each confirmed successful action after it happens.

Fields in `engagements`: `run_date`, `platform`, `username`, `post_url`, `action`, `message_sent`, `created_at`.

Logging rules:
- Log only after visual verification succeeds.
- Write exactly one row per confirmed successful action.
- Use `--action followed|liked|replied` only.
- For `followed`, use the profile URL in `--post-url`.
- For `liked` and `replied`, use the specific post URL in `--post-url`.
- Use `--message` only for `replied`, with the exact posted reply text.

## Workflow

### Step 1 — Load exclusion list

```bash
node scripts/engagement.mjs engaged-users --platform x --db memory/engagement.db
```

Save the returned `users` array. This is your skip list for the entire run.

### Step 2 — Search and select 3 accounts

Search X for `volleyball recruiting` using `skills/x-browser`. Start on the Live/Latest results page at `https://x.com/search?q=volleyball%20recruiting&src=typed_query&f=live`. Prefer recent posts and recently active accounts so discovery favors new people. Collect account usernames from results. Skip any username already in the exclusion list from Step 1. Pick the first 3 valid accounts.

### Step 3 — Engage each account (one at a time, fully, before moving to the next)

**CRITICAL: Complete all three actions for one account before moving to the next account. Do not batch, do not loop back. Finish account 1 entirely, then account 2, then account 3.**

For each account, execute steps 3a -> 3b -> 3c in order, then stop and move to the next account.

#### 3a — Follow

1. Navigate to the account profile page.
2. Click Follow.
3. Take a snapshot. Confirm the button now reads "Following" or similar.
4. If confirmed, log it:

```bash
node scripts/engagement.mjs create --platform x --username "<username>" --post-url "<profile_url>" --action followed --db memory/engagement.db
```

5. If not confirmed after 2 retries, skip logging and move to 3b.

#### 3b — Like one post

1. Navigate to one of their posts.
2. Click the Like button.
3. Take a snapshot. Confirm the heart icon is in the liked state or the control reads "Unlike".
4. If confirmed, log it:

```bash
node scripts/engagement.mjs create --platform x --username "<username>" --post-url "<post_url>" --action liked --db memory/engagement.db
```

5. If not confirmed after 2 retries, skip logging and move to 3c.

#### 3c — Reply on that post

1. On the same post from 3b, click the reply field.
2. Type a short, high-energy, on-topic reply.
3. Submit it.
4. Take a snapshot. Confirm your reply text appears in the thread.
5. If confirmed, log it:

```bash
node scripts/engagement.mjs create --platform x --username "<username>" --post-url "<post_url>" --action replied --message "<exact_reply_text>" --db memory/engagement.db
```

6. If not confirmed after 2 retries, skip logging.

**After 3c is complete (or skipped), move immediately to the next account. Do not revisit this account.**

### Step 4 — Finish

Do not send any Telegram summary from this skill. The daily `volleyintel-brief` reads `memory/engagement.db` rows for the current `run_date` and reports only successful actions logged there.
