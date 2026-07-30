import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ListeningNote } from "@/components/ListeningNote";

export const metadata: Metadata = {
  title: "Daily",
  description: siteConfig.dailyDescription,
};

/**
 * Cleared for rebuild — social posts / feed will land here next.
 * Keep Spotify note at the bottom.
 */
export default function DailyPage() {
  return (
    <div className="daily-index daily-index--cleared">
      <header className="daily-index__masthead">
        <div className="daily-index__kicker-row">
          <p className="daily-index__kicker">Daily</p>
        </div>
        <h1 className="daily-index__heading">Daily</h1>
        <p className="daily-index__cleared-note">
          Social posts and the rest of this surface come next.
        </p>
      </header>

      {/* Anchors from hub nav still resolve */}
      <div id="inputs" />
      <div id="bookshelf" />
      <div id="journals" />

      <ListeningNote context="daily" />

      <div className="daily-index__home-link">
        <Link href="/">← Back home</Link>
      </div>
    </div>
  );
}
