export function TakeawaySlide() {
  return (
    <div className="centered">
      <p className="kicker">The Takeaway</p>
      <h2 className="punch" style={{ fontSize: '1.7em', maxWidth: 950 }}>
        AI agents aren&rsquo;t the future.<br />
        <span style={{ color: 'var(--accent-cyan)' }}>They&rsquo;re running my life right now.</span>
      </h2>
      <div className="accentBar" />
      <p className="lead" style={{ maxWidth: 850 }}>
        16 automations. 2 agents. Zero manual intervention on a good day.<br />
        The barrier to entry has never been lower &mdash; the hard part is prompt engineering, not infrastructure.
      </p>
    </div>
  );
}
