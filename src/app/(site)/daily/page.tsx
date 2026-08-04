import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { listConsume } from "@/data/consume-log";
import { listBlogPosts } from "@/data/blog-posts";
import { MEDIUM_LABEL, STANCE_LABEL } from "@/data/consume-types";
import "@/styles/interactive-blog.css";
import "@/styles/daily-pulse.css";

export const metadata: Metadata = {
  title: "Daily",
  description: "Daily — Melani Laurents / Celine Nova.",
};

/**
 * Daily hub — Diary + theses. No marketing lede; edges clean; no hairlines.
 */
export default function DailyPage() {
  const xUrl =
    siteConfig.socialLinks.find((link) => link.id === "x")?.href ??
    "https://x.com/melanilaurents";
  const recent = listConsume(4);
  const posts = listBlogPosts().slice(0, 3);

  return (
    <div className="ib-page ib-page--wide">
      <div id="inputs" />
      <div id="journals" />
      <div id="bookshelf" />

      <header className="ib-head">
        <h1 className="ib-title">Daily</h1>
        <a
          className="ib-head__x"
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          @melanilaurents
        </a>
      </header>

      <p className="ib-nav">
        <Link href="/diary">Diary</Link>
        {" · "}
        <Link href="/blog">Blog</Link>
        {" · "}
        <Link href="/bookshelf">Bookshelf</Link>
      </p>

      <section className="ib-related" aria-label="Diary">
        <ul className="consume-grid">
          {recent.map((e) => (
            <li key={e.id} className="consume-item">
              <div className="consume-item__meta">
                <time dateTime={e.date}>{e.date}</time>
                <span>{MEDIUM_LABEL[e.medium]}</span>
                <span className="ib-stance" style={{ margin: 0 }}>
                  {STANCE_LABEL[e.stance]}
                </span>
              </div>
              <h2 className="consume-item__title">{e.title}</h2>
              <p className="consume-item__take">{e.take}</p>
            </li>
          ))}
        </ul>
      </section>

      {posts.length > 0 ? (
        <section className="ib-related ib-related--tight" aria-label="Theses">
          <ul className="ib-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`}>
                  <span className="ib-list__date">{post.date}</span>
                  <h2 className="ib-list__title">{post.title}</h2>
                  <p className="ib-list__lede">{post.thesis}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="ib-nav ib-nav--foot">
        <Link href="/">← Home</Link>
      </p>
    </div>
  );
}
