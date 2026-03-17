import { Code } from '@revealjs/react';
import { Fragment } from '@revealjs/react';

const workflowCode = `# Today's topic: "Cross-training for volleyball players"
# Seed source: idea-bank

# Create a tracked run in content.db
content-run.mjs create --topic "Cross-training..." \\
  --seed-source "idea-bank" --db memory/content.db

# Generate platform images with Ideogram V3
ideogram.mjs --prompt "Cross-training..." \\
  --aspect 1x1 --output social/assets/ig-2026-03-15.png
ideogram.mjs --prompt "Cross-training..." \\
  --aspect 16x9 --output social/assets/x-2026-03-15.png

# Write platform-specific copy
content-run.mjs update --id 6 \\
  --copy-x "Your secret weapon to the next level? 🥊🩰"
  --copy-instagram "<full IG caption with hashtags>" \\
  --copy-threads "<500 char threads version>" \\
  --db memory/content.db

# Publish to all 3 channels via Buffer API
buffer.mjs publish --run-id 6 \\
  --gog-account adam@volleyintel.com --mode shareNow

# Mark published + notify Telegram
content-run.mjs mark-published --id 6 --db memory/content.db`;

export function ContentWorkflowSlide() {
  return (
    <div>
      <p className="kicker">Content Generation &mdash; Step 2</p>
      <h2>Write, Generate, Publish</h2>
      <p className="mini" style={{ marginBottom: 12 }}>
        One skill file orchestrates the entire pipeline &mdash; copy, image, and multi-platform publishing.
      </p>
      <Code language="bash" lineNumbers="1-2|4-6|8-12|14-19|21-23|25-26">
        {workflowCode}
      </Code>
      <Fragment animation="fade-up">
        <div style={{ display: 'flex', gap: 20, marginTop: 16 }}>
          <div className="contentToolTag">Ideogram V3</div>
          <div className="contentToolTag">Buffer GraphQL</div>
          <div className="contentToolTag">Google Drive (gog)</div>
          <div className="contentToolTag">SQLite</div>
        </div>
      </Fragment>
    </div>
  );
}
