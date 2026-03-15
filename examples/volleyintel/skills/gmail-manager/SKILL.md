---
name: gmail-manager
description: Manage adam@volleyintel.com inbox every 6 hours with gog CLI, clean spam/promotions, draft customer replies, and require Telegram approval before sending.
metadata:
  openclaw:
    requires:
      bins:
        - gog
        - node
        - sqlite3
---

# Gmail Manager

Use gog with account `adam@volleyintel.com`.
All drafts are stored in `memory/gmail.db` via `skills/gmail-manager/scripts/gmail-drafts.mjs`.

## Triage mode

1. Get thread IDs that already have a draft (pending or sent) so we skip them:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs drafted-threads --db memory/gmail.db
```

2. Search last 6 hours:

```bash
gog --json --account adam@volleyintel.com gmail search 'newer_than:6h' --max 50
```

3. Read candidate threads (skip any thread ID returned by `drafted-threads`):

```bash
gog --json --account adam@volleyintel.com gmail thread get <threadId>
```

4. Classify messages:
- Promotions and obvious spam: archive.
- Newsletters and non-customer updates: archive.
- Customer inquiries: draft reply.

5. Archive non-customer messages:

```bash
gog --account adam@volleyintel.com gmail thread modify <threadId> --remove INBOX
```

6. For customer inquiries, read `BRAND.md` and files in `knowledge-base/`, then save a draft:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs create \
  --thread-id "<threadId>" \
  --reply-to-message-id "<messageId>" \
  --from "<sender email>" \
  --subject "<subject>" \
  --draft-reply "<reply text>" \
  --db memory/gmail.db
```

7. After all drafts are created, send a numbered summary of pending drafts to `telegram:-5271219210` for approval:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs list --status pending --db memory/gmail.db
```

## Approval mode

Supported commands from Adam:
- `approve <n>` or `approve all`
- `edit <n>: <new text>`
- `skip <n>`

When editing:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs update \
  --id <draft_id> \
  --draft-reply "<new text>" \
  --db memory/gmail.db
```

When approved, send via gog:

```bash
gog --account adam@volleyintel.com gmail send \
  --reply-to-message-id <messageId> \
  --quote --to <email> --subject "<subject>" --body "<approved-text>"
```

Then mark the draft as sent:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs mark-sent \
  --id <draft_id> \
  --db memory/gmail.db
```

After sending, archive the thread:

```bash
gog --account adam@volleyintel.com gmail thread modify <threadId> --remove INBOX
```

When skipped:

```bash
node skills/gmail-manager/scripts/gmail-drafts.mjs mark-skipped \
  --id <draft_id> \
  --db memory/gmail.db
```
