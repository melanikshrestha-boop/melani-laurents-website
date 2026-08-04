import Link from "next/link";
import type { Metadata } from "next";
import { listBlogPosts } from "@/data/blog-posts";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Longer notes — written in public.",
};

/**
 * Exact structure of patrickcollison.com/dispatches:
 * intro italic → posts: h2 link, byline, body paragraphs.
 * CSS mirrors his /static/style.css (#content 500px, Helvetica 13, byline 10px #aaa).
 */
export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="pc-blog">
      <div className="pc-blog-content">
        <p className="pc-blog-intro">
          <i>
            Longer notes — written in public. Under each permanent link: stances
            and disagreement.
          </i>
        </p>

        {posts.map((post) => (
          <div key={post.slug} className="pc-post" id={post.slug}>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <span className="pc-byline">
              {post.date}
              {" · "}
              <Link href={`/blog/${post.slug}`}>Discuss</Link>
            </span>
            {post.body.map((para) => (
              <p key={para.slice(0, 72)}>{para}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
