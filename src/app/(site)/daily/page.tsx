import Link from "next/link";
import type { Metadata } from "next";
import { getDailyPosts } from "@/data/daily-posts";
import { siteConfig } from "@/config/site";
import { ListeningNote } from "@/components/ListeningNote";
import { XRecentPosts } from "@/components/XRecentPosts";

export const metadata: Metadata = {
  title: "Daily",
  description:
    "Short notes on X, weekly reflection essays, and practical study guides built for real-world application.",
};

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DailyPage() {
  const posts = getDailyPosts();
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/MelaniShrestha";

  return (
    <div className="daily-index">
      <header className="daily-index__masthead">
        <div className="daily-index__kicker-row">
          <p className="daily-index__kicker">Daily</p>
          <p className="daily-index__edition">Library of myself · ongoing</p>
        </div>

        <div className="daily-index__title-row">
          <h1 className="daily-index__heading">
            A running record of what changed my mind.
          </h1>
          <a
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="daily-index__x-link"
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path
                fill="currentColor"
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              />
            </svg>
            <span>Most of it on X</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
      </header>

      <XRecentPosts />

      <section className="daily-index__journal-map" aria-labelledby="guides-title">
        <div className="daily-index__journal-intro">
          <p className="daily-index__kicker">Study guides</p>
          <h2 id="guides-title">What school forgot to make useful.</h2>
          <p>
            Application-first guides for understanding the material, using it
            in the real world, and actually remembering it. Paid library coming
            soon.
          </p>
        </div>

        <div className="daily-index__shelves">
          <article className="daily-shelf">
            <span>01 · PAID</span>
            <h3>Neuroscience</h3>
            <p>
              What the textbook says, what actually happens, and why it matters.
            </p>
          </article>
          <article className="daily-shelf">
            <span>02 · PAID</span>
            <h3>Research</h3>
            <p>
              How to read papers, design experiments, and think past the jargon.
            </p>
          </article>
          <article className="daily-shelf">
            <span>03 · PAID</span>
            <h3>Biotech</h3>
            <p>
              From mechanism to product: how science becomes something people use.
            </p>
          </article>
        </div>
      </section>

      <section id="journals" className="daily-index__journal-section">
        <header className="daily-index__section-header">
          <div>
            <p className="daily-index__kicker">Weekly</p>
            <h2 className="daily-index__section-title">Reflection essays</h2>
          </div>
          <span className="daily-index__count">
            {String(posts.length).padStart(2, "0")} essays
          </span>
        </header>

        {posts.length > 0 ? (
          <ol className="daily-entry-list">
            {posts.map((post, index) => {
              const href = post.href ?? `/daily/${post.slug}`;
              const external = post.source === "x";

              return (
                <li key={post.slug}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="daily-entry"
                  >
                    <span className="daily-entry__index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="daily-entry__content">
                      <div className="daily-entry__meta">
                        <time dateTime={post.date}>{formatDate(post.date)}</time>
                        <span>
                          {post.source === "x" ? "X note" : "Reflection"}
                        </span>
                      </div>
                      <h3>{post.title}</h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                    </div>
                    <span className="daily-entry__arrow" aria-hidden>
                      {external ? "↗" : "→"}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        ) : null}
      </section>

      <ListeningNote context="daily" />

      <div className="daily-index__home-link">
        <Link href="/">← Back home</Link>
      </div>
    </div>
  );
}
