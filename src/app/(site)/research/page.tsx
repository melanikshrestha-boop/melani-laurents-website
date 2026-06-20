import type { Metadata } from "next";
import Link from "next/link";
import { ResearchList } from "@/components/ResearchList";
import { getResearchPosts } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Medicine, technology, and med-tech projects — updated as I post.",
};

export default function ResearchPage() {
  const posts = getResearchPosts();

  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <p className="font-mono-label text-[10px] tracking-[0.35em] text-amber/70 uppercase">
            Research
          </p>
          <h1 className="mt-4 font-sans text-4xl font-semibold text-foreground md:text-5xl">
            Medicine &amp; technology
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            My most important projects live here — med-tech, signals, systems.
            Updated as I post daily.
          </p>
        </header>

        <section className="mb-16 rounded-sm border border-white/10 bg-white/5 px-6 py-10 text-center">
          <p className="font-mono-label text-[10px] tracking-[0.25em] text-muted uppercase">
            Projects
          </p>
          <p className="mt-3 text-sm text-muted/80">
            Nothing posted yet — I&apos;m filling this in as I publish.
          </p>
        </section>

        {posts.length > 0 && (
          <section className="mb-12">
            <h2 className="font-mono-label mb-6 text-[10px] tracking-[0.25em] text-amber/70 uppercase">
              Field notes
            </h2>
            <ResearchList posts={posts} />
          </section>
        )}

        <Link
          href="/publications"
          className="font-mono-label text-[10px] tracking-[0.2em] text-amber/80 uppercase hover:text-amber"
        >
          Publications →
        </Link>
      </div>
    </div>
  );
}
