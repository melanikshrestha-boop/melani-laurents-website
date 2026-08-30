export function LennonQuote({ className = "" }: { className?: string }) {
  return (
    <blockquote className={`portfolio-sketch-quote ${className}`.trim()}>
      <span className="portfolio-sketch-quote__mark" aria-hidden>
        &ldquo;
      </span>
      <div className="portfolio-sketch-quote__copy">
        <p>
          <span className="portfolio-sketch-quote__lead">
            I made the decision at sixteen or seventeen that what I did, I
            wanted everybody to see.
          </span>
          <span className="portfolio-sketch-quote__body">
            I wasn&rsquo;t going after the aestheticism or the monastery or the
            lone artist who supposedly doesn&rsquo;t care what people think
            about his work. I care a lot whether people hate it or love it,
            because it&rsquo;s part of me and it hurts me when they hate it, or
            hate me, and it&rsquo;s pleasing when they like it. But, as many
            public figures have said, &ldquo;The praise is never enough, and the
            criticism always bites deep.&rdquo;
          </span>
        </p>
        <footer className="portfolio-sketch-quote__credit">
          <cite>John Lennon, 1980</cite>
        </footer>
      </div>
    </blockquote>
  );
}
