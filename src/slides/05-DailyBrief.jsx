export function DailyBriefSlide() {
  return (
    <div className="splitSlide">
      <div>
        <img
          src="/images/daily-brief-screenshot.png"
          alt="Daily brief Telegram message screenshot"
          style={{
            width: '100%',
            maxHeight: 620,
            objectFit: 'contain',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.16)',
          }}
        />
      </div>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 8,
          }}>
          <span className="skillBadge">skills/daily-brief</span>
          <span className="deliveryTag telegram">Telegram</span>
        </div>
        <h2 style={{ marginBottom: 14 }}>Daily Brief</h2>
        <div className="card" style={{ padding: '18px 20px' }}>
          <p style={{ margin: 0, fontSize: '0.5em', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>4:00 AM HST, every day</strong>
            <br />
            Pulls last-24h signal from Tavily + xAI search + targeted Reddit
            communities.
          </p>
        </div>
        <div className="card" style={{ padding: '18px 20px', marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: '0.5em', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>No-repeat system</strong>
            <br />
            Checks 7 days of{' '}
            <code style={{ color: 'var(--accent-purple)' }}>
              daily_brief_archive.md
            </code>{' '}
            and filters duplicates before writing.
          </p>
        </div>
        <div className="card" style={{ padding: '18px 20px', marginTop: 12 }}>
          <p style={{ margin: 0, fontSize: '0.5em', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>
              Ready-to-read output in ~3 minutes
            </strong>
            <br />
            Telegram-formatted digest with inline links, then auto-appended to
            archive.
          </p>
        </div>
      </div>
    </div>
  );
}
