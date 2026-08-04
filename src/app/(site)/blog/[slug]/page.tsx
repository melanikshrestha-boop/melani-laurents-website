import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  consumeForPost,
  formatBlogArchiveDate,
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

/** Single post — full width body when she publishes. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const threadId = post.threadId || threadIdForBlog(post.slug);
  const related = consumeForPost(post);
  const initial = await listOpinions(threadId);

  return (
    <div className="sa-blog">
      <article className="sa-blog-inner sa-post">
        <p className="sa-blog-nav">
          <Link href="/blog">← Blog</Link>
        </p>

        <h1 className="sa-post-title">{post.title}</h1>
        <p className="sa-blog-date">
          <time dateTime={post.date}>{formatBlogArchiveDate(post.date)}</time>
        </p>

        <div className="sa-post-body">
          {post.body.map((para) => (
            <p key={para.slice(0, 72)}>{para}</p>
          ))}
        </div>

        {related.length ? (
          <section className="sa-post-related" aria-label="Related notes">
            <h2>Related</h2>
            <ul>
              {related.map((c) =>
                c ? (
                  <li key={c.id}>
                    <strong>
                      {c.title}
                      {c.by ? ` · ${c.by}` : ""}
                    </strong>
                    <p>{c.take}</p>
                  </li>
                ) : null,
              )}
            </ul>
          </section>
        ) : null}

        <div className="sa-post-thread">
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
