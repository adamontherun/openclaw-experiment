export function VolleyIntelHeaderSlide() {
  return (
    <div className="centered">
      <div style={{
        background: 'rgba(8, 11, 26, 0.72)',
        backdropFilter: 'blur(12px)',
        borderRadius: 20,
        padding: '40px 56px',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <p className="kicker">Part 2</p>
        <h1 className="sectionHeader glow">VolleyIntel</h1>
        <div className="accentBar" style={{ margin: '12px auto' }} />
        <p className="lead">
          A micro-SaaS experiment &mdash; D1 women&rsquo;s volleyball recruiting
          intelligence.
          <br />9 skills. 9 cron jobs. One AI agent running the show.
        </p>
      </div>
    </div>
  );
}
