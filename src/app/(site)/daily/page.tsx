import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Daily",
  description: siteConfig.dailyDescription,
};

/**
 * Daily — no posts until Melani says they matter.
 * Title + Twitter line only (copy she ordered).
 */
export default function DailyPage() {
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/melanilaurents";

  return (
    <div className="daily-pulse">
      <div className="daily-pulse__inner">
        {/* Deep-link anchors from hub */}
        <div id="inputs" />
        <div id="journals" />
        <div id="bookshelf" />

        <header className="daily-pulse__row">
          <h1 className="daily-pulse__title">Daily</h1>
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="daily-pulse__x"
          >
            I am most active on Twitter
            <span className="daily-pulse__arrow" aria-hidden>
              ↗
            </span>
          </a>
        </header>

        <p className="daily-pulse__home">
          <Link href="/">← Home</Link>
        </p>
      </div>
    </div>
  );
}
