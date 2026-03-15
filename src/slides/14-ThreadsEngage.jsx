import { Code } from '@revealjs/react';

const engageFlow = `# Threads Engage — runs daily at 12:20 PM HST
# Also: X Engage (12:00), Instagram (12:10), Reddit (12:30)

# Step 1 — Load exclusion list from SQLite
node engagement.mjs engaged-users \\
  --platform threads --db memory/engagement.db

# Step 2 — Search & select 3 new accounts
# URL: threads.com/search?q=volleyball+recruiting&filter=recent
# Skip anyone already in engagement.db

# Step 3 — For EACH account (sequential, not batched):
#   3a. Follow → verify "Following" state → log
#   3b. Like one post → verify heart state → log
#   3c. Reply with high-energy message → verify → log

node engagement.mjs create \\
  --platform threads --username "@coach_jones" \\
  --action replied --message "Love this approach!" \\
  --db memory/engagement.db`;

export function ThreadsEngageSlide() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/threads-engage</span>
        <span style={{ fontSize: '0.44em', color: 'rgba(232,234,255,0.55)' }}>+ x-engage · instagram-engage · reddit-engage</span>
      </div>
      <h2>Social Engagement Engine</h2>
      <Code language="bash" lineNumbers="1-2|4-6|8-11|13-16|18-21">
        {engageFlow}
      </Code>
      <p className="mini" style={{ marginTop: 12 }}>
        4 platforms &times; 3 accounts &times; 3 actions = <strong style={{ color: 'var(--accent-cyan)' }}>up to 36 engagement touches/day</strong>, all logged to SQLite.
      </p>
    </div>
  );
}
