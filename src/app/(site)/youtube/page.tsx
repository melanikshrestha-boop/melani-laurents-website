import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { erenTabIcons } from "@/lib/eren-tab";

export const metadata: Metadata = {
  title: "YouTube",
  description: siteConfig.youtubeDescription,
  icons: erenTabIcons,
};

const youtubeUrl =
  siteConfig.socialLinks.find((link) => link.id === "youtube")?.href ?? "#";

export default function YouTubePage() {
  return (
    <div className="podcast-index">
      <header className="podcast-index__hero">
        <div className="podcast-index__kicker-row">
          <p className="podcast-index__kicker">YouTube</p>
          <p className="podcast-index__cadence">{siteConfig.youtubeCadence}</p>
        </div>

        <div className="podcast-index__hero-grid">
          <div>
            <h1>{siteConfig.youtubeTitle}</h1>
            <p className="podcast-index__description">
              {siteConfig.youtubeDescription}
            </p>
          </div>
          <aside className="podcast-index__show-note">
            <p>{siteConfig.youtubeAudience}</p>
          </aside>
        </div>
      </header>

      <section className="podcast-index__episodes" aria-labelledby="videos-title">
        <header className="podcast-index__section-header">
          <div>
            <p className="podcast-index__kicker">Long form</p>
            <h2 id="videos-title">Ideas that need more room.</h2>
          </div>
          <span>Occasionally</span>
        </header>

        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="podcast-index__empty-player youtube-index__channel-link"
        >
          <span className="youtube-index__play" aria-hidden>
            ▶
          </span>
          <div>
            <p className="podcast-index__empty-label">Watch on YouTube</p>
            <h3>Thinking out loud, with receipts.</h3>
            <p>
              Videos will connect the books, notes, experiments, art, and ideas
              already living in this archive.
            </p>
          </div>
          <span>Open channel ↗</span>
        </a>
      </section>

      <section className="podcast-index__about">
        <div>
          <p className="podcast-index__kicker">Why it exists</p>
          <h2>The archive comes first.</h2>
        </div>
        <div className="podcast-index__about-copy">
          <p>
            YouTube is the occasional long-form layer of the site, not a posting
            treadmill. When an idea needs voice, context, or demonstration, it
            will live there and point back to the original notes here.
          </p>
        </div>
      </section>
    </div>
  );
}
