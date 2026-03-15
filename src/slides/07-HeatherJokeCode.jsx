import { Code } from '@revealjs/react';

const skillYaml = `name: heather-morning-joke
schedule: "0 9 * * *"          # 9 AM HST daily
delivery: iMessage → +1 (808) ***-****

Steps:
  1. Fetch 5-10 posts from r/dadjokes (hot + top/day)
     fallback → xai-search "best new dad jokes today"
  2. Read recent_jokes.md (rolling 5-entry dedup)
  3. Pick & adapt joke — never invent from scratch
  4. Apply day-of-week format rotation
  5. Emit plain text: joke + 1-2 emojis + "Love, Adam & Rusty 🦀"
  6. Append to recent_jokes.md, trim to latest 5`;

export function HeatherJokeCodeSlide() {
  return (
    <div>
      <p className="kicker">Under the Hood</p>
      <h2>Skill File Anatomy</h2>
      <p className="mini" style={{ marginBottom: 14 }}>Each skill is a Markdown file with structured steps. OpenClaw reads and executes them top-to-bottom.</p>
      <Code language="yaml" lineNumbers="1-3|5-11|12">
        {skillYaml}
      </Code>
      <p className="mini" style={{ marginTop: 14 }}>
        <span style={{ color: 'var(--accent-green)' }}>38 seconds</span> average run time &nbsp;·&nbsp; Reddit-sourced, never invented &nbsp;·&nbsp; Dedup via rolling history
      </p>
    </div>
  );
}
