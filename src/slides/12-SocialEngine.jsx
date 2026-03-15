import { Fragment } from '@revealjs/react';

export function SocialEngineSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2>Social Discovery + Engagement</h2>
      <div className="slideGrid">
        <div className="card">
          <p className="metric">Scan</p>
          <h3>Discover</h3>
          <p>Search social media daily for people discussing D1 volleyball recruiting.</p>
        </div>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">Act</p>
            <h3>Engage</h3>
            <p>Follow, interact, and reply with relevant, context-specific messaging.</p>
          </div>
        </Fragment>
      </div>
      <Fragment animation="fade-up">
        <p className="mini" style={{ marginTop: 20 }}>Runs daily without manual hunting or scheduling.</p>
      </Fragment>
    </div>
  );
}
