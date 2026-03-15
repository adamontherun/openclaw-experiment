---
name: instagram-browser
description: Browser automation for Instagram search, read, comment, reaction, share, and follow workflows.
metadata:
  openclaw:
    requires:
      browser: openclaw
---

# Instagram Browser

Use this skill for authenticated Instagram actions via browser automation.

## Capabilities

- Search by keywords and hashtags
- Read post context and account details
- Comment on posts
- React to posts (like, unlike)
- Share posts to story or DM targets
- Follow target accounts

Use `skills/buffer-api` for publishing new Instagram posts.

## Browser execution rules

- Always take a fresh browser snapshot before each action.
- After any click, type, navigation, or submit, take a new snapshot.
- Never reuse element refs after a DOM change.
- If a modal interrupts flow, close it and resnapshot.
- Retry each platform action at most 2 times.
- If verification fails after retries, return failure with a short reason.

## DOM landmarks

Instagram renders interactive controls as `<svg>` elements with `aria-label` and `role="img"`, all using `fill="currentColor"` and 24x24 dimensions.

| Action       | Selector                          | Notes                                         |
|-------------|-----------------------------------|-------------------------------------------------|
| Like        | `svg[aria-label="Like"]`          | Heart icon below the post media                |
| Comment     | `svg[aria-label="Comment"]`       | Speech-bubble icon, next to Like               |
| Share       | `svg[aria-label="Share"]`         | Paper-plane icon, next to Comment              |
| Save        | `svg[aria-label="Save"]`          | Bookmark/flag icon, right side of action row   |
| More        | `svg[aria-label="More"]`          | Three-dot overflow on post header              |
| Explore nav | `svg[aria-label="Explore"]`       | Compass icon in side nav                       |
| Messages    | `svg[aria-label="Messages"]`      | DM icon in side nav                            |

## Snapshot verification

- `browser snapshot` returns accessibility tree text (DOM labels and refs), not a visual image.
- Never call the `image` tool with a web URL. `image` only accepts local file paths or base64 PNG data. `image({"image": "https://..."})` always fails.
- To verify a button state change like Follow to Following, call `browser snapshot` and confirm text like `Following` or `Unfollow` appears near the profile header.
- If snapshot text is empty or `(no output)`, wait 1-2 seconds and take another snapshot, with a max of 2 retries.

Comment input: look for a text field with placeholder text `Add a comment...` below the post. Click it, type, then click `Post`.

Search: use the Explore page or the search bar at the top. Hashtag search goes to `instagram.com/explore/tags/HASHTAG/`.

## Search workflow

1. Open Instagram and confirm authenticated session.
2. Run provided keyword queries.
3. Run provided hashtag queries when requested.
4. Capture matching posts/accounts with:
   - url
   - account handle
   - short context
   - visible engagement

## Read workflow

1. Open target Instagram post URL.
2. Capture caption context and account handle.
3. Capture top relevant comment context.

## Comment workflow

1. Open target post URL.
2. Find and click the `Add a comment...` input.
3. Enter provided reply text.
4. Click `Post`.
5. Verify the posted text appears in comments.
6. Return posted status or clear failure state.

## Reaction workflow

1. Open target post URL.
2. Apply requested reaction action:
   - like
   - unlike
3. Verify like state changed to match requested action.
4. Return action status with the target URL.

## Share workflow

1. Open target post URL.
2. Open share/send flow.
3. Apply requested share action:
   - share to story
   - send to target account via DM
4. Verify share flow reaches final confirmation state.
5. Return action status and target details.

## Follow workflow

1. Open target account profile.
2. Click follow if not already followed.
3. Verify button state reflects follow success.
4. Respect any cap passed by calling workflow skill.

## Output contract

- `ok`: true or false
- `action`: search, read, comment, react, share, or follow
- `items`: result entries for search/read
- `posted`: created comment details
- `reacted`: reaction action details for react
- `shared`: share action details for share
- `followed`: followed account entries
- `error`: present only when `ok` is false
