import { Fragment } from '@revealjs/react';

export function TimelineSlide() {
  return (
    <div>
      <p className="kicker">Timeline</p>
      <h2 className="sectionHeader">Started in January</h2>
      <div className="timeline">
        <div className="timelineItem">
          <h3>January</h3>
          <p>Started using OpenClaw daily for practical, repetitive tasks.</p>
        </div>
        <div className="timelineItem fragment fade-up">
          <h3>February-March</h3>
          <p>Expanded to family logistics, reminders, and communication workflows.</p>
        </div>
        <div className="timelineItem">
          <Fragment animation="fade-up">
            <h3>Now</h3>
            <p>Running a personal + micro SaaS automation engine with real value and real constraints.</p>
          </Fragment>
        </div>
      </div>
    </div>
  );
}
