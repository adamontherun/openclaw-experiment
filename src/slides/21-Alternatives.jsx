import { Fragment } from '@revealjs/react';

export function AlternativesSlide() {
  return (
    <div>
      <p className="kicker">What Else Could Work</p>
      <h2>Alternatives Worth Exploring</h2>
      <div className="slideGrid3" style={{ marginTop: 28 }}>
        <Fragment animation="fade-up">
          <div className="card">
            <h3 style={{ color: 'var(--accent-orange)' }}>n8n</h3>
            <p>
              Visual workflow builder. Great for deterministic pipelines where
              you don&rsquo;t need LLM reasoning at every step.
            </p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <h3 style={{ color: 'var(--accent-purple)' }}>Claude Agent SDK</h3>
            <p>
              Build custom agents with fine-grained tool control. More
              predictable, better cost management, full observability.
            </p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <h3 style={{ color: 'var(--accent-green)' }}>Nanoclaw, et al</h3>
            <p>
              There are new simpler, safer alternatives to OpenClaw. Lets stay
              on top of them!
            </p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
