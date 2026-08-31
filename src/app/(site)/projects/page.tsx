import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BuildsScholar } from "@/components/BuildsScholar";
import { BuildsPresence } from "@/components/BuildsPresence";
import { projects } from "@/data/projects";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Builds",
  description: "Four in-ear EEG patents and selected builds by Melani Shrestha.",
};

const STAGE_IDS = new Set([
  "wonder-os",
  "lensoss",
  "shotbyceline",
]);

const BUILD_PRESENTATION: Record<
  string,
  { title?: string; href?: string; readout: string; description: string }
> = {
  "wonder-os": {
    title: "Wonder for daily agentic control",
    href: "https://github.com/melanikshrestha-boop/wonder",
    readout: "view Wonder",
    description:
      "One place for my books, finances, health, agents, and wardrobe.",
  },
  lensoss: {
    title: "LensOS for smartculling and editing",
    href: "https://github.com/melanikshrestha-boop/LensOSS",
    readout: "view Lens",
    description:
      "A faster photography workflow from import through final delivery.",
  },
  shotbyceline: {
    href: "/photography",
    readout: "view photography",
    description: "My photography portfolio, print collection, and booking space.",
  },
};

export default function ProjectsPage() {
  const stage = projects
    .filter((p) => STAGE_IDS.has(p.id))
    .map((project) => ({
      ...project,
      ...BUILD_PRESENTATION[project.id],
    }));

  return (
    <div className="builds-surface builds-surface--folio">
      <div className="builds-surface__inner builds-surface__inner--folio">
        <header className="builds-surface__head builds-surface__head--folio">
          <div className="builds-surface__heading-copy">
            <p className="builds-surface__eyebrow">Patent Folio</p>
            <h1
              id="builds-patents-title"
              className="builds-surface__title builds-surface__title--folio"
            >
              4 Patents
            </h1>
          </div>
        </header>

        <BuildsScholar />

        <section className="builds-products" aria-labelledby="builds-products-title">
          <h2 id="builds-products-title" className="builds-products__title">
            Builds
          </h2>
          <ProjectGrid projects={stage} />
        </section>

        <BuildsPresence />
      </div>
    </div>
  );
}
