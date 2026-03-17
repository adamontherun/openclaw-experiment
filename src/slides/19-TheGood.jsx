import { Fragment } from '@revealjs/react';

export function TheGoodSlide() {
  return (
    <div>
      <p className="kicker">What&rsquo;s Working</p>
      <h2>The Good</h2>
      <div style={{ marginTop: 24 }}>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Skills are intuitive</h3>
              <p>
                Markdown files with steps &mdash; no SDK, no framework. Just
                describe what you want.
              </p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Telegram is very convenient</h3>
              <p>
                There is something magical about being able to interact with
                your bot so easily.
              </p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Browser automation is powerful</h3>
              <p>
                Reddit Ads, Search Console, TeamSnap, Threads, Instagram &mdash;
                all via managed browser profiles.
              </p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Multi-channel delivery</h3>
              <p>
                iMessage, Telegram, Gmail, Google Drive &mdash; all from one
                agent with native integrations.
              </p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>SQLite as the glue</h3>
              <p>
                engagement.db, mentions.db, content.db, life-ops.sqlite &mdash;
                structured data that skills can query and share.
              </p>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
