import Link from "next/link";
import { getRecentDailyPosts } from "@/data/daily-posts";
import { googleScholarUrl } from "@/data/publications";
import { getResearchPosts } from "@/lib/research";
import { siteConfig } from "@/config/site";
import { HomeScrollExperience } from "@/components/HomeScrollExperience";
import { NewsletterSignup } from "@/components/NewsletterSignup";

const SLOT_COUNT = 3;

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EmptySlots({ label }: { label: string }) {
  return (
    <ul className="hub-archive__list">
      {Array.from({ length: SLOT_COUNT }, (_, i) => (
        <li key={i} className="hub-archive__item hub-archive__item--empty">
          <span className="hub-archive__empty-label">{label} slot {i + 1}</span>
          <span className="hub-archive__empty-note">coming soon</span>
        </li>
      ))}
    </ul>
  );
}

export function HomeRecentArchive() {
  const daily = getRecentDailyPosts(SLOT_COUNT);
  const research = getResearchPosts().slice(0, SLOT_COUNT);

  return (
    <HomeScrollExperience>
      <section className="hub-archive" aria-label="Most recent">
        <div className="hub-archive__inner">
          <p className="hub-archive__eyebrow">Most recent</p>

          <div className="hub-archive__section hub-archive__section--daily">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">
                <Link href="/daily">Daily</Link>
              </h2>
              <Link href="/daily" className="hub-archive__more">
                all daily →
              </Link>
            </header>
            <Link href="/daily" className="hub-archive__callout-card">
              <p className="hub-archive__callout-body">{siteConfig.dailyDescription}</p>
              <span className="hub-archive__callout-arrow" aria-hidden>
                →
              </span>
            </Link>
            {daily.length > 0 ? (
              <ul className="hub-archive__list">
                {daily.map((post) => (
                  <li key={post.slug} className="hub-archive__item">
                    <time className="hub-archive__date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <Link href={`/daily/${post.slug}`} className="hub-archive__link">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySlots label="Daily" />
            )}
          </div>

          <div className="hub-archive__section">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">
                <Link href="/research">Research</Link>
              </h2>
              <div className="hub-archive__header-links">
                <a
                  href={googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-archive__scholar"
                >
                  Google Scholar ↗
                </a>
                <Link href="/research" className="hub-archive__more">
                  all research →
                </Link>
              </div>
            </header>
            {research.length > 0 ? (
              <ul className="hub-archive__list">
                {research.map((post) => (
                  <li key={post.slug} className="hub-archive__item">
                    <time className="hub-archive__date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <Link
                      href={`/research/${post.slug}`}
                      className="hub-archive__link"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySlots label="Research" />
            )}
          </div>

          <div className="hub-archive__section hub-archive__section--podcast">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">
                Podcast: {siteConfig.podcastTitle}
              </h2>
              <span className="hub-archive__cadence">{siteConfig.podcastCadence}</span>
            </header>
            <a
              href={siteConfig.podcastUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hub-archive__callout-card"
            >
              <p className="hub-archive__callout-body">{siteConfig.podcastDescription}</p>
              <p className="hub-archive__callout-title">{siteConfig.podcastSlogan}</p>
              <span className="hub-archive__callout-arrow" aria-hidden>
                →
              </span>
            </a>
          </div>

          <div className="hub-archive__section hub-archive__section--art">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">Art</h2>
            </header>
            <Link
              href={siteConfig.photographyPath}
              className="hub-archive__art-brand"
            >
              <span className="hub-archive__art-brand-label">Photography</span>
              <span className="hub-archive__art-brand-sep" aria-hidden>
                ·
              </span>
              <span className="hub-archive__art-brand-name">shot by Melani</span>
              <span className="hub-archive__art-brand-arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>

          <div className="hub-archive__section hub-archive__section--newsletter">
            <NewsletterSignup variant="footer" className="hub-archive__newsletter" />
          </div>
        </div>
      </section>
    </HomeScrollExperience>
  );
}
