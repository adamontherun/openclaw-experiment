import { Code } from '@revealjs/react';

const emailCmd = `gog gmail send \\
  --to frontdesk@allurewaikiki.org \\
  --subject "grill for 5:30pm on Today" \\
  --body-file - <<'EOF'
Hi,

Please reserve us a grill at 5:30pm on Today.
If there's any issue, please just let me know.

Thank you,
Adam Smith Unit 1608
EOF`;

export function BuildingEmailSlide() {
  return (
    <div>
      <span className="skillBadge">skills/allure-front-desk</span>
      <h2>Building Front Desk</h2>
      <p style={{ fontSize: '0.54em', color: 'rgba(232,234,255,0.7)', marginBottom: 18 }}>
        &ldquo;Reserve a grill at 5:30&rdquo; &rarr; OpenClaw fills in friendly dates, validates required fields, sends via <code style={{ color: 'var(--accent-purple)' }}>gog</code>.
      </p>
      <Code language="bash" lineNumbers="1-3|5-12">
        {emailCmd}
      </Code>
      <p className="mini" style={{ marginTop: 16 }}>
        Also handles guest notices &mdash; validates date, time, and guest names before sending.
      </p>
    </div>
  );
}
