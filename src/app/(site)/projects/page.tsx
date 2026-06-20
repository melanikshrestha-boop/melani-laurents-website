import type { Metadata } from "next";
import Link from "next/link";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Builds and tools — what I'm shipping in med-tech and systems.",
};

export default function ProjectsPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <header className="mb-16">
          <h1 className="font-sans text-4xl font-semibold text-foreground md:text-5xl">
            Projects
          </h1>
          <p className="mt-4 max-w-xl text-muted">
            Things I build and ship. Research memos — including RBCivosocial and
            story research — live under{" "}
            <Link href="/research" className="text-accent underline underline-offset-2">
              Research
            </Link>
            .
          </p>
        </header>
        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
