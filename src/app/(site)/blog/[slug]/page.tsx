import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  formatBlogArchiveDate,
  getBlogPost,
  listBlogPosts,
} from "@/data/blog-posts";
import { erenTabIcons } from "@/lib/eren-tab";
import "@/styles/interactive-blog.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return listBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post", icons: erenTabIcons };
  return {
    title: post.title,
    description: post.lede,
    icons: erenTabIcons,
  };
}

/** A blog post is a document. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="sa-blog">
      <article className="sa-blog-inner sa-post">
        <p className="sa-blog-nav">
          <Link href="/blog">Blog</Link>
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
      </article>
    </div>
  );
}
