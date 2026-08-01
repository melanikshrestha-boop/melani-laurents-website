import Link from "next/link";
import type { Metadata } from "next";
import { listBlogPosts } from "@/data/blog-posts";
import { STANCE_LABEL } from "@/data/consume-types";
import "@/styles/interactive-blog.css";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Interactive essays — Melani's theses, open for public stances and disagreement.",
};

export default function BlogIndexPage() {
  const posts = listBlogPosts();

  return (
    <div className="ib-page">
      <p className="ib-kicker">Theses · open for disagreement</p>
      <h1 className="ib-title">Blog</h1>
      <p className="ib-lede">
        What I think, written down. Under every post: comments and opinions —
        agree, push back, or build on the thesis.
      </p>

      <ul className="ib-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              <span className="ib-list__date">{post.date}</span>
              <h2 className="ib-list__title">{post.title}</h2>
              <p className="ib-list__lede">
                <span className="ib-stance" style={{ marginRight: 10 }}>
                  {STANCE_LABEL[post.stance]}
                </span>
                {post.lede}
              </p>
              <p className="ib-list__discuss">Open for comments &amp; opinions →</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
