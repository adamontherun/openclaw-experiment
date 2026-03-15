import { Fragment } from '@revealjs/react';

export function BuildingEmailSlide() {
  return (
    <div>
      <p className="kicker">Communication Ops</p>
      <h2 className="sectionHeader">Building Front Desk Emails</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">Draft routine requests in my tone</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Keep a clean thread history for follow-ups</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Reduce repetitive admin work to quick approvals</Fragment>
        </li>
      </ul>
    </div>
  );
}
