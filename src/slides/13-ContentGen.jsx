import { Fragment } from '@revealjs/react';

export function ContentGenSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2>Content Generation Pipeline</h2>
      <div className="iconGrid">
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4A1;</span>
            <p className="iconLabel">Ideate</p>
            <p className="iconDesc">Generate a post idea grounded in current signals.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F3A8;</span>
            <p className="iconLabel">Design</p>
            <p className="iconDesc">Create a supporting visual asset automatically.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F680;</span>
            <p className="iconLabel">Publish</p>
            <p className="iconDesc">Post on schedule without manual intervention.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
