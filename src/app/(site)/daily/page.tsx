import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  getXHeartPicks,
  getYouTubePicks,
  type DailyPost,
} from "@/data/daily-posts";

export const metadata: Metadata = {
  title: "Daily",
  description: siteConfig.dailyDescription,
};

function formatDate(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function kindBadge(post: DailyPost): string {
  if (post.kind === "x-heart") return "♡ Heart pick";
  if (post.kind === "x-note") return "On X";
  if (post.kind === "youtube") return "YouTube";
  return "Journal";
}

function PulseCard({ post }: { post: DailyPost }) {
  return (
    <li>
      <a
        href={post.href}
        target="_blank"
        rel="noopener noreferrer"
        className="daily-pulse__card"
      >
        <div className="daily-pulse__card-meta">
          <span className="daily-pulse__badge">{kindBadge(post)}</span>
          <span>{formatDate(post.date)}</span>
          {post.sourceLabel ? <span>{post.sourceLabel}</span> : null}
        </div>
        <h3 className="daily-pulse__card-title">{post.title}</h3>
        {post.excerpt ? (
          <p className="daily-pulse__card-excerpt">{post.excerpt}</p>
        ) : null}
        <span className="daily-pulse__card-go">Open ↗</span>
      </a>
    </li>
  );
}

/**
 * Daily pulse — X heart picks + YouTube.
 * No Spotify footer on this surface (photo Spotify removed separately).
 */
export default function DailyPage() {
  const hearts = getXHeartPicks();
  const youtube = getYouTubePicks();
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/MelaniShrestha";
  const ytUrl =
    youtube[0]?.href ??
    "https://www.youtube.com/@ResetYourMind.-fb5nn";

  return (
    <div className="daily-pulse">
      <div className="daily-pulse__inner">
        <header>
          <p className="daily-pulse__kicker">Daily</p>
          <h1 className="daily-pulse__heading">
            What I hearted. What I watched. What stuck.
          </h1>
          <p className="daily-pulse__lede">
            Short-form picks from X and longer cuts on YouTube — a living feed of
            signal, not a finished archive.
          </p>
        </header>

        {/* Hub deep-link anchors */}
        <div id="inputs" />
        <div id="journals" />
        <div id="bookshelf" />

        <section
          className="daily-pulse__section"
          aria-labelledby="hearts-title"
        >
          <div className="daily-pulse__section-head">
            <div>
              <p className="daily-pulse__kicker">X</p>
              <h2 id="hearts-title" className="daily-pulse__section-title">
                Heart picks &amp; notes
              </h2>
            </div>
            <span className="daily-pulse__count">
              {String(hearts.length).padStart(2, "0")} items
            </span>
          </div>
          <ul className="daily-pulse__list">
            {hearts.map((post) => (
              <PulseCard key={post.slug} post={post} />
            ))}
          </ul>
          <p className="daily-pulse__home" style={{ marginTop: "0.85rem" }}>
            <a href={xUrl} target="_blank" rel="noopener noreferrer">
              Follow on X ↗
            </a>
          </p>
        </section>

        <section className="daily-pulse__section" aria-labelledby="yt-title">
          <div className="daily-pulse__section-head">
            <div>
              <p className="daily-pulse__kicker">Video</p>
              <h2 id="yt-title" className="daily-pulse__section-title">
                YouTube
              </h2>
            </div>
            <span className="daily-pulse__count">
              {siteConfig.youtubeCadence}
            </span>
          </div>
          <div className="daily-pulse__yt">
            <a
              href={ytUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="daily-pulse__yt-hero"
            >
              <p className="daily-pulse__kicker">{siteConfig.youtubeSlogan}</p>
              <h3 className="daily-pulse__card-title">
                {siteConfig.youtubeTitle}
              </h3>
              <p className="daily-pulse__card-excerpt">
                {siteConfig.youtubeDescription}
              </p>
              <span className="daily-pulse__card-go">Open channel ↗</span>
            </a>
            {youtube.slice(1).map((post) => (
              <a
                key={post.slug}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="daily-pulse__card"
              >
                <h3 className="daily-pulse__card-title">{post.title}</h3>
                {post.excerpt ? (
                  <p className="daily-pulse__card-excerpt">{post.excerpt}</p>
                ) : null}
                <span className="daily-pulse__card-go">Watch ↗</span>
              </a>
            ))}
          </div>
        </section>

        <div className="daily-pulse__home">
          <Link href="/">← Back home</Link>
        </div>
      </div>
    </div>
  );
}
