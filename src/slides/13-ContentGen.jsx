import { Fragment } from '@revealjs/react';

export function ContentGenSlide() {
  return (
    <div>
      <p className="kicker">Daily Automation</p>
      <h2 className="sectionHeader">Content Generation Pipeline</h2>
      <ul>
        <li>
          <Fragment animation="fade-up">Generate one post idea grounded in current signals</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Create supporting visual content</Fragment>
        </li>
        <li>
          <Fragment animation="fade-up">Publish on schedule automatically</Fragment>
        </li>
      </ul>
    </div>
  );
}
