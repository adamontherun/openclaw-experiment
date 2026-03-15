import { Code, Fragment } from '@revealjs/react';

const skillsSnippet = `{
  "name": "Morning Planner",
  "trigger": "weekday 06:45",
  "steps": [
    "summarize calendar",
    "pull reminders",
    "compose daily brief",
    "send wife_joke_sms"
  ],
  "fallbackModel": "higher_reasoning_model"
}`;

export function SkillsCodeSlide() {
  return (
    <div>
      <p className="kicker">Code Showcase</p>
      <h2 className="sectionHeader">Skills File Pattern</h2>
      <p className="mini">
        <Fragment animation="fade-up">Placeholder structure ready for your real OpenClaw skill config.</Fragment>
      </p>
      <Code language="json" lineNumbers="1-2|3-5|6-8|9-11">
        {skillsSnippet}
      </Code>
    </div>
  );
}
