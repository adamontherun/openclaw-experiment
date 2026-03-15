import { Fragment } from '@revealjs/react';

export function WhatIsItSlide() {
  return (
    <div>
      <p className="kicker">Product Scope</p>
      <h2>What VolleyIntel Tracks</h2>
      <div className="iconGrid">
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F465;</span>
            <p className="iconLabel">Staff</p>
            <p className="iconDesc">Coaching staff structures and recruiting ownership.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4CA;</span>
            <p className="iconLabel">Program Needs</p>
            <p className="iconDesc">Roster gaps, position priorities, and scholarship availability.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="iconItem">
            <span className="iconEmoji">&#x1F4DD;</span>
            <p className="iconLabel">Applications</p>
            <p className="iconDesc">Contact info, process details, and submission requirements.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
