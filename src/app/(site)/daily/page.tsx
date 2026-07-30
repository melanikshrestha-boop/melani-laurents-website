import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getMyXPosts } from "@/data/daily-posts";
import { XPostCarousel } from "@/components/XPostCarousel";

export const metadata: Metadata = {
  title: "Daily",
  description: siteConfig.dailyDescription,
};

/**
 * Daily — posts first. No ledes, slogans, or meta notes unless Melani asks.
 */
export default function DailyPage() {
  const myPosts = getMyXPosts();
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/MelaniLaurentS";
  const ytUrl = "https://www.youtube.com/@ResetYourMind.-fb5nn";

  return (
    <div className="daily-pulse">
      <div className="daily-pulse__inner">
        <header className="daily-pulse__header">
          <h1 className="daily-pulse__title">Daily</h1>
        </header>

        {/* Deep-link anchors from hub */}
        <div id="inputs" />
        <div id="journals" />
        <div id="bookshelf" />

        <section className="daily-pulse__section" aria-label="X">
          <XPostCarousel posts={myPosts} />
          <p className="daily-pulse__outlink">
            <a href={xUrl} target="_blank" rel="noopener noreferrer">
              X ↗
            </a>
          </p>
        </section>

        <section className="daily-pulse__section" aria-label="YouTube">
          <p className="daily-pulse__outlink">
            <a href={ytUrl} target="_blank" rel="noopener noreferrer">
              YouTube ↗
            </a>
          </p>
        </section>

        <div className="daily-pulse__home">
          <Link href="/">← Home</Link>
        </div>
      </div>
    </div>
  );
}
