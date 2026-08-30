import Link from "next/link";
import type { Metadata } from "next";
import { formatBlogArchiveDate, listBlogPosts } from "@/data/blog-posts";
import { WATCH_LIST } from "@/data/watch-list";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and essays.",
};

/** A plain document index: title and date only. */
export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="sa-blog sa-blog--index">
      <div className="sa-blog-inner">
        {posts.length === 0 ? (
          <p className="sa-blog-empty">Nothing published yet.</p>
        ) : (
          <ul className="sa-blog-list">
            {posts.map((post) => (
              <li key={post.slug} className="sa-blog-item">
                <h2 className="sa-blog-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="sa-blog-date">
                  <time dateTime={post.date}>
                    {formatBlogArchiveDate(post.date)}
                  </time>
                </p>
              </li>
            ))}
            <li className="sa-blog-item sa-blog-item--watch-head">
              <h2 className="sa-blog-title">Watch List</h2>
              <p className="sa-blog-date">Updating...</p>
            </li>
            {WATCH_LIST.map((title) => (
              <li key={title} className="sa-blog-item">
                <span className="sa-blog-title">{title}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
