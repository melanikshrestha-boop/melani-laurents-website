import Link from "next/link";
import { Hero } from "@/components/Hero";
import { FadeInView } from "@/components/FadeInView";
import { ProjectGrid } from "@/components/ProjectGrid";
import { ResearchList } from "@/components/ResearchList";
import { SocialIcons } from "@/components/SocialIcons";
import { projects } from "@/data/projects";
import { getResearchPosts } from "@/lib/research";

export default function Home() {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const latestResearch = getResearchPosts().slice(0, 3);

  return (
    <>
      <Hero />

      <section className="px-6 py-24">
        <FadeInView className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                Selected builds
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                Things I&apos;m shipping — not the research memos, those live
                separately.
              </p>
            </div>
            <Link
              href="/projects"
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              All projects →
            </Link>
          </div>
          <ProjectGrid projects={featuredProjects} />
        </FadeInView>
      </section>

      <section className="border-t border-border/50 px-6 py-24">
        <FadeInView className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-sans text-2xl font-semibold text-foreground">
                Research
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted">
                RBCivosocial, story research, signal work — technical field
                notes.
              </p>
            </div>
            <Link
              href="/research"
              className="text-sm text-accent hover:underline underline-offset-4"
            >
              All research →
            </Link>
          </div>
          <ResearchList posts={latestResearch} />
        </FadeInView>
      </section>

      <section className="border-t border-border/50 px-6 py-16">
        <FadeInView className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-sans text-sm font-medium text-foreground">
              Also making content
            </p>
            <p className="mt-1 text-sm text-muted">
              Follow along on social — I post research, builds, and behind the
              scenes.
            </p>
          </div>
          <SocialIcons />
        </FadeInView>
      </section>
    </>
  );
}
