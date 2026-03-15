import { Fragment } from '@revealjs/react';

export function DailyBriefSlide() {
  return (
    <div>
      <p className="kicker">Daily Systems</p>
      <h2 className="sectionHeader">Morning Workflow</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">Daily reminders and priorities</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">A daily brief to start focused</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">A morning joke text to my wife</Fragment>
        </li>
      </ul>
    </div>
  );
}
