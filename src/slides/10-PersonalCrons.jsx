export function PersonalCronsSlide() {
  const jobs = [
    { time: '4:00 AM', name: 'Daily Brief', target: 'Telegram', expr: '0 4 * * *' },
    { time: '8:15 AM', name: 'Sleep Tracker Reminder', target: 'Telegram', expr: '15 8 * * *' },
    { time: '9:00 AM', name: 'Morning Joke for Heather', target: 'iMessage', expr: '0 9 * * *' },
    { time: '11:00 AM', name: 'Workout Motivation', target: 'Telegram', expr: '0 11 * * *' },
    { time: '4:00 PM', name: 'Workout Accountability Check', target: 'Telegram', expr: '0 16 * * *' },
    { time: '12:00 AM', name: 'Nightly Workspace Commit', target: 'Git', expr: '0 0 * * *' },
    { time: '1:00 AM', name: 'Nightly Database Backup', target: 'Google Drive', expr: '0 1 * * *' },
  ];

  return (
    <div>
      <p className="kicker">Orchestration</p>
      <h2>Personal Cron Schedule</h2>
      <p className="mini" style={{ marginBottom: 6 }}>All times HST &middot; Powered by <code style={{ color: 'var(--accent-purple)' }}>jobs.json</code></p>
      <table className="cronTable">
        <thead>
          <tr>
            <th>Time</th>
            <th>Job</th>
            <th>Delivery</th>
            <th>Cron</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.name}>
              <td style={{ fontWeight: 700, color: '#fff', whiteSpace: 'nowrap' }}>{j.time}</td>
              <td>{j.name}</td>
              <td>{j.target}</td>
              <td className="cronExpr">{j.expr}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
