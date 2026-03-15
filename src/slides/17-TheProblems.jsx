import { Fragment } from '@revealjs/react';

export function TheProblemsSlide() {
  return (
    <div>
      <p className="kicker">Where It Struggles</p>
      <h2 className="sectionHeader">Current Pain Points</h2>
      <ul>
        <li>
          <Fragment animation="highlight-red">Sessions can get stuck and require recovery</Fragment>
        </li>
        <li>
          <Fragment animation="highlight-red">Quality can drop on cheaper models</Fragment>
        </li>
        <li>
          <Fragment animation="highlight-red">Reliability expectations increase as automations scale</Fragment>
        </li>
      </ul>
    </div>
  );
}
