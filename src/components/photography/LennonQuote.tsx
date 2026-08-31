const LENNON_LEAD =
  "I made the decision at sixteen or seventeen that what I did, I wanted everybody to see.";

const LENNON_BODY =
  "I wasn’t going after the aestheticism or the monastery or the lone artist who supposedly doesn’t care what people think about his work. I care a lot whether people hate it or love it, because it’s part of me and it hurts me when they hate it, or hate me, and it’s pleasing when they like it. But, as many public figures have said, “The praise is never enough, and the criticism always bites deep.”";

export function LennonQuote({
  className = "",
  variant = "block",
}: {
  className?: string;
  variant?: "block" | "captions";
}) {
  if (variant === "captions") {
    return (
      <div
        className={`portfolio-art-subs ${className}`.trim()}
        aria-label="John Lennon, 1980"
      >
        <p className="portfolio-art-subs__line">{LENNON_LEAD}</p>
        <p className="portfolio-art-subs__line">{LENNON_BODY}</p>
        <p className="portfolio-art-subs__credit">John Lennon, 1980</p>
      </div>
    );
  }

  return (
    <blockquote className={`portfolio-sketch-quote ${className}`.trim()}>
      <span className="portfolio-sketch-quote__mark" aria-hidden>
        &ldquo;
      </span>
      <div className="portfolio-sketch-quote__copy">
        <p>
          <span className="portfolio-sketch-quote__lead">{LENNON_LEAD}</span>
          <span className="portfolio-sketch-quote__body">{LENNON_BODY}</span>
        </p>
        <footer className="portfolio-sketch-quote__credit">
          <cite>John Lennon, 1980</cite>
        </footer>
      </div>
    </blockquote>
  );
}
