import { Fragment } from '@revealjs/react';

export function WhatIsItSlide() {
  return (
    <div>
      <p className="kicker">The Product</p>
      <h2>What is VolleyIntel?</h2>
      <p style={{ fontSize: '0.58em', color: 'rgba(232,234,255,0.72)', marginBottom: 28, maxWidth: 900, lineHeight: 1.55 }}>
        A recruiting intelligence platform that collects what each D1 women&rsquo;s volleyball program has on their recruiting process &mdash; staff, program needs, application info, and more.
      </p>
      <div className="slideGrid">
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">6</p>
            <p>registered users &mdash; first paying customer at $9/mo</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">211</p>
            <p>pageviews last week &mdash; up 35% week-over-week</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">97</p>
            <p>searches submitted &mdash; 54% search-to-profile conversion</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric">5</p>
            <p>first organic Google clicks &mdash; SEO visibility growing</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
