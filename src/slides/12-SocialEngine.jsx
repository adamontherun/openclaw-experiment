import { Fragment } from '@revealjs/react';

export function SocialEngineSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2 className="sectionHeader">Social Discovery + Engagement</h2>
      <div className="slideGrid">
        <div className="card">
          <p className="metric">Scan</p>
          <p>Find people discussing relevant recruiting topics.</p>
        </div>
        <div className="card">
          <p className="metric">Engage</p>
          <p>Follow, interact, and reply with context-specific messaging.</p>
        </div>
      </div>
      <p style={{ marginTop: 22 }}>
        <Fragment animation="fade-up">The workflow runs daily without manual hunting.</Fragment>
      </p>
    </div>
  );
}
