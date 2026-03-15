import { Fragment } from '@revealjs/react';

export function HeatherJokeSlide() {
  return (
    <div className="splitSlide">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span className="skillBadge">skills/heather-morning-joke</span>
          <span className="deliveryTag imessage">iMessage</span>
        </div>
        <h2>Morning Joke for Heather</h2>
        <p style={{ fontSize: '0.54em', color: 'rgba(232,234,255,0.72)', marginBottom: 20, lineHeight: 1.5 }}>
          Every day at <strong style={{ color: '#fff' }}>9:00 AM</strong>, OpenClaw sources a fresh dad joke from Reddit, adapts it for Heather, and delivers it via iMessage &mdash; signed from Adam &amp; Rusty.
        </p>
        <Fragment animation="fade-up">
          <div style={{ fontSize: '0.48em', color: 'rgba(232,234,255,0.6)', marginBottom: 10 }}>Day-of-week format rotation:</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 20px', fontSize: '0.46em', color: 'rgba(232,234,255,0.72)' }}>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Mon</strong> Pun / wordplay</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Tue</strong> &ldquo;What do you call&hellip;&rdquo;</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Wed</strong> Knock-knock</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Thu</strong> One-liner</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Fri</strong> Absurdist / anti-joke</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Sat</strong> Topical</span>
            <span><strong style={{ color: 'var(--accent-cyan)' }}>Sun</strong> Wholesome groaner</span>
          </div>
        </Fragment>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/images/joke-placeholder.png" alt="iMessage joke screenshot" style={{ maxHeight: 460, borderRadius: 20 }} />
      </div>
    </div>
  );
}
