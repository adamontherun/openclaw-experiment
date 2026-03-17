export function KidsSportsSlide() {
  return (
    <div>
      <p className="kicker">Family Logistics</p>
      <h2>Kids Sports &amp; Life Ops</h2>
      <div className="slideGrid3">
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Soccer Schedule</h3>
          <p>Queries the league website for the next game &mdash; field, opponent, and kickoff time. No more digging through group chats.</p>
          <p style={{ marginTop: 8, fontSize: '1.4em' }}>⚽</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Volleyball TeamSnap</h3>
          <p>Browser automation pulls the team schedule, roster, and parent contacts directly from TeamSnap.</p>
          <p style={{ marginTop: 8, fontSize: '1.4em' }}>🏐</p>
        </div>
        <div className="card">
          <h3 style={{ color: 'var(--accent-cyan)' }}>Life Ops Indexer</h3>
          <p>Ingests Gmail, Calendar, and iMessages. Extracts structured facts with LLM. Semantic search across all personal comms.</p>
          <p style={{ marginTop: 8, fontSize: '1.4em' }}>🗂️</p>
        </div>
      </div>
      <p className="mini" style={{ marginTop: 24 }}>&ldquo;When&rsquo;s the next game?&rdquo; &mdash; answered in seconds from structured data, not a group chat scroll.</p>
    </div>
  );
}
