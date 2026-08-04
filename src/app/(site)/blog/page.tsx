import Link from "next/link";
import type { Metadata } from "next";
import { listBlogPosts } from "@/data/blog-posts";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Longer notes and essays — written in public, open to disagreement.",
};

/**
 * Patrick Collison /dispatches pattern:
 * continuous reverse-chron scroll, title → date meta → full body inline.
 * Permalinks keep /blog/[slug] for discussion threads.
 */
export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="ib-page ib-dispatches">
      <p className="ib-dispatch-intro">
        Longer notes — written in public. Under each permanent link: stances and
        disagreement.
      </p>

      {posts.map((post) => (
        <article key={post.slug} className="ib-dispatch" id={post.slug}>
          <h2 className="ib-dispatch__title">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="ib-dispatch__meta">
            <time dateTime={post.date}>{post.date}</time>
            <span className="ib-dispatch__meta-sep" aria-hidden>
              ·
            </span>
            <Link href={`/blog/${post.slug}`}>Discuss</Link>
          </p>
          <div className="ib-dispatch__body">
            {post.body.map((para) => (
              <p key={para.slice(0, 64)}>{para}</p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
