import { Fragment } from '@revealjs/react';

export function TheProblemsSlide() {
  return (
    <div>
      <p className="kicker">What&rsquo;s Not</p>
      <h2>The Problems</h2>
      <div style={{ marginTop: 24 }}>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Sessions get stuck</h3>
              <p>Long-running browser automation sometimes hangs. Needs manual intervention or session restart.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Model sensitivity</h3>
              <p>Cheaper models struggle with multi-step skills. Some jobs need explicit &ldquo;higher_reasoning_model&rdquo; fallback.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Prompt fragility</h3>
              <p>Skills need very precise instructions. Small wording changes can break a working automation.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Cost at scale</h3>
              <p>16 daily cron jobs &times; LLM calls &times; browser sessions &mdash; token costs add up for a $9 MRR product.</p>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
