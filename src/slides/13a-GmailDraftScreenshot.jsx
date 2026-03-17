const base = import.meta.env.BASE_URL;

export function GmailDraftScreenshotSlide() {
  return (
    <div className="fullScreenImageSlide">
      <img
        src={`${base}images/gmail-draft-approval.png`}
        alt="Gmail draft awaiting approval"
      />
    </div>
  );
}
