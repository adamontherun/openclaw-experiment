import { Fragment } from '@revealjs/react';

export function TheGoodSlide() {
  return (
    <div>
      <p className="kicker">What Worked</p>
      <h2>Why It Has Been Great</h2>
      <div style={{ marginTop: 28 }}>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Real time saved</h3>
              <p>Hours of repetitive work eliminated every single week.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Practical automations</h3>
              <p>From morning reminders to full social media outreach pipelines.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar green" />
            <div className="statusContent">
              <h3>Micro SaaS viable</h3>
              <p>Enough flexibility to power a real product experiment.</p>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
