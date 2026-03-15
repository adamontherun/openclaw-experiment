export function VolleyIntelCronsSlide() {
  const jobs = [
    { time: '10:30 AM', name: 'Social Content', desc: 'Generate + publish daily post', expr: '30 10 * * *' },
    { time: '11:30 AM', name: 'Gmail Triage', desc: 'Inbox cleanup + draft replies', expr: '30 11 * * *' },
    { time: '11:45 AM', name: 'Social Monitor', desc: 'Check mentions across 4 platforms', expr: '45 11 * * *' },
    { time: '12:00 PM', name: 'X Engage', desc: 'Follow + like + reply (3 accounts)', expr: '0 12 * * *' },
    { time: '12:10 PM', name: 'Instagram Engage', desc: 'Follow + like + reply (3 accounts)', expr: '10 12 * * *' },
    { time: '12:20 PM', name: 'Threads Engage', desc: 'Follow + like + reply (3 accounts)', expr: '20 12 * * *' },
    { time: '12:30 PM', name: 'Reddit Engage', desc: 'Follow + like + reply (3 accounts)', expr: '30 12 * * *' },
    { time: '12:40 PM', name: 'Daily Brief', desc: '7 data sources → Telegram', expr: '40 12 * * *' },
    { time: '12:00 AM/PM', name: 'Healthcheck', desc: 'Verify web + API endpoints', expr: '0 0,12 * * *' },
  ];

  return (
    <div>
      <p className="kicker">Orchestration</p>
      <h2>VolleyIntel Cron Schedule</h2>
      <p className="mini" style={{ marginBottom: 6 }}>All times HST &middot; Staggered to avoid rate limits &middot; Agent: <code style={{ color: 'var(--accent-purple)' }}>volleyintel</code></p>
      <table className="cronTable">
        <thead>
          <tr>
            <th>Time</th>
            <th>Job</th>
            <th style={{ minWidth: 220 }}>What it Does</th>
            <th>Cron</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.name}>
              <td style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{j.time}</td>
              <td>{j.name}</td>
              <td style={{ color: 'rgba(232,234,255,0.65)' }}>{j.desc}</td>
              <td className="cronExpr">{j.expr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
