import { Fragment } from '@revealjs/react';

export function EmailAutomationsSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2 className="sectionHeader">Inbox Triage Engine</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">Check and classify incoming mail</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Archive newsletters and spam</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Draft replies to important messages</Fragment>
        </li>
      </ul>
    </div>
  );
}
