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
 * Not other people’s hearts. Fun, user-controlled carousel.
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
        <header>
          <p className="daily-pulse__kicker">Daily</p>
          <h1 className="daily-pulse__heading">
            What I post. What I love. What stuck.
          </h1>
          <p className="daily-pulse__lede">
            Only my own writing on X — the posts I actually put out into the
            world. Slide through them like the timeline, on your terms. YouTube
            when a thread isn’t enough.
          </p>
        </header>

        <div id="inputs" />
        <div id="journals" />
        <div id="bookshelf" />

        <section
          className="daily-pulse__section"
          aria-labelledby="x-posts-title"
        >
          <div className="daily-pulse__section-head">
            <div>
              <p className="daily-pulse__kicker">X · mine only</p>
              <h2 id="x-posts-title" className="daily-pulse__section-title">
                Posts I wrote
              </h2>
            </div>
            <span className="daily-pulse__count">
              {String(myPosts.length).padStart(2, "0")} posts
            </span>
          </div>
          <p className="daily-pulse__mine-note">
            Reiterated on purpose: this is not a list of other people’s content
            I hearted. It’s the posts I love enough to put my name on.
          </p>

          <XPostCarousel posts={myPosts} />

          <p className="daily-pulse__home" style={{ marginTop: "0.85rem" }}>
            <a href={xUrl} target="_blank" rel="noopener noreferrer">
              Full timeline on X ↗
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
          </div>
        </section>

        <div className="daily-pulse__home">
          <Link href="/">← Back home</Link>
        </div>
      </div>
    </div>
  );
}
