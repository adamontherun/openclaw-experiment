import { Fragment } from '@revealjs/react';

const tasks = [
  { emoji: '😂', text: 'morning dad jokes for his wife' },
  { emoji: '📰', text: 'daily news briefs delivered to Telegram' },
  { emoji: '📬', text: 'inbox triage and draft replies' },
  { emoji: '📱', text: 'app marketing and social engagement' },
  { emoji: '🏐', text: 'kids\' sports schedules and reminders' },
];

export function HookSlide() {
  return (
    <div className="centered">
      <Fragment animation="fade-in">
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '0.56em',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--accent-cyan)',
          marginBottom: 10,
        }}>
          Meet Rusty 🦀
        </p>
      </Fragment>

      <Fragment animation="fade-up">
        <h1 className="glow" style={{ fontSize: '2em', marginBottom: 0, lineHeight: 1.05 }}>
          Adam&rsquo;s OpenClaw-powered<br />AI assistant
        </h1>
      </Fragment>

      <Fragment animation="fade-up">
        <p style={{
          fontSize: '0.55em',
          color: 'rgba(232,234,255,0.6)',
          marginTop: 14,
          marginBottom: 28,
          letterSpacing: '0.01em',
        }}>
          Rusty helps Adam with&hellip;
        </p>
      </Fragment>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 760, width: '100%' }}>
        {tasks.map((task) => (
          <Fragment key={task.text} animation="fade-up">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '10px 20px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <span style={{ fontSize: '1.1em', flexShrink: 0 }}>{task.emoji}</span>
              <p style={{
                margin: 0,
                fontSize: '0.52em',
                color: 'rgba(232,234,255,0.85)',
                fontWeight: 500,
                lineHeight: 1.4,
              }}>{task.text}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
