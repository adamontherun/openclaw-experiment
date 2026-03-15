import { Fragment } from '@revealjs/react';

export function DailyBriefSlide() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/daily-brief</span>
        <span className="deliveryTag telegram">Telegram</span>
      </div>
      <h2>Daily Brief</h2>
      <p style={{ fontSize: '0.56em', color: 'rgba(232,234,255,0.7)', marginBottom: 24 }}>
        Every morning at <strong style={{ color: '#fff' }}>4:00 AM HST</strong>, OpenClaw compiles a high-signal news digest covering Joby Aviation, Rocket Lab, OpenClaw updates, and AI agent ecosystem news.
      </p>
      <div className="slideGrid">
        <div className="card">
          <h3>Sources</h3>
          <Fragment animation="fade-up">
            <p>Tavily Search (news mode, last 24h) + web_search + Reddit&rsquo;s r/JobyAviation, r/RocketLab, r/ArtificialIntelligence, r/AI_Agents</p>
          </Fragment>
        </div>
        <div className="card">
          <h3>Deduplication</h3>
          <Fragment animation="fade-up">
            <p>Reads the last 7 days from <code style={{ color: 'var(--accent-purple)' }}>daily_brief_archive.md</code> and builds an exclusion list. No repeats, ever.</p>
          </Fragment>
        </div>
        <div className="card">
          <h3>Output</h3>
          <Fragment animation="fade-up">
            <p>Telegram-formatted message &mdash; 2,500-3,500 chars, inline links, executive-ready. Appended to the archive automatically.</p>
          </Fragment>
        </div>
        <div className="card">
          <h3>Duration</h3>
          <Fragment animation="fade-up">
            <p style={{ fontSize: '1.3em', fontWeight: 800, color: 'var(--accent-cyan)' }}>~3 min</p>
            <p>Gathers data, deduplicates, writes, sends.</p>
          </Fragment>
        </div>
      </div>
    </div>
  );
}
