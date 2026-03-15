import { Fragment } from '@revealjs/react';

export function TheGoodSlide() {
  return (
    <div>
      <p className="kicker">What Worked</p>
      <h2 className="sectionHeader">Why It Has Been Great</h2>
      <ul>
        <li>
          <Fragment animation="highlight-green">Real personal time saved every day</Fragment>
        </li>
        <li>
          <Fragment animation="highlight-green">Practical automations from reminders to outreach</Fragment>
        </li>
        <li>
          <Fragment animation="highlight-green">Enough flexibility to power a real micro SaaS experiment</Fragment>
        </li>
      </ul>
    </div>
  );
}
