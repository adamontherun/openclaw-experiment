import { Code } from '@revealjs/react';

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
      <p className="kicker">Code</p>
      <h2>Skills File Pattern</h2>
      <p className="mini" style={{ marginBottom: 16 }}>Placeholder &mdash; swap with your real OpenClaw config.</p>
      <Code language="json" lineNumbers="1-3|4-9|10-11">
        {skillsSnippet}
      </Code>
    </div>
  );
}
