import { Code } from '@revealjs/react';

const automationSnippet = `workflow "volleyintel_daily" {
  schedule: "0 7 * * *"
  steps: [
    inbox.classify(),
    inbox.archive(["newsletter", "spam"]),
    inbox.draftPriorityReplies(),
    social.discover("d1 volleyball recruiting"),
    social.engage(limit=20),
    content.generateDailyPost(withVisual=true),
    content.publish()
  ]
}`;

export function AutomationCodeSlide() {
  return (
    <div>
      <p className="kicker">Code</p>
      <h2>Automation Workflow</h2>
      <p className="mini" style={{ marginBottom: 16 }}>Placeholder &mdash; swap with your real automation config.</p>
      <Code language="ruby" lineNumbers="1-2|3-6|7-11">
        {automationSnippet}
      </Code>
    </div>
  );
}
