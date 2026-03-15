import { Fragment } from '@revealjs/react';

export function DailyBriefSlide() {
  return (
    <div>
      <p className="kicker">Every Morning</p>
      <h2>Daily Workflow</h2>
      <div className="iconGrid">
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4CB;</span>
            <p className="iconLabel">Reminders</p>
            <p className="iconDesc">Priorities and tasks surfaced before the day starts.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4F0;</span>
            <p className="iconLabel">Daily Brief</p>
            <p className="iconDesc">A concise summary to start the morning focused.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F602;</span>
            <p className="iconLabel">Morning Joke</p>
            <p className="iconDesc">A fresh joke texted to my wife every single day.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
