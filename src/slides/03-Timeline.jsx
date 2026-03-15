export function TimelineSlide() {
  return (
    <div>
      <p className="kicker">The Journey</p>
      <h2>January 2026 &rarr; Now</h2>
      <div className="timelineRow">
        <div className="timelineCol">
          <p className="timeNum">Jan</p>
          <h3>Discovery</h3>
          <p>Started using OpenClaw. First skill: a daily brief pulling Reddit + web news, delivered to Telegram every morning at 4 AM.</p>
        </div>
        <div className="timelineCol">
          <p className="timeNum">Feb</p>
          <h3>Personal Ops</h3>
          <p>Built a Life Ops indexer, Heather&rsquo;s morning joke, kids&rsquo; sports schedules, workout accountability, and building front desk emails.</p>
        </div>
        <div className="timelineCol">
          <p className="timeNum">Mar</p>
          <h3>Micro-SaaS</h3>
          <p>Launched VolleyIntel. Full social media engine, Gmail triage, daily brief with real metrics &mdash; 16 cron jobs running daily.</p>
        </div>
      </div>
    </div>
  );
}
