import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  consumeForPost,
  getBlogPost,
  listBlogPosts,
  threadIdForBlog,
} from "@/data/blog-posts";
import { STANCE_LABEL } from "@/data/consume-types";
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
    <article className="ib-page">
      <p className="ib-nav">
        <Link href="/blog">← Blog</Link>
      </p>

      <p className="ib-kicker">{post.date}</p>
      <h1 className="ib-title">{post.title}</h1>
      <p className="ib-stance">{STANCE_LABEL[post.stance]}</p>
      <p className="ib-thesis">{post.thesis}</p>

      <div className="ib-body">
        {post.body.map((para) => (
          <p key={para.slice(0, 48)}>{para}</p>
        ))}
      </div>

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
