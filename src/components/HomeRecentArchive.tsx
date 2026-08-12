import Link from "next/link";
import { getRecentBookshelf } from "@/data/bookshelf";
import { listBlogPosts } from "@/data/blog-posts";
import { projects } from "@/data/projects";
import { siteConfig } from "@/config/site";
import { HomeScrollExperience } from "@/components/HomeScrollExperience";

function formatDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Unique recent titles (bookshelf sometimes logs the same book twice). */
function uniqueShelf(limit: number) {
  const seen = new Set<string>();
  const out: ReturnType<typeof getRecentBookshelf> = [];
  for (const entry of getRecentBookshelf(12)) {
    const key = entry.title.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
    if (out.length >= limit) break;
  }
  return out;
}

/** Real builds only — no pig-latin placeholders. */
function homeBuilds() {
  return [...projects]
    .filter((p) => p.featured && p.id !== "google-scholar")
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .slice(0, 4);
}

/**
 * Home index under the photo — editorial directory, not marketing cards.
 * Blog · Builds · Bookshelf · Art · Podcast. No boxes, no walls of lede copy.
 */
export function HomeRecentArchive() {
  const posts = listBlogPosts().slice(0, 3);
  const builds = homeBuilds();
  const shelf = uniqueShelf(4);

  return (
    <HomeScrollExperience>
      <section className="home-index" aria-label="Index">
        <div className="home-index__inner">
          {/* Blog */}
          <section className="home-index__block">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href="/blog">Blog</Link>
              </h2>
              <Link href="/blog" className="home-index__all">
                all
              </Link>
            </header>
            {posts.length === 0 ? (
              <p className="home-index__empty">Nothing published yet.</p>
            ) : (
              <ul className="home-index__rows">
                {posts.map((post) => (
                  <li key={post.slug} className="home-index__row">
                    <Link href={`/blog/${post.slug}`} className="home-index__primary">
                      {post.title}
                      {post.draft ? (
                        <span className="home-index__badge">Draft</span>
                      ) : null}
                    </Link>
                    <time className="home-index__meta" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Builds */}
          <section className="home-index__block">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href="/projects">Builds</Link>
              </h2>
              <Link href="/projects" className="home-index__all">
                all
              </Link>
            </header>
            <ul className="home-index__rows">
              {builds.map((p) => {
                const href = p.href ?? "/projects";
                const external = href.startsWith("http");
                return (
                  <li key={p.id} className="home-index__row">
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="home-index__primary"
                      >
                        {p.title}
                      </a>
                    ) : (
                      <Link href={href} className="home-index__primary">
                        {p.title}
                      </Link>
                    )}
                    <span className="home-index__meta">
                      {p.readout ?? p.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Bookshelf */}
          <section className="home-index__block">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href="/bookshelf">Bookshelf</Link>
              </h2>
              <Link href="/bookshelf" className="home-index__all">
                all
              </Link>
            </header>
            {shelf.length === 0 ? (
              <p className="home-index__empty">Nothing logged yet.</p>
            ) : (
              <ul className="home-index__rows">
                {shelf.map((entry) => (
                  <li key={entry.id} className="home-index__row">
                    <Link href="/bookshelf" className="home-index__primary">
                      {entry.title}
                    </Link>
                    <time
                      className="home-index__meta"
                      dateTime={entry.loggedAt}
                    >
                      {formatDate(entry.loggedAt)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Art */}
          <section className="home-index__block">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href={siteConfig.photographyPath}>Art</Link>
              </h2>
            </header>
            <ul className="home-index__rows">
              <li className="home-index__row">
                <Link
                  href={siteConfig.photographyPath}
                  className="home-index__primary"
                >
                  Photography
                </Link>
                <span className="home-index__meta">shot by Celine Nova</span>
              </li>
            </ul>
          </section>

          {/* Podcast — one row, no novel */}
          <section className="home-index__block">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href={siteConfig.podcastUrl}>Podcast</Link>
              </h2>
              <span className="home-index__all home-index__all--static">
                {siteConfig.podcastCadence}
              </span>
            </header>
            <ul className="home-index__rows">
              <li className="home-index__row">
                <Link href={siteConfig.podcastUrl} className="home-index__primary">
                  {siteConfig.podcastTitle}
                </Link>
                <span className="home-index__meta">
                  {siteConfig.podcastSlogan}
                </span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="home-index__block home-index__block--last">
            <header className="home-index__head">
              <h2 className="home-index__label">
                <Link href="/contact">Contact</Link>
              </h2>
            </header>
            <ul className="home-index__rows">
              <li className="home-index__row">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="home-index__primary"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </section>
    </HomeScrollExperience>
  );
}
