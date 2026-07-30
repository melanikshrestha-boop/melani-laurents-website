import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getMyXPosts, getYouTubePicks } from "@/data/daily-posts";
import { XPostCarousel } from "@/components/XPostCarousel";

export const metadata: Metadata = {
  title: "Daily",
  description: siteConfig.dailyDescription,
};

/**
 * Daily — my X posts (mine only) as a sliding feed + YouTube.
 * Chrome stays minimal so the posts lead.
 */
export default function DailyPage() {
  const myPosts = getMyXPosts();
  const youtube = getYouTubePicks();
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/MelaniLaurentS";
  const ytUrl =
    youtube[0]?.href ?? "https://www.youtube.com/@ResetYourMind.-fb5nn";

  return (
    <div className="daily-pulse">
      <div className="daily-pulse__inner">
        <header className="daily-pulse__header">
          <h1 className="daily-pulse__title">Daily</h1>
        </header>

        {/* Deep-link anchors from hub (kept for existing routes) */}
        <div id="inputs" />
        <div id="journals" />
        <div id="bookshelf" />

        <section
          className="daily-pulse__section"
          aria-label="Posts on X"
        >
          <XPostCarousel posts={myPosts} />
          <p className="daily-pulse__outlink">
            <a href={xUrl} target="_blank" rel="noopener noreferrer">
              Full timeline on X ↗
            </a>
          </p>
        </section>

        <section className="daily-pulse__section" aria-labelledby="yt-title">
          <h2 id="yt-title" className="daily-pulse__section-label">
            YouTube
          </h2>
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
          </div>
        </section>

        <div className="daily-pulse__home">
          <Link href="/">← Back home</Link>
        </div>
      </div>
    </div>
  );
}
