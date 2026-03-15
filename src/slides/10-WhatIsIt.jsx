import { Fragment } from '@revealjs/react';

export function WhatIsItSlide() {
  return (
    <div>
      <p className="kicker">Product Scope</p>
      <h2 className="sectionHeader">What VolleyIntel Tracks</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">Staff structures and recruiting ownership</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Program needs and roster priorities</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Application, contact, and process details</Fragment>
        </li>
      </ul>
    </div>
  );
}
