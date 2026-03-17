import { Fragment } from '@revealjs/react';

export function HookSlide() {
  return (
    <div className="centered">
      <h2 className="punch" style={{ fontSize: '1.9em' }}>
        What if an AI agent could&hellip;
      </h2>
      <div style={{ marginTop: 36, textAlign: 'left', maxWidth: 800 }}>
        <Fragment animation="fade-up">
          <p style={{ fontSize: '0.72em', marginBottom: 18 }}>
            Text your wife a fresh dad joke every morning
          </p>
        </Fragment>
        <Fragment animation="fade-up">
          <p style={{ fontSize: '0.72em', marginBottom: 18 }}>
            Compile your daily news brief and send it to Telegram
          </p>
        </Fragment>
        <Fragment animation="fade-up">
          <p style={{ fontSize: '0.72em', marginBottom: 18 }}>
            Run your app&rsquo;s marketing and customer support
          </p>
        </Fragment>
        <Fragment animation="fade-up">
          <p style={{ fontSize: '0.72em', marginBottom: 18 }}>
            Triage your inbox, draft replies, and wait for your approval
          </p>
        </Fragment>
        <Fragment animation="fade-up">
          <p
            style={{
              fontSize: '0.72em',
              color: 'var(--accent-cyan)',
              fontWeight: 700,
            }}>
            All while you sleep?
          </p>
        </Fragment>
      </div>
    </div>
  );
}
