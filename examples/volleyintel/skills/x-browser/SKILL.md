---
name: x-browser
description: Browser automation for X search, read, reply, and follow workflows.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# X Browser

Use this skill for authenticated X actions via browser automation.

## Capabilities

- Search X by keywords and advanced search operators
- Read tweet and thread context
- Reply to tweets
- Follow target accounts

Use `skills/buffer-api` for publishing new X posts.

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

X is a React SPA that uses `data-testid` attributes on interactive elements.

| Action          | Selector / data-testid                  | Notes                                          |
|----------------|------------------------------------------|-------------------------------------------------|
| Tweet cell     | `data-testid="cellInnerDiv"`             | Each timeline item wrapper                      |
| Tweet text     | `data-testid="tweetText"`               | The text content of a tweet                     |
| Like           | `data-testid="like"` / `"unlike"`       | Heart icon; toggles between like/unlike          |
| Reply          | `data-testid="reply"`                   | Speech-bubble icon on tweet action bar           |
| Retweet        | `data-testid="retweet"` / `"unretweet"` | Arrows icon; opens retweet/quote menu            |
| Bookmark       | `data-testid="bookmark"` / `"removeBookmark"` | Bookmark flag icon                        |
| Submit reply   | `data-testid="tweetButtonInline"`       | Send button inside the inline reply composer     |
| Search input   | `data-testid="SearchBox_Search_Input"`  | Text input in the search bar                     |

Search URL pattern: `https://x.com/search?q=QUERY&src=typed_query`
For fresh discovery, use the Live/Latest results URL: `https://x.com/search?q=QUERY&src=typed_query&f=live`

Reply composer: click `data-testid="reply"` on a tweet, type into the text area that appears, then click `data-testid="tweetButtonInline"` to submit.

## Search workflow

1. Open X and verify authenticated session.
2. When the task is about finding new accounts or fresh posts, start from the Live/Latest results URL.
3. Run provided keyword queries using X search.
4. Use advanced operators when provided, including `from:`, `since:`, and `until:`.
5. Prefer recent posts and recently active accounts when the task is about fresh discovery.
6. Capture relevant results with:
   - url
   - account handle
   - tweet text snippet
   - post age
   - visible engagement

## Read workflow

1. Open target tweet URL.
2. Capture tweet text, account handle, and reply context.
3. If a thread is present, capture the key parent or follow-up tweet context.

## Reply workflow

1. Open target tweet URL.
2. Find and click the reply composer.
3. Enter provided reply text.
4. Click `Reply` or equivalent submit action.
5. Verify the posted text appears in replies.
6. Return posted status URL or clear failure state.

## Follow workflow

1. Open target account profile.
2. Click follow if not already followed.
3. Verify button state confirms follow success.
4. Respect any cap passed by calling workflow skill.

## Output contract

- `ok`: true or false
- `action`: search, read, reply, or follow
- `items`: result entries for search or read
- `posted`: created reply details
- `followed`: followed account entries
- `error`: present only when `ok` is false
