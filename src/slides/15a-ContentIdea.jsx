import { Fragment } from '@revealjs/react';

export function ContentIdeaSlide() {
  return (
    <div>
      <p className="kicker">Content Generation</p>
      <h2 style={{ marginBottom: 6 }}>Fresh Content, Every Day, 🦥 Effort</h2>
      <p
        style={{
          fontSize: '0.52em',
          color: 'rgba(232,234,255,0.68)',
          lineHeight: 1.55,
          maxWidth: 900,
          marginBottom: 20,
        }}>
        VolleyIntel posts daily across Instagram, Threads, and X &mdash; and
        Adam never opens a design tool. Ideas come from one of two places:
      </p>

      <div className="ideaSourceGrid">
        <Fragment animation="fade-up">
          <div className="ideaSourceCard human">
            <div className="ideaSourceIcon">💬</div>
            <h3>Adam Drops an Idea</h3>
            <p>
              At any time, Adam messages Rusty on Telegram with a content idea.
              Rusty saves it to the <strong>idea bank</strong> in SQLite,
              first-in-first-out.
            </p>
            <div className="contentFlowChat" style={{ marginTop: 10 }}>
              <span className="contentFlowMe">Adam on Telegram:</span>
              &ldquo;Add an idea about cross-training for volleyball
              players&rdquo;
            </div>
          </div>
        </Fragment>

        <Fragment animation="fade-in">
          <div className="ideaSourceDivider">
            <span>or</span>
          </div>
        </Fragment>

        <Fragment animation="fade-up">
          <div className="ideaSourceCard ai">
            <div className="ideaSourceIcon">🔍</div>
            <h3>Rusty Finds Inspiration</h3>
            <p>
              Each morning, Rusty checks the idea bank. If it&rsquo;s empty, he
              scans what coaches and athletes are posting on social media and
              picks a trending topic in the volleyball recruiting space.
            </p>
            <div className="ideaSourceTag">AI-sourced from social scan</div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
