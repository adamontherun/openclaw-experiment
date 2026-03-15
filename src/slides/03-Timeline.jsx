import { Fragment } from '@revealjs/react';

export function TimelineSlide() {
  return (
    <div>
      <p className="kicker">The Journey</p>
      <h2>From Curiosity to Daily Reliance</h2>
      <div className="timelineRow">
        <div className="timelineCol">
          <p className="timeNum">01</p>
          <h3>January</h3>
          <p>Started using OpenClaw for simple daily tasks and reminders.</p>
        </div>
        <Fragment animation="fade-up">
          <div className="timelineCol">
            <p className="timeNum">02</p>
            <h3>Feb &ndash; Mar</h3>
            <p>Expanded into family logistics, communications, and scheduling.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="timelineCol">
            <p className="timeNum">03</p>
            <h3>Now</h3>
            <p>Running personal automations and a micro SaaS experiment daily.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
