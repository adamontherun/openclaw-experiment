import { Fragment } from '@revealjs/react';

export function AlternativesSlide() {
  return (
    <div>
      <p className="kicker">Section 5</p>
      <h2 className="sectionHeader">Alternative Paths</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">n8n for visual workflow orchestration</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Langfuse + agent tooling for observability and control</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Claude Agent SDK style architecture for tighter runtime behavior</Fragment>
        </li>
      </ul>
    </div>
  );
}
