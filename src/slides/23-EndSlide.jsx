export function EndSlide() {
  return (
    <div className="centered">
      <h1 className="glow" style={{ fontSize: '2.6em' }}>Thanks!</h1>
      <div className="accentBar" />
      <p style={{ fontSize: '0.7em', color: 'rgba(232,234,255,0.75)', marginTop: 12 }}>
        Adam Smith &nbsp;·&nbsp; <span style={{ color: 'var(--accent-cyan)' }}>volleyintel.com</span>
      </p>
      <p className="mini" style={{ marginTop: 24 }}>
        Built with OpenClaw &nbsp;·&nbsp; Presented with Reveal.js + React
      </p>
    </div>
  );
}
