import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Daily",
  description: "Daily posts — art, writing, and notes. Updated as I publish.",
};

export default function DailyPage() {
  return (
    <div className="daily-page">
      <div className="daily-page__inner">
        <p className="daily-page__eyebrow">Daily</p>
        <h1 className="daily-page__title">Posting daily soon</h1>
        <p className="daily-callout">{siteConfig.dailyDescription}</p>
        <div className="daily-page__signup">
          <NewsletterSignup />
        </div>
        <Link href="/" className="daily-page__back">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
