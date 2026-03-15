import { Fragment } from '@revealjs/react';

export function HookSlide() {
  return (
    <div className="centered">
      <h2 className="r-fit-text glow" style={{ fontWeight: 900 }}>
        What if your AI assistant just&hellip; handled it?
      </h2>
      <Fragment animation="fade-up">
        <p className="lead" style={{ marginTop: 24, textAlign: 'center' }}>
          OpenClaw became that system for me.
        </p>
      </Fragment>
    </div>
  );
}
