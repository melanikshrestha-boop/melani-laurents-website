import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  consumeForPost,
  getBlogPost,
  listBlogPosts,
  threadIdForBlog,
} from "@/data/blog-posts";
import { listOpinions } from "@/lib/discussions";
import { OpinionThread } from "@/components/discussion/OpinionThread";
import "@/styles/interactive-blog.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post" };
  return {
    title: post.title,
    description: post.lede,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const threadId = post.threadId || threadIdForBlog(post.slug);
  const related = consumeForPost(post);
  const initial = await listOpinions(threadId);

  return (
    <div className="ib-docs-canvas">
      <article className="ib-docs-page">
        <p className="ib-docs-nav">
          <Link href="/blog">← Blog</Link>
        </p>

        <h1 className="ib-docs-title">{post.title}</h1>
        <p className="ib-docs-subtitle">
          <time dateTime={post.date}>{post.date}</time>
        </p>

        <div className="ib-docs-body">
          {post.body.map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>

        {post.thesis ? (
          <p className="ib-docs-thesis">{post.thesis}</p>
        ) : null}

        {related.length ? (
          <section className="ib-docs-related" aria-label="Related notes">
            <h2 className="ib-docs-h2">Related notes</h2>
            <ul>
              {related.map((c) =>
                c ? (
                  <li key={c.id}>
                    <p className="ib-docs-related-title">
                      {c.title}
                      {c.by ? ` · ${c.by}` : ""}
                    </p>
                    <p className="ib-docs-related-take">{c.take}</p>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ) : null}

        <div className="ib-docs-thread">
          <OpinionThread
            threadId={threadId}
            prompt={post.thesis}
            initial={initial}
          />
        </div>
      </article>
    </div>
  );
}
