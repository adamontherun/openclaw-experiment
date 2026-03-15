import { Fragment } from '@revealjs/react';

export function TheProblemsSlide() {
  return (
    <div>
      <p className="kicker">Pain Points</p>
      <h2>Current Limitations</h2>
      <div style={{ marginTop: 28 }}>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Sessions get stuck</h3>
              <p>Long-running sessions can stall and require manual recovery.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Cheaper models struggle</h3>
              <p>Quality degrades noticeably when not using top-tier models.</p>
            </div>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="statusItem">
            <div className="statusBar red" />
            <div className="statusContent">
              <h3>Reliability expectations grow</h3>
              <p>As automations scale, tolerance for failures shrinks fast.</p>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
