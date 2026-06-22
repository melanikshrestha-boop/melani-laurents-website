import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ReadingProgress } from "@/components/ReadingProgress";
import { mdxComponents } from "@/components/mdx-components";
import { getResearchPost, getResearchSlugs } from "@/lib/research";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getResearchSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getResearchPost(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function ResearchPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getResearchPost(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <>
      <ReadingProgress />
      <article className="research-article px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/research"
            className="font-mono-label text-muted-foreground hover:text-accent transition-colors"
          >
            ← Research
          </Link>

          <header className="mt-8 mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono-label text-accent">Research</span>
              <span className="font-mono-label text-muted-foreground">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="font-mono-label text-muted-foreground">
                {post.readingTime}
              </span>
            </div>
            <h1 className="font-display text-3xl text-foreground md:text-4xl leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-muted">{post.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border px-2 py-0.5 font-mono-label text-[10px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose-research">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>
        </div>
      </article>
    </>
  );
}
