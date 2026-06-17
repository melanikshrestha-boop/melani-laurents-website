import type { Metadata } from "next";
import { ResearchList } from "@/components/ResearchList";
import { getResearchPosts } from "@/lib/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Technical memos — RBCivosocial, story research, signal work, and field notes on med-tech building.",
};

export default function ResearchPage() {
  const posts = getResearchPosts();

  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16">
          <h1 className="font-sans text-4xl font-semibold text-foreground md:text-5xl">
            Research
          </h1>
          <p className="mt-4 text-muted">
            Field notes and technical memos — RBCivosocial, story research, signal
            work. Not a personal blog.
          </p>
        </header>
        {posts.length > 0 ? (
          <ResearchList posts={posts} />
        ) : (
          <p className="font-mono-label text-muted-foreground">
            Research memos coming soon.
          </p>
        )}
      </div>
    </div>
  );
}
