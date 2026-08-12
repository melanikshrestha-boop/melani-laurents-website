import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";
import { googleScholarUrl } from "@/data/publications";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "What I’m shipping — systems, tools, and products. Founder builds, not a portfolio dump.",
};

/** Founder products on stage — not a research résumé dump. */
const STAGE_IDS = new Set([
  "wonder-os",
  "lensoss",
  "celine-nova",
  "dream-life",
  "shotbyceline",
]);

export default function ProjectsPage() {
  const stage = projects.filter((p) => STAGE_IDS.has(p.id));

  return (
    <div className="builds-surface builds-surface--stage">
      <div className="builds-surface__inner builds-surface__inner--stage">
        <header className="builds-surface__head builds-surface__head--stage">
          <p className="builds-surface__kicker builds-surface__kicker--on">
            Shipping
          </p>
          <h1 className="builds-surface__title builds-surface__title--stage">
            Builds
          </h1>
        </header>

        <ProjectGrid projects={stage} />

        <footer className="builds-surface__foot">
          <a
            href={googleScholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="builds-surface__scholar"
          >
            Research & patents · Google Scholar ↗
          </a>
        </footer>
      </div>
    </div>
  );
}
