import { Fragment } from '@revealjs/react';

const base = import.meta.env.BASE_URL;

const jokeCards = [
  {
    label: 'Wordplay',
    detail: 'tiny roast',
    className: 'left',
    accent: 'cyan',
    intro: 'Today I saw a dwarf climbing down a prison wall.',
    bridge: 'I thought to myself...',
    punchline: "that's a little condescending!",
    reaction: '🤣',
    signoff: 'Love you, Heather!',
    signoffEmoji: '❤️',
    signature: 'Adam & Rusty',
  },
  {
    label: 'Classic dad joke',
    detail: 'cheese level 11/10',
    className: 'center',
    accent: 'purple',
    intro: 'Good morning, beautiful! 🌅',
    bridge: 'Why did the sea monster eat 5 ships carrying potatoes?',
    punchline: 'Because no one can just eat one potato ship!',
    reaction: '😁',
    signoff: 'Love you!',
    signoffEmoji: '💕',
    signature: 'Adam & Rusty',
  },
  {
    label: 'Pi Day special',
    detail: 'full forehead slap',
    className: 'right',
    accent: 'orange',
    intro: 'Good morning, Heather! 🥧',
    bridge: 'What happens if you stick the number 3.14159 inside of an onion?',
    punchline: 'You get an opinion!',
    reaction: '🦀',
    signoff: 'Happy Pi Day! Love, Adam & Rusty',
    signoffEmoji: '🦀',
    signature: null,
  },
];

function HeatherJokeCard({ joke }) {
  return (
    <article className={`heatherJokeCard ${joke.className}`}>
      <div className="heatherJokeCardTop">
        <span className={`heatherJokePill ${joke.accent}`}>{joke.label}</span>
        <span className="heatherJokeCardMeta">{joke.detail}</span>
      </div>
      <div className="heatherJokePhone">
        <div className="heatherJokePhoneBar">
          <div className="heatherJokePhoneDots">
            <span />
            <span />
            <span />
          </div>
          <span className="heatherJokePhoneTitle">iMessage</span>
        </div>
        <div className="heatherJokeBubble">
          <p>{joke.intro}</p>
          <p>{joke.bridge}</p>
          <p className="heatherJokePunchline">
            {joke.punchline} <span aria-hidden="true">{joke.reaction}</span>
          </p>
          <p className="heatherJokeSignoff">
            {joke.signoff} <span aria-hidden="true">{joke.signoffEmoji}</span>
          </p>
          {joke.signature ? (
            <p className="heatherJokeSignature">- {joke.signature}</p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function HeatherJokeSlide() {
  return (
    <div className="splitSlide" style={{ gridTemplateColumns: '0.8fr 1.2fr' }}>
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 6,
          }}>
          <span className="skillBadge">skills/heather-morning-joke</span>
          <span className="deliveryTag imessage">iMessage</span>
        </div>
        <h2>Morning Joke for Heather</h2>
        <p
          style={{
            fontSize: '0.54em',
            color: 'rgba(232,234,255,0.72)',
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
          Every day at <strong style={{ color: '#fff' }}>9:00 AM</strong>,
          OpenClaw sources a fresh dad joke from Reddit, adapts it for Heather,
          and delivers it via iMessage &mdash; signed from Adam &amp; Rusty.
        </p>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '92vh',
          padding: '12px 0',
        }}>
        <img
          src={`${base}images/joke-placeholder.png`}
          alt="iMessage joke screenshot"
          style={{
            width: '100%',
            maxWidth: 760,
            maxHeight: '88vh',
            objectFit: 'contain',
            borderRadius: 24,
          }}
        />
      </div>
    </div>
  );
}

export function HeatherJokeExamplesSlide() {
  return (
    <div className="heatherJokeShowcase">
      <div>
        <h2>The goods</h2>
        <p className="kicker" style={{ maxWidth: 980 }}>
          The format shifts every day, but the vibe stays the same: sweet
          opener, aggressive dad-energy, and a signoff that lands like a tiny
          daily love note.
        </p>
      </div>
      <div className="heatherJokeDeck">
        <Fragment animation="fade-up">
          <HeatherJokeCard joke={jokeCards[0]} />
        </Fragment>
        <Fragment animation="fade-in">
          <div className="heatherJokeDivider laugh" aria-hidden="true">
            🤣
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <HeatherJokeCard joke={jokeCards[1]} />
        </Fragment>
        <Fragment animation="fade-in">
          <div className="heatherJokeDivider cheese" aria-hidden="true">
            🧀
          </div>
        </Fragment>
        <Fragment animation="fade-up">
          <HeatherJokeCard joke={jokeCards[2]} />
        </Fragment>
      </div>
      <Fragment animation="fade-in">
        <div className="heatherJokeSticker" aria-hidden="true">
          🤦
        </div>
      </Fragment>
    </div>
  );
}
