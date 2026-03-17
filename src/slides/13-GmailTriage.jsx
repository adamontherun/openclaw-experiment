import { Code } from '@revealjs/react';

const skillFile = `# SKILL.md — the actual file the AI agent reads

## Triage mode (runs daily 11:30 AM)

1. Check which threads already have a draft → skip them
2. Search inbox: \`gmail search 'newer_than:6h' --max 50\`
3. Read each thread and classify:
   - Spam / promos → archive
   - Newsletters   → archive
   - Customer mail → draft a reply using BRAND.md

## Approval mode (Telegram)

Adam gets a numbered summary of pending drafts.
He replies with:
  approve 1        → send the draft
  edit 2: <text>   → revise and re-save
  skip 3           → mark as skipped

## After approval

Send via Gmail, mark sent in SQLite, archive thread.`;

export function GmailTriageSlide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/gmail-manager</span>
        <span className="deliveryTag telegram">Telegram approval</span>
      </div>
      <h2 style={{ marginBottom: 10 }}>Email Triage &amp; Draft Replies</h2>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(0,240,255,0.35) transparent' }}>
        <Code language="markdown" lineNumbers="1|3-10|12-18|20-22">
          {skillFile}
        </Code>
      </div>
    </div>
  );
}
