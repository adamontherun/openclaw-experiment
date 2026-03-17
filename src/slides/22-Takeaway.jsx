export function TakeawaySlide() {
  return (
    <div className="centered">
      <p className="kicker">Takeaway</p>
      <h2 className="punch" style={{ fontSize: '1.7em', maxWidth: 950 }}>
        You don&rsquo;t need a team.<br />
        <span style={{ color: 'var(--accent-cyan)' }}>You need a good prompt.</span>
      </h2>
      <div className="accentBar" />
      <p className="lead" style={{ maxWidth: 820 }}>
        Everything in this talk runs on one machine, one agent framework, and
        a handful of well-written skill files. The infrastructure is free or
        nearly free &mdash; the real work is describing what you want clearly
        enough that the agent can do it without you.
      </p>
    </div>
  );
}
