export function TitleSlide() {
  return (
    <div className="titleSlide floatIn">
      <div className="titleLayer titleGrid" />
      <div className="titleLayer titleGlow titleGlowA" />
      <div className="titleLayer titleGlow titleGlowB" />
      <div className="titleLayer titleGlow titleGlowC" />
      <div className="titleLayer titleRing titleRingA" />
      <div className="titleLayer titleRing titleRingB" />
      <div className="titleOrbitCard titleOrbitCardA">
        <span className="titleOrbitLabel">Personal life</span>
        <strong>Dad jokes, sports logistics, inbox triage</strong>
      </div>
      <div className="titleOrbitCard titleOrbitCardB">
        <span className="titleOrbitLabel">Micro-SaaS</span>
        <strong>Content engine, daily brief, growth loops</strong>
      </div>
      <div className="titlePanel">
        <p className="titleEyebrow">One agent. Two worlds.</p>
        <h1 className="glow">
          OpenClaw:
          <br />
          Adam + Rusty = ❤️
        </h1>
        <div className="accentBar" />
        <p className="lead titleLead">
          From daily dad jokes to running a micro-SaaS &mdash; how one AI agent
          helps with my personal life and puts the management of my mini app on
          autopilot.
        </p>
      </div>
    </div>
  );
}
