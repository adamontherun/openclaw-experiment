const sections = [
  {
    emoji: '📢',
    title: 'Reddit Ads',
    tone: 'down',
    summary: 'Campaign active since Mar 8. Impressions are trickling in, but clicks and conversions are still at zero.',
    lines: [
      'Spend: $0.00',
      'Impressions: 45',
      'Clicks: 0 | CTR: 0.000%',
      'CPC: $0.00 | eCPM: $0.00',
      'Conversions: 0',
    ],
    trend: 'Campaign just launched Mar 8. Needs creative and bid review.',
  },
  {
    emoji: '🔍',
    title: 'Website — Search Console',
    tone: 'up',
    summary: 'Early organic traction is showing up through coach-name queries and school pages.',
    lines: [
      'Clicks: 5 | Impressions: 30',
      'CTR: 16.7% | Avg Position: 13.6',
      'Top Pages: / (5c / 12i), /schools/marist (0c / 7i), /schools/indiana (0c / 6i)',
      'Top Queries: indiana volleyball coaches, ethan greenberg dartmouth, chad gatzlaff',
    ],
    trend: 'CTR is strong for a new site. Average position is close enough to page 1 to matter.',
  },
  {
    emoji: '📊',
    title: 'Traffic — PostHog',
    tone: 'up',
    summary: 'Traffic is still spiky, but the spikes are meaningful and tied to active growth pushes.',
    lines: [
      'Total pageviews: 153 | Unique visitors: 21',
      'Mar 8: 3 | Mar 9: 4 | Mar 10: 51',
      'Mar 11: 34 | Mar 12: 4 | Mar 13: 57',
    ],
    trend: 'Strong peaks on Mar 10 and Mar 13. Consistency is still the next challenge.',
  },
  {
    emoji: '⚡',
    title: 'Product Usage — PostHog',
    tone: 'up',
    summary: 'People are not just landing; they are actively searching, exploring schools, and clicking outbound links.',
    lines: [
      'schoolviewed: 133',
      'searchsubmitted: 77',
      'searchresultclicked: 32',
      'schoolcardclicked: 29',
      'outboundlinkclicked: 14',
    ],
    trend: 'The search-to-school-view funnel is working. Outbound clicks suggest real recruiting intent.',
  },
  {
    emoji: '👥',
    title: 'Users & Billing — Clerk',
    tone: 'flat',
    summary: 'The product has its first paid signal, but paid conversion is still the main lever.',
    lines: [
      'Total users: 6',
      'New signups (24h): 0',
      'Paid: 1 ($9/mo Monthly plan)',
      'Free: 5',
    ],
    trend: 'No new signups today. One paying customer means the value prop is real, but fragile.',
  },
  {
    emoji: '💬',
    title: 'Social Engagement',
    tone: 'mixed',
    summary: 'Outbound activity remains the growth engine, with strong volume on Instagram and Threads.',
    lines: [
      'Total actions: 28 (vs 37 yesterday)',
      'Instagram: 9 — 3 follows, 3 likes, 3 replies',
      'Threads: 9 — 3 follows, 3 likes, 3 replies',
      'Reddit: 8 — 2 follows, 3 likes, 3 replies',
      'X: 2 — 1 follow, 1 like, 0 replies',
    ],
    trend: 'Reddit replies contained high-value VolleyIntel mentions. X is still the weakest channel.',
  },
  {
    emoji: '🔔',
    title: 'Social Mentions',
    tone: 'flat',
    summary: 'No inbound brand mentions were detected today.',
    lines: [
      'No new mentions today.',
    ],
    trend: 'Outbound engagement is still doing the heavy lifting for discovery.',
  },
  {
    emoji: '📝',
    title: 'Social Content Runs',
    tone: 'up',
    summary: 'One fresh content package was created and published on schedule from the idea bank.',
    lines: [
      'Runs created: 1 | Published: 1',
      'Latest run #6: "Daily stretching: the underrated habit that builds steady improvement and keeps you healthy long-term"',
      'Seed source: idea-bank',
      'Published: 10:31 AM HST',
    ],
    trend: 'Three straight days of publishing. Cadence is turning into a habit.',
  },
];

export function VolleyIntelBriefSlide() {
  return (
    <div className="briefSlideWrap" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <span className="skillBadge">skills/volleyintel-brief</span>
        <span className="deliveryTag telegram">Telegram</span>
      </div>
      <h2>Daily Business Brief</h2>
      <p className="mini" style={{ marginBottom: 8 }}>
        Real Telegram delivery from March 15, 2026.
      </p>
      <div className="briefScrollView" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div className="briefExampleLayout briefFullWidth">
          <div className="briefTranscriptShell">
            <div className="briefTranscriptTop">
              <span className="briefTranscriptApp">Telegram</span>
              <span className="briefTranscriptMeta">sent 12:40 PM HST</span>
            </div>
            <div className="briefTranscript">
              <div className="briefTranscriptHeader">
                <div className="briefTranscriptEmoji">🏐</div>
                <div>
                  <strong>VolleyIntel Daily Brief</strong>
                  <div className="briefTranscriptDate">2026-03-15</div>
                </div>
              </div>
              {sections.map((section) => (
                <div key={section.title} className={`briefSectionCard ${section.tone}`}>
                  <div className="briefSectionTitleRow">
                    <span className="briefSectionIcon">{section.emoji}</span>
                    <span className="briefSectionTitle">{section.title}</span>
                  </div>
                  <p className="briefSectionSummary">{section.summary}</p>
                  <div className="briefBullets">
                    {section.lines.map((line) => (
                      <div key={line} className="briefBullet">
                        {line}
                      </div>
                    ))}
                  </div>
                  <div className="briefTrendLine">
                    <span className="briefTrendLabel">Trend</span>
                    <span>{section.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
