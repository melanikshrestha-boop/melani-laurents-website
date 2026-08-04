import Link from "next/link";
import type { Metadata } from "next";
import { formatBlogArchiveDate, listBlogPosts } from "@/data/blog-posts";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes and essays.",
};

/**
 * Sam Altman archive structure:
 * full-bleed white · blue title links · gray uppercase dates · no side waste.
 * No fake posts. Empty until she writes.
 */
export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="sa-blog">
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
          </ul>
        )}
      </div>
    </div>
  );
}
