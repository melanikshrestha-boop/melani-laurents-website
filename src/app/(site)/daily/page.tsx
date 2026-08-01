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
  description:
    "Diary of time spent + interactive essays — what Melani took in, thinks, and opens for debate.",
};

/**
 * Daily hub — Diary + Blog (the interactive core).
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

      <p className="ib-kicker">Public attention</p>
      <h1 className="ib-title">Daily</h1>
      <p className="ib-lede">
        Diary of what I took in, plus essays others can argue with. Most active
        on{" "}
        <a href={xUrl} target="_blank" rel="noopener noreferrer">
          Twitter ↗
        </a>
        — the archive lives here.
      </p>

      <p className="ib-nav" style={{ marginBottom: 36 }}>
        <Link href="/diary">Diary →</Link>
        {" · "}
        <Link href="/blog">Blog →</Link>
        {" · "}
        <Link href="/bookshelf">Bookshelf →</Link>
      </p>

      <section className="ib-related" aria-label="Recent diary">
        <h2>Recent diary</h2>
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
              <h3 className="consume-item__title">{e.title}</h3>
              <p className="consume-item__take">{e.take}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="ib-related" style={{ marginTop: 48 }} aria-label="Open theses">
        <h2>Open theses</h2>
        <ul className="ib-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <span className="ib-list__date">{post.date}</span>
                <h3 className="ib-list__title">{post.title}</h3>
                <p className="ib-list__lede">{post.thesis}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="ib-nav" style={{ marginTop: 40 }}>
        <Link href="/">← Home</Link>
      </p>
    </div>
  );
}
