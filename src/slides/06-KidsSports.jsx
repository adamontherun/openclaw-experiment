import { Fragment } from '@revealjs/react';

export function KidsSportsSlide() {
  return (
    <div>
      <p className="kicker">Family Logistics</p>
      <h2>Kids Sports Scheduling</h2>
      <div className="slideGrid">
        <div className="card">
          <p className="metric">Collect</p>
          <p>Pull schedules, updates, and changes from multiple sources.</p>
        </div>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">Summarize</p>
            <p>Surface conflicts, priorities, and what matters this week.</p>
          </div>
        </Fragment>
      </div>
      <Fragment animation="fade-up">
        <p className="mini" style={{ marginTop: 22 }}>Fewer misses, less context switching, calmer mornings.</p>
      </Fragment>
    </div>
  );
}
