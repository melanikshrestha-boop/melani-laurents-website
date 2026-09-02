import Link from "next/link";
import type { Metadata } from "next";
import { listConsume } from "@/data/consume-log";
import { erenTabIcons } from "@/lib/eren-tab";
import { MEDIUM_LABEL, STANCE_LABEL } from "@/data/consume-types";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Diary",
  description:
    "A private-public diary of time spent — what Melani took in, what she thinks, why it mattered.",
  icons: erenTabIcons,
};

export default function DiaryPage() {
  const entries = listConsume();

  return (
    <div className="ib-page ib-page--wide">
      <p className="ib-nav">
        <Link href="/">← Home</Link>
        {" · "}
        <Link href="/blog">Blog</Link>
      </p>
      <p className="ib-kicker">A log of time spent</p>
      <h1 className="ib-title">Diary</h1>
      <p className="ib-lede">
        What I took in, what I think, why it cost me an hour. Homage to the days
        — not a feed.
      </p>

      <ul className="consume-grid">
        {entries.map((e) => (
          <li key={e.id} className="consume-item">
            <div className="consume-item__meta">
              <time dateTime={e.date}>{e.date}</time>
              <span>·</span>
              <span>{MEDIUM_LABEL[e.medium].toLowerCase()}</span>
              <span>·</span>
              <span className="ib-stance">{STANCE_LABEL[e.stance].toLowerCase()}</span>
            </div>
            <h2 className="consume-item__title">
              {e.title}
              {e.by ? (
                <span
                  style={{
                    color: "var(--notes-soft, rgba(244,241,234,0.42))",
                    fontWeight: 400,
                  }}
                >
                  {" "}
                  · {e.by}
                </span>
              ) : null}
            </h2>
            <p className="consume-item__take">{e.take}</p>
            {e.why ? <p className="consume-item__why">{e.why}</p> : null}
            {e.blogSlug ? (
              <Link className="consume-item__link" href={`/blog/${e.blogSlug}`}>
                open discussion
              </Link>
            ) : null}
            {e.href && e.href.startsWith("http") ? (
              <a
                className="consume-item__link"
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: e.blogSlug ? 16 : 0 }}
              >
                source
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
