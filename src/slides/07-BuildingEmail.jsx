import { Fragment } from '@revealjs/react';

export function BuildingEmailSlide() {
  return (
    <div>
      <p className="kicker">Communication</p>
      <h2>Building Front Desk Emails</h2>
      <div className="iconGrid">
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x2709;&#xFE0F;</span>
            <p className="iconLabel">Draft</p>
            <p className="iconDesc">Routine requests composed in my tone and style.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4AC;</span>
            <p className="iconLabel">Thread</p>
            <p className="iconDesc">Clean history maintained for easy follow-ups.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x2705;</span>
            <p className="iconLabel">Approve</p>
            <p className="iconDesc">Admin work reduced to quick review and send.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
