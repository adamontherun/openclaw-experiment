import { Fragment } from '@revealjs/react';

export function KidsSportsSlide() {
  return (
    <div>
      <p className="kicker">Family Logistics</p>
      <h2>Kids Sports &amp; Life Ops</h2>
      <div className="slideGrid3">
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Soccer Schedule</h3>
          <p>Alex&rsquo;s Inter Ohana CF &mdash; 14B Blanco. Script queries Oahu League for next game, field, opponent, time.</p>
          <Fragment animation="fade-up">
            <p style={{ marginTop: 8 }}><code style={{ color: 'var(--accent-purple)', fontSize: '0.85em' }}>alex_soccer.py next</code></p>
          </Fragment>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Volleyball TeamSnap</h3>
          <p>SASVBC B 12 JON &mdash; browser automation pulls schedule, roster, and parent contacts from TeamSnap.</p>
          <Fragment animation="fade-up">
            <p style={{ marginTop: 8 }}><code style={{ color: 'var(--accent-purple)', fontSize: '0.85em' }}>profile=&quot;openclaw&quot;</code></p>
          </Fragment>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Life Ops Indexer</h3>
          <p>Ingests Gmail, Calendar, and iMessages. Extracts structured facts with LLM. Semantic search across all personal comms.</p>
          <Fragment animation="fade-up">
            <p style={{ marginTop: 8 }}><code style={{ color: 'var(--accent-purple)', fontSize: '0.85em' }}>life_ops.py search --query &quot;...&quot;</code></p>
          </Fragment>
        </div>
      </div>
      <Fragment animation="fade-up">
        <p className="mini" style={{ marginTop: 24 }}>&ldquo;When&rsquo;s Alex&rsquo;s next game?&rdquo; &mdash; answered in seconds from structured data, not a group chat scroll.</p>
      </Fragment>
    </div>
  );
}
