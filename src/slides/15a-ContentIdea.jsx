import { Fragment } from '@revealjs/react';

export function ContentIdeaSlide() {
  return (
    <div>
      <p className="kicker">Content Generation &mdash; Step 1</p>
      <h2>It Starts with an Idea</h2>
      <p style={{ fontSize: '0.54em', color: 'rgba(232,234,255,0.72)', marginBottom: 14, maxWidth: 960, lineHeight: 1.5 }}>
        Anytime I have a content idea, I drop it to Rusty on Telegram. He stores it in a SQLite idea bank.
        Every morning at <strong style={{ color: '#fff' }}>10:30 AM</strong>, the content pipeline wakes up and checks for the next unused idea.
      </p>
      <div className="contentFlowGrid">
        <Fragment animation="fade-up">
          <div className="contentFlowStep">
            <div className="contentFlowNum">1</div>
            <div className="contentFlowBody">
              <h3>Drop an Idea</h3>
              <p className="contentFlowChat">
                <span className="contentFlowMe">Me on Telegram:</span>
                &ldquo;Drop an idea in the idea bank to have a post about cross-training for volleyball players&rdquo;
              </p>
              <div className="contentFlowCode">
                <code>ideas.mjs add --name &quot;Cross-training for volleyball players&quot;</code>
              </div>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="contentFlowStep">
            <div className="contentFlowNum">2</div>
            <div className="contentFlowBody">
              <h3>Stored in SQLite</h3>
              <p>The idea bank is a simple table: <code style={{ color: 'var(--accent-purple)' }}>idea_name</code> + <code style={{ color: 'var(--accent-purple)' }}>has_been_used</code>. Ideas are served oldest-first, so nothing gets lost.</p>
              <div className="contentFlowCode">
                <code>ideas.mjs next --db memory/ideas.db</code>
              </div>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="contentFlowStep">
            <div className="contentFlowNum">3</div>
            <div className="contentFlowBody">
              <h3>Cron Picks It Up</h3>
              <p>The <code style={{ color: 'var(--accent-cyan)' }}>social-content</code> skill fires daily. If the idea bank has an unused idea, that becomes today&rsquo;s topic. Otherwise it finds a trending NCAA volleyball topic.</p>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
