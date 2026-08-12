import Link from "next/link";
import { getRecentBookshelf, BOOKSHELF_KIND_LABEL } from "@/data/bookshelf";
import { googleScholarUrl } from "@/data/publications";
import { siteConfig } from "@/config/site";
import { HomeScrollExperience } from "@/components/HomeScrollExperience";

const SLOT_COUNT = 3;

const GITHUB_URL =
  siteConfig.socialLinks.find((l) => l.id === "github")?.href ??
  "https://github.com/melanikshrestha-boop";

/**
 * Temporary build list: GitHub repos, Pig Latin titles until real names land.
 * Dates keep the same list rhythm as the old research stack.
 */
const BUILD_PLACEHOLDERS = [
  {
    id: "repo-1",
    date: "2026-05-27",
    title: "Onderway — Eposray Ameworkfray",
    href: GITHUB_URL,
  },
  {
    id: "repo-2",
    date: "2026-05-14",
    title: "Eamdray Ifelay — Ystemsay Uildbay",
    href: GITHUB_URL,
  },
  {
    id: "repo-3",
    date: "2026-05-09",
    title: "Elinacay Ovunay — Ersponalpay Iteway",
    href: GITHUB_URL,
  },
] as const;

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
      {Array.from({ length: SLOT_COUNT }, (_, index) => (
        <li key={index} className="hub-archive__item hub-archive__item--empty">
          <span className="hub-archive__empty-label">
            {label} slot {index + 1}
          </span>
          <span className="hub-archive__empty-note">coming soon</span>
        </li>
      ))}
    </ul>
  );
}

/** Home cream archive — previous layout restored. */
export function HomeRecentArchive() {
  const shelfPreview = getRecentBookshelf(SLOT_COUNT);

  return (
    <HomeScrollExperience>
      <section className="hub-archive" aria-label="Most recent">
        <div className="hub-archive__inner">
          <p className="hub-archive__eyebrow">Most recent</p>

          <div className="hub-archive__section hub-archive__section--podcast">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title hub-archive__podcast-heading">
                <span className="hub-archive__podcast-label">Podcast:</span>
                <span className="hub-archive__podcast-name">
                  {siteConfig.podcastTitle}
                </span>
              </h2>
              <span className="hub-archive__cadence">
                {siteConfig.podcastCadence}
              </span>
            </header>
            <Link
              href={siteConfig.podcastUrl}
              className="hub-archive__callout-card hub-archive__callout-card--podcast"
            >
              <p className="hub-archive__callout-body">
                {siteConfig.podcastDescription}
              </p>
              <span className="hub-archive__callout-audience">
                {siteConfig.podcastAudience}
              </span>
              <div className="hub-archive__callout-action">
                <p className="hub-archive__callout-title">
                  {siteConfig.podcastSlogan}
                </p>
                <span className="hub-archive__callout-arrow" aria-hidden>
                  →
                </span>
              </div>
            </Link>
          </div>

          <div className="hub-archive__section hub-archive__section--builds">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">
                <Link href="/projects">Builds</Link>
              </h2>
              <div className="hub-archive__header-links hub-archive__header-links--builds">
                <a
                  href={googleScholarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hub-archive__scholar"
                >
                  Google Scholar ↗
                </a>
                <Link href="/projects" className="hub-archive__more">
                  all builds →
                </Link>
              </div>
            </header>
            <ul className="hub-archive__list">
              {BUILD_PLACEHOLDERS.map((repo) => (
                <li key={repo.id} className="hub-archive__item">
                  <time className="hub-archive__date" dateTime={repo.date}>
                    {formatDate(repo.date)}
                  </time>
                  <a
                    href={repo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hub-archive__link"
                  >
                    {repo.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="hub-archive__section hub-archive__section--bookshelf hub-archive__section--daily">
            <header className="hub-archive__header">
              <h2 className="hub-archive__title">
                <Link href="/bookshelf">Bookshelf</Link>
              </h2>
              <Link href="/bookshelf" className="hub-archive__more">
                all bookshelf →
              </Link>
            </header>
            <Link href="/bookshelf" className="hub-archive__callout-card">
              <p className="hub-archive__callout-body">
                {siteConfig.bookshelfDescription}
              </p>
            </Link>
            {shelfPreview.length > 0 ? (
              <ul className="hub-archive__list">
                {shelfPreview.map((entry) => (
                  <li key={entry.id} className="hub-archive__item">
                    <time
                      className="hub-archive__date"
                      dateTime={entry.loggedAt}
                    >
                      {formatDate(entry.loggedAt)}
                    </time>
                    <Link href="/bookshelf" className="hub-archive__link">
                      <span className="hub-archive__kind-tag">
                        {BOOKSHELF_KIND_LABEL[entry.kind]}
                      </span>{" "}
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptySlots label="Bookshelf" />
            )}
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
              <span className="hub-archive__art-brand-name">
                shot by Celine Nova
              </span>
              <span className="hub-archive__art-brand-arrow" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </HomeScrollExperience>
  );
}
