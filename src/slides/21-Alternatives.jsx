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
            <p>Visual workflow builder. Great for deterministic pipelines where you don&rsquo;t need LLM reasoning at every step.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <h3 style={{ color: 'var(--accent-purple)' }}>Claude Agent SDK</h3>
            <p>Build custom agents with fine-grained tool control. More predictable, better cost management, full observability.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <h3 style={{ color: 'var(--accent-green)' }}>LangGraph + LangFuse</h3>
            <p>Stateful agent graphs with built-in tracing. Better for complex multi-step workflows that need debugging.</p>
          </div>
        </Fragment>
      </div>
      <Fragment animation="fade-up">
        <p style={{ fontSize: '0.58em', marginTop: 32, color: 'rgba(232,234,255,0.75)', lineHeight: 1.5 }}>
          The truth: OpenClaw is <em>great</em> for rapid prototyping and personal use. For production SaaS, you probably want more control over the execution pipeline.
        </p>
      </Fragment>
    </div>
  );
}
