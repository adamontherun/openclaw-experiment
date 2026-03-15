---
name: reddit-browser
description: Browser automation for Reddit search, read, comment, reaction, and posting workflows.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Reddit Browser

Use this skill for authenticated Reddit actions via browser automation.

## Capabilities

- Search by keyword across Reddit
- Search within specific subreddits
- Read posts and comment context
- Create comments on target posts
- React to posts or comments (upvote, downvote, save, unsave)
- Crosspost existing posts to target subreddits
- Create new posts in target subreddits

## Browser execution rules

- Always take a fresh browser snapshot before each action.
- After any click, type, navigation, or submit, take a new snapshot.
- Never reuse element refs after the DOM changes.
- If a ref is missing or ambiguous, resnapshot and retry.
- Retry each platform action at most 2 times.
- If verification fails after retries, return failure with a short reason.

## Snapshot verification

- `browser snapshot` returns accessibility tree text (DOM labels and refs), not a visual image.
- Never call the `image` tool with a web URL. `image` only accepts local file paths or base64 PNG data. `image({"image": "https://..."})` always fails.
- To verify a button state change, call `browser snapshot` and confirm the expected text appears.
- If snapshot text is empty or `(no output)`, wait 1-2 seconds and take another snapshot, with a max of 2 retries.

## DOM landmarks

Reddit uses custom Web Components (`<shreddit-*>` and `<faceplate-*>` tags).

**Post container**: `<shreddit-post>` with attributes `permalink`, `post-title`, `score`, `comment-count`, `author`, `subreddit-name`, `created-timestamp`.

**Comment tree**: `<shreddit-comment-tree>` wrapping individual `<shreddit-comment>` elements.

**Icon buttons**: use `icon-name` attribute on `<faceplate-*>` children.

| Element               | Tag / Attribute                           | Notes                                        |
|-----------------------|-------------------------------------------|----------------------------------------------|
| Post                  | `<shreddit-post>`                         | Has `score`, `comment-count`, `permalink`    |
| Comment tree          | `<shreddit-comment-tree>`                 | Wraps all `<shreddit-comment>` nodes         |
| Comment button        | `icon-name="chat"`                        | Opens or scrolls to comment section          |
| Share button          | `icon-name="share"`                       | Opens share menu                             |
| Search (subreddit)    | `input[placeholder="Search in r/..."]`    | Scoped search within a subreddit             |
| Create post           | `aria-label="Create post"`                | New-post button on subreddit pages           |
| Join/Leave            | `<shreddit-join-button>`                  | Community join toggle                        |
| Overflow menu         | `<shreddit-post-overflow-menu>`           | Three-dot menu per post                      |

Upvote/downvote buttons are rendered dynamically. Look for arrow-shaped buttons adjacent to the `<faceplate-number>` score display inside each `<shreddit-post>` or `<shreddit-comment>`.

## Search workflow

1. Open Reddit and ensure the session is authenticated.
2. Run keyword search using the provided query.
3. If a subreddit scope is provided, run the same query inside that subreddit.
4. Capture top matching posts with:
   - permalink
   - title
   - author handle
   - post age
   - score or visible engagement

## Read workflow

1. Open the provided Reddit post URL.
2. Capture post body/title context and author handle.
3. Capture a concise summary of top relevant comments.

## Comment workflow

1. Open the target post URL.
2. Find and activate the comment input.
3. Enter the provided reply text.
4. Submit the comment.
5. Verify the posted text appears on page.
6. Return posted status URL or clear failure state.

## Reaction workflow

1. Open target Reddit post or comment URL.
2. Apply requested reaction action:
   - upvote
   - downvote
   - remove vote
   - save
   - unsave
3. Verify UI state changed to match requested action.
4. Return action status with the target URL.

## Crosspost workflow

1. Open source post URL.
2. Open crosspost flow.
3. Select target subreddit and adjust title if provided.
4. Submit crosspost.
5. Verify the new crosspost appears and capture permalink.

## Post workflow

1. Open the target subreddit create-post flow.
2. Fill title and body fields.
3. Submit the post.
4. Verify the new post appears and capture permalink.

## Output contract

Return structured summaries suitable for calling workflow skills:

- `ok`: true or false
- `action`: search, read, comment, react, crosspost, or post
- `items`: result entries for search/read
- `posted`: posted item details for comment/post
- `reacted`: reaction action details for react
- `crossposted`: crosspost details for crosspost
- `error`: present only when `ok` is false
