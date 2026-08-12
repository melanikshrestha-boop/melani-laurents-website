import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BuildsScholar } from "@/components/BuildsScholar";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "What I’m shipping — systems, tools, products, and research. Founder builds plus Scholar.",
};

/** Founder products on the page — clean tech portfolio set. */
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
    <div className="builds-surface builds-surface--folio">
      <div className="builds-surface__inner builds-surface__inner--folio">
        <header className="builds-surface__head builds-surface__head--folio">
          <h1 className="builds-surface__title builds-surface__title--folio">
            Builds
          </h1>
        </header>

        <ProjectGrid projects={stage} />

        {/* Scholar profile + patents — LinkedIn-style proof inside Builds */}
        <BuildsScholar />
      </div>
    </div>
  );
}
