import { Fragment } from '@revealjs/react';

export function AlternativesSlide() {
  return (
    <div>
      <p className="kicker">Section 5</p>
      <h2>Alternative Approaches</h2>
      <div className="slideGrid3">
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric" style={{ fontSize: '1.4em' }}>n8n</p>
            <h3>Visual Workflows</h3>
            <p>Drag-and-drop orchestration with built-in integrations and self-hosting.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric" style={{ fontSize: '1.4em' }}>Langfuse</p>
            <h3>Observability</h3>
            <p>Tracing, evaluation, and monitoring for agent-based systems.</p>
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <div className="card">
            <p className="metric" style={{ fontSize: '1.4em' }}>Agent SDK</p>
            <h3>Claude Runtime</h3>
            <p>Tight runtime control with structured tool use and guardrails.</p>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
