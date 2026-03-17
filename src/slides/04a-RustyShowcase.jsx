const showcases = [
  { img: '/images/rusty-soccer.png', emoji: '⚽', headline: 'Next game? Handled.' },
  { img: '/images/rusty-gym.png', emoji: '💪', headline: 'Gym accountability agent' },
  { img: '/images/rusty-frontdesk.png', emoji: '🏨', headline: 'Building concierge, automated' },
  { img: '/images/rusty-pickup.png', emoji: '🚗', headline: 'Who\'s picking up the kids?' },
  { img: '/images/rusty-sleep.png', emoji: '😴', headline: 'Sleep tracking via chat' },
];

export function RustyShowcaseSlide({ index }) {
  const { img, emoji, headline } = showcases[index];
  return (
    <div className="showcaseSlide">
      <div className="showcaseHeader">
        <p className="kicker">Part 1</p>
        <h1 className="sectionHeader glow">Personal Life</h1>
        <div className="accentBar showcaseAccentBar" />
        <div className="showcaseCaptionCard">
          <div className="showcaseCaptionMeta">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span>{String(showcases.length).padStart(2, '0')}</span>
          </div>
          <div className="showcaseCaption">
            <span className="showcaseCaptionEmoji">{emoji}</span>
            <span>{headline}</span>
          </div>
        </div>
      </div>
      <div className="showcaseStage">
        <div className="showcaseOrb showcaseOrbA" />
        <div className="showcaseOrb showcaseOrbB" />
        <div className="showcasePhoneWrap">
          <img src={img} alt={headline} className="showcasePhone" />
        </div>
      </div>
    </div>
  );
}

export const SHOWCASE_COUNT = showcases.length;
