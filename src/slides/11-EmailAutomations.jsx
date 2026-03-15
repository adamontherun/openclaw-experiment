import { Fragment } from '@revealjs/react';

export function EmailAutomationsSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2>Inbox Triage Engine</h2>
      <div className="iconGrid">
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4E8;</span>
            <p className="iconLabel">Classify</p>
            <p className="iconDesc">Scan and tag every incoming message automatically.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F5D1;&#xFE0F;</span>
            <p className="iconLabel">Archive</p>
            <p className="iconDesc">Newsletters and spam cleared without intervention.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x270D;&#xFE0F;</span>
            <p className="iconLabel">Draft</p>
            <p className="iconDesc">Priority replies prepared and waiting for review.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
