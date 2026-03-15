import { Code, Fragment } from '@revealjs/react';

const automationSnippet = `workflow "volleyintel_daily" {
  schedule: "0 7 * * *"
  steps: [
    inbox.classify(),
    inbox.archive(["newsletter", "spam"]),
    inbox.draftPriorityReplies(),
    social.discover("d1 women's volleyball recruiting"),
    social.engage(limit=20),
    content.generateDailyPost(withVisual=true),
    content.publish()
  ]
}`;

export function AutomationCodeSlide() {
  return (
    <div>
      <p className="kicker">Code Showcase</p>
      <h2 className="sectionHeader">Automation Workflow Pattern</h2>
      <p className="mini">
        <Fragment animation="fade-up">Placeholder workflow snippet ready for your real automation code.</Fragment>
      </p>
      <Code language="ruby" lineNumbers="1-2|3-5|6-8|9-11">
        {automationSnippet}
      </Code>
    </div>
  );
}
