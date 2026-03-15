import { Code } from '@revealjs/react';

const triageFlow = `# Gmail Manager — Triage Mode
# Runs daily at 11:30 AM HST

gog --json --account adam@volleyintel.com \\
  gmail search 'newer_than:6h' --max 50

# For each thread:
#   Spam/promos   → archive (remove INBOX label)
#   Newsletters   → archive
#   Customer mail → draft reply using BRAND.md + knowledge-base

node gmail-drafts.mjs create \\
  --thread-id "<id>" \\
  --reply-to-message-id "<msgId>" \\
  --draft-reply "<AI-generated reply>" \\
  --db memory/gmail.db

# Send numbered approval summary → Telegram
# Adam replies: "approve 1", "edit 2: ...", "skip 3"`;

export function GmailTriageSlide() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/gmail-manager</span>
        <span className="deliveryTag telegram">Telegram approval</span>
      </div>
      <h2>Email Triage &amp; Draft Replies</h2>
      <Code language="bash" lineNumbers="1-2|4-5|7-11|13-17|19-21">
        {triageFlow}
      </Code>
    </div>
  );
}
