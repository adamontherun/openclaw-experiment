export function VolleyIntelBriefSlide() {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <span className="skillBadge">skills/volleyintel-brief</span>
        <span className="deliveryTag telegram">Telegram</span>
      </div>
      <h2>Daily Business Brief</h2>
      <p className="mini" style={{ marginBottom: 14 }}>Real output from March 13, 2026 &mdash; compiled from 7 data sources via browser automation + Node scripts.</p>
      <div className="slideGrid">
        <div className="briefOutput">
          <strong>VolleyIntel Daily Brief &mdash; 2026-03-13</strong>
          <span className="briefSection">Reddit Ads</span>
          Spend: <span className="briefMetric">$0.00</span> · Impressions: 45 · CTR: 0%<br />
          Campaign not spending &mdash; needs bid optimization
          <span className="briefSection">Search Console</span>
          Clicks: <span className="briefMetric">5 (+5)</span> · Impressions: <span className="briefMetric">30 (+22)</span><br />
          Avg position: 13.6 · First organic clicks recorded!
          <span className="briefSection">PostHog Traffic</span>
          Pageviews: <span className="briefMetric">211 (+35%)</span> · Visitors: 26<br />
          Spike on 03/13: 57 views
          <span className="briefSection">Users &amp; Billing (Clerk)</span>
          Total: <span className="briefMetric">6 users (+4)</span> · MRR: <span className="briefMetric">$9</span><br />
          First paying customer!
        </div>
        <div>
          <p className="kicker" style={{ marginTop: 0 }}>Data Sources</p>
          <div style={{ fontSize: '0.5em', lineHeight: 2 }}>
            <div className="statusItem">
              <div className="statusBar cyan" />
              <div className="statusContent">
                <h3>Reddit Ads</h3>
                <p>Browser automation &rarr; ads.reddit.com</p>
              </div>
            </div>
            <div className="statusItem">
              <div className="statusBar green" />
              <div className="statusContent">
                <h3>Search Console</h3>
                <p>Browser automation &rarr; clicks, queries, pages</p>
              </div>
            </div>
            <div className="statusItem">
              <div className="statusBar purple" />
              <div className="statusContent">
                <h3>PostHog + Clerk</h3>
                <p>Node scripts &rarr; web traffic, usage, users</p>
              </div>
            </div>
            <div className="statusItem">
              <div className="statusBar orange" />
              <div className="statusContent">
                <h3>SQLite DBs</h3>
                <p>engagement.db · mentions.db · content.db</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
