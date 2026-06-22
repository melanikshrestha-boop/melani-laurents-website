import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.podcastTitle,
  description: siteConfig.podcastDescription,
};

type PodcastEpisode = {
  slug: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  audioUrl: string;
};

// Add Buzzsprout episode audio URLs here as conversations are published.
const episodes: PodcastEpisode[] = [];

const youtubeUrl =
  siteConfig.socialLinks.find((link) => link.id === "youtube")?.href ?? "#";

export default function PodcastPage() {
  return (
    <div className="podcast-index">
      <header className="podcast-index__hero">
        <div className="podcast-index__kicker-row">
          <p className="podcast-index__kicker">Podcast</p>
          <p className="podcast-index__cadence">{siteConfig.podcastCadence}</p>
        </div>

        <div className="podcast-index__hero-grid">
          <div>
            <h1>{siteConfig.podcastTitle}</h1>
            <p className="podcast-index__description">
              {siteConfig.podcastDescription}
            </p>
          </div>
          <aside className="podcast-index__show-note">
            <p>{siteConfig.podcastAudience}</p>
            <span>{siteConfig.podcastSlogan}</span>
          </aside>
        </div>
      </header>

      <section className="podcast-index__episodes" aria-labelledby="episodes-title">
        <header className="podcast-index__section-header">
          <div>
            <p className="podcast-index__kicker">Listen here</p>
            <h2 id="episodes-title">Latest episodes</h2>
          </div>
          <span>{String(episodes.length).padStart(2, "0")} episodes</span>
        </header>

        {episodes.length > 0 ? (
          <ol className="podcast-episode-list">
            {episodes.map((episode, index) => (
              <li key={episode.slug} className="podcast-episode">
                <div className="podcast-episode__meta">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <time dateTime={episode.date}>{episode.date}</time>
                  <span>{episode.duration}</span>
                </div>
                <div className="podcast-episode__content">
                  <h3>{episode.title}</h3>
                  <p>{episode.description}</p>
                  <audio controls preload="metadata" src={episode.audioUrl}>
                    Your browser does not support audio playback.
                  </audio>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="podcast-index__empty-player">
            <button type="button" disabled aria-label="Episode coming soon">
              <span aria-hidden>▶</span>
            </button>
            <div>
              <p className="podcast-index__empty-label">First episode</p>
              <h3>The conversations are being recorded.</h3>
              <p>
                New episodes will play directly on this page as soon as they are
                published.
              </p>
            </div>
            <span>Coming soon</span>
          </div>
        )}
      </section>

      <section className="podcast-index__about">
        <div>
          <p className="podcast-index__kicker">About the show</p>
          <h2>Deep-end conversations for curious people.</h2>
        </div>
        <div className="podcast-index__about-copy">
          <p>
            Neuroscience is the starting point, not the boundary. Each episode
            follows the ideas, work, and experiences that reveal something new
            about being human.
          </p>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            Follow on YouTube ↗
          </a>
        </div>
      </section>
    </div>
  );
}
