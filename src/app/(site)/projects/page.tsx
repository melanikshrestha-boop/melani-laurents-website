import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BuildsScholar } from "@/components/BuildsScholar";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "Patented in-ear EEG research and the products, systems, and tools I’m building.",
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

        <BuildsScholar />

        <section className="builds-products" aria-labelledby="builds-products-title">
          <h2 id="builds-products-title" className="builds-products__title">
            Products
          </h2>
          <ProjectGrid projects={stage} />
        </section>
      </div>
    </div>
  );
}
