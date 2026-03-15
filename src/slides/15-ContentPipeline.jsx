import { Code } from '@revealjs/react';

const contentFlow = `# Social Content — runs daily at 10:30 AM HST

# 1. Pick topic from idea bank (or find trending)
node ideas.mjs next --db memory/ideas.db

# 2. Create a run in content.db
node content-run.mjs create \\
  --topic "Spring signing day prep tips" \\
  --seed-source "idea-bank" --db memory/content.db

# 3. Generate images with Ideogram V3
node ideogram.mjs --prompt "..." \\
  --aspect 1x1 --output social/assets/ig-2026-03-13.png
node ideogram.mjs --prompt "..." \\
  --aspect 16x9 --output social/assets/x-2026-03-13.png

# 4. Write platform-specific copy
#    X: ≤280 chars | Threads: ≤500 chars | IG: full caption

# 5. Publish via Buffer API → X, Instagram, Threads
node buffer.mjs publish --run-id <id> --mode shareNow

# 6. Mark published + notify Telegram`;

export function ContentPipelineSlide() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/social-content</span>
        <span style={{ fontSize: '0.44em', color: 'rgba(232,234,255,0.55)' }}>Ideogram V3 + Buffer API</span>
      </div>
      <h2>Content Generation Pipeline</h2>
      <Code language="bash" lineNumbers="1|3-4|6-9|11-15|17-18|20-21">
        {contentFlow}
      </Code>
    </div>
  );
}
