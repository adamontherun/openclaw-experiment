import { Fragment } from '@revealjs/react';

export function KidsSportsSlide() {
  return (
    <div>
      <p className="kicker">Family Logistics</p>
      <h2 className="sectionHeader">Kids Sports Scheduling</h2>
      <div className="slideGrid">
        <div className="card">
          <p className="metric">1</p>
          <p>Collect schedules and updates</p>
        </div>
        <div className="card fragment fade-up">
          <p className="metric">2</p>
          <p>Summarize conflicts and priorities</p>
        </div>
      </div>
      <p style={{ marginTop: 24 }}>
        <Fragment animation="fade-up">Fewer misses, less context switching, calmer mornings.</Fragment>
      </p>
    </div>
  );
}
