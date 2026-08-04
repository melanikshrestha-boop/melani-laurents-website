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

/** Single post — same Collison #content surface as the index. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const threadId = post.threadId || threadIdForBlog(post.slug);
  const related = consumeForPost(post);
  const initial = await listOpinions(threadId);

  return (
    <div className="pc-blog">
      <div className="pc-blog-content">
        <p className="pc-blog-nav">
          <Link href="/blog">← Blog</Link>
        </p>

        <div className="pc-post pc-post--solo">
          <h2>{post.title}</h2>
          <span className="pc-byline">{post.date}</span>
          {post.body.map((para) => (
            <p key={para.slice(0, 72)}>{para}</p>
          ))}
        </div>

        {post.thesis ? <p className="pc-thesis">{post.thesis}</p> : null}

        {related.length ? (
          <div className="pc-related">
            <h3>Related notes</h3>
            <ul>
              {related.map((c) =>
                c ? (
                  <li key={c.id}>
                    <b>
                      {c.title}
                      {c.by ? ` · ${c.by}` : ""}
                    </b>
                    <br />
                    {c.take}
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        ) : null}

        <div className="pc-thread">
          <OpinionThread
            threadId={threadId}
            prompt={post.thesis}
            initial={initial}
          />
        </div>
      </div>
    </div>
  );
}
