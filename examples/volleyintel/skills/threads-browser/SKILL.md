---
name: threads-browser
description: Browser automation for Threads search, read, reply, reaction, repost, and follow workflows.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Threads Browser

Use this skill for authenticated Threads actions via browser automation.

## Capabilities

- Search Threads by keywords
- Read post and thread context
- Reply to posts
- React to posts (like, unlike)
- Repost and quote posts
- Follow target accounts

Use `skills/buffer-api` for publishing new Threads posts.

## Browser execution rules

- Always take a fresh browser snapshot before each action.
- After any click, type, navigation, or submit, take a new snapshot.
- Never reuse element refs after a DOM change.
- If refs are missing or ambiguous, resnapshot and retry.
- Retry each platform action at most 2 times.
- If verification fails after retries, return failure with a short reason.

## Snapshot verification

- `browser snapshot` returns accessibility tree text (DOM labels and refs), not a visual image.
- Never call the `image` tool with a web URL. `image` only accepts local file paths or base64 PNG data. `image({"image": "https://..."})` always fails.
- To verify a button state change, call `browser snapshot` and confirm the expected text appears.
- If snapshot text is empty or `(no output)`, wait 1-2 seconds and take another snapshot, with a max of 2 retries.

## DOM landmarks

Threads renders all interactive controls as `<svg>` elements with `aria-label` and `role="img"`.
Use these aria-labels to locate actions without trial-and-error clicking:

| Action       | Selector                          | Notes                                          |
|-------------|-----------------------------------|-------------------------------------------------|
| Like        | `svg[aria-label="Like"]`          | Heart icon, `--x-fill: transparent` when unset  |
| Comment     | `svg[aria-label="Comment"]`       | Speech-bubble icon                              |
| Repost      | `svg[aria-label="Repost"]`        | Arrows icon, opens repost/quote menu            |
| Share       | `svg[aria-label="Share"]`         | Paper-plane icon                                |
| More        | `svg[aria-label="More"]`          | Three-dot overflow menu                         |
| Search nav  | `svg[aria-label="Search"]`        | Magnifying glass in bottom nav                  |

Search URL pattern: `https://www.threads.com/search?q=QUERY&filter=recent`

Reply input: after clicking `svg[aria-label="Comment"]` a text area appears; type into it then look for a `Post` or `Reply` button.

## Search workflow

1. Open Threads and verify authenticated session.
2. For fresh discovery, start from the Recent results page.
3. Run provided keyword queries.
4. Prefer recent posts and recently active accounts when selecting targets.
5. Capture relevant results with:
   - url
   - account handle
   - short context
   - visible engagement

## Read workflow

1. Open target post URL (`threads.net/@.../post/...`).
2. Capture post text and account handle.
3. Capture top relevant reply context.

## Reply workflow

1. Open target post URL.
2. Find and click reply input.
3. Enter provided reply text.
4. Click `Post` or `Reply`.
5. Verify the posted text appears in thread replies.
6. Return posted status or clear failure state.

## Reaction workflow

1. Open target post URL.
2. Apply requested reaction action:
   - like
   - unlike
3. Verify reaction state changed to match requested action.
4. Return action status with the target URL.

## Repost workflow

1. Open target post URL.
2. Open repost menu.
3. Apply requested repost action:
   - repost
   - quote
   - undo repost
4. For quote action, enter provided quote text and submit.
5. Verify repost or quote appears on profile or thread timeline.
6. Return created URL when available.

## Follow workflow

1. Open target account profile.
2. Click follow if not already followed.
3. Verify button state confirms follow success.
4. Respect any cap passed by calling workflow skill.

## Output contract

- `ok`: true or false
- `action`: search, read, reply, react, repost, or follow
- `items`: result entries for search/read
- `posted`: created reply details
- `reacted`: reaction action details for react
- `reposted`: repost or quote details for repost
- `followed`: followed account entries
- `error`: present only when `ok` is false
