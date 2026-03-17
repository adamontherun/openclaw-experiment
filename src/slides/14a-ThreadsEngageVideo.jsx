export function ThreadsEngageVideoSlide() {
  return (
    <div className="fullScreenVideoSlide">
      <video
        data-autoplay
        src="/videos/engage.webm"
        muted
        loop
        playsInline
      />
      <div className="videoOverlayBox">
        <h3>Daily Engagement Cycle</h3>
        <p>
          Every day, the agent searches each platform for high-value accounts
          in the volleyball recruiting space &mdash; then <strong>follows</strong> them,{' '}
          <strong>likes</strong> a recent post, and <strong>drops a comment</strong>.
        </p>
      </div>
    </div>
  );
}
