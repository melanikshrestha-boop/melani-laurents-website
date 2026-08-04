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
    <article className="ib-page ib-dispatches">
      <p className="ib-nav">
        <Link href="/blog">← Blog</Link>
      </p>

      <h1 className="ib-dispatch__title ib-dispatch__title--solo">
        {post.title}
      </h1>
      <p className="ib-dispatch__meta">
        <time dateTime={post.date}>{post.date}</time>
      </p>

      <div className="ib-dispatch__body">
        {post.body.map((para) => (
          <p key={para.slice(0, 48)}>{para}</p>
        ))}
      </div>

      <p className="ib-thesis ib-dispatch__thesis">{post.thesis}</p>

      {related.length ? (
        <section className="ib-related" aria-label="Related notes">
          <h2>Related notes</h2>
          <ul>
            {related.map((c) =>
              c ? (
                <li key={c.id}>
                  <p className="ib-related__title">
                    {c.title}
                    {c.by ? ` · ${c.by}` : ""}
                  </p>
                  <p className="ib-related__take">{c.take}</p>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      {/* Every post: public comments + stances */}
      <OpinionThread
        threadId={threadId}
        prompt={post.thesis}
        initial={initial}
      />
    </article>
  );
}
