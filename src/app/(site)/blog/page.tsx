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
 * Google Docs surface: gray canvas + white letter page, Arial body.
 * Structure still dispatches (full posts, reverse chrono).
 */
export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="ib-docs-canvas">
      <div className="ib-docs-page">
        {posts.map((post) => (
          <article key={post.slug} className="ib-docs-section" id={post.slug}>
            <h1 className="ib-docs-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h1>
            <p className="ib-docs-subtitle">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden> · </span>
              <Link href={`/blog/${post.slug}`}>Discuss</Link>
            </p>
            <div className="ib-docs-body">
              {post.body.map((para) => (
                <p key={para.slice(0, 64)}>{para}</p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
