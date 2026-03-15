---
name: social-content
description: Create daily social content with Ideogram V3 images and platform-specific copy for X, Instagram, and Threads.
metadata:
  openclaw:
    requires:
      browser: openclaw
      bins:
        - node
---

# Social Content

Create one daily social post package and publish it.

## Workflow

1. Pick a topic.

```bash
node skills/idea-bank/scripts/ideas.mjs next --db memory/ideas.db
```

Use the returned idea if one exists. Otherwise find a trending NCAA women's volleyball topic via web/X.
Set `seed-source` to `idea-bank` when using an idea-bank topic, otherwise `trending`.

2. Create a run.

```bash
node skills/social-content/scripts/content-run.mjs create \
  --topic "<topic>" \
  --seed-source "<idea-bank|trending>" \
  --db memory/content.db
```

3. Generate images.

```bash
node scripts/ideogram.mjs --prompt "<topic>" --aspect 1x1 --output social/assets/ig-YYYY-MM-DD.png
node scripts/ideogram.mjs --prompt "<topic>" --aspect 16x9 --output social/assets/x-YYYY-MM-DD.png
```

4. Update the run with the Instagram image path.

```bash
node skills/social-content/scripts/content-run.mjs update \
  --id <run_id> \
  --image-file social/assets/ig-YYYY-MM-DD.png \
  --db memory/content.db
```

5. Write platform copy and update the run. X copy must be 280 chars or fewer. Threads copy must be 500 chars or fewer.

```bash
node skills/social-content/scripts/content-run.mjs update \
  --id <run_id> \
  --copy-x "<x copy>" \
  --copy-instagram "<instagram copy>" \
  --copy-threads "<threads copy>" \
  --db memory/content.db
```

6. Publish from the run.

```bash
node skills/buffer-api/scripts/buffer.mjs publish \
  --run-db memory/content.db \
  --run-id <run_id> \
  --gog-account adam@volleyintel.com \
  --mode shareNow
```

7. Mark the run as published.

```bash
node skills/social-content/scripts/content-run.mjs mark-published \
  --id <run_id> \
  --db memory/content.db
```

8. If the topic came from idea bank, mark it used.

```bash
node skills/idea-bank/scripts/ideas.mjs mark-used --name "<idea>" --db memory/ideas.db
```

9. Send one completion message to `telegram:-5271219210` with a short summary.
