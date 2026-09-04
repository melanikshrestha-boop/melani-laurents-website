import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BuildsScholar } from "@/components/BuildsScholar";
import { BuildsGithub } from "@/components/BuildsGithub";
import { BuildsDesigns } from "@/components/BuildsDesigns";
import { projects } from "@/data/projects";
import { googleScholarUrl } from "@/data/publications";
import { erenTabIcons } from "@/lib/eren-tab";

export const metadata: Metadata = {
  title: "Builds",
  description: "Four in-ear EEG patents and selected builds by Melani Shrestha.",
  icons: erenTabIcons,
};

const STAGE_IDS = new Set(["wonder-os", "lensoss"]);

const BUILD_PRESENTATION: Record<
  string,
  {
    title?: string;
    href?: string;
    github?: string;
    readout: string;
    description: string;
  }
> = {
  "wonder-os": {
    title: "01. Wonder",
    href: "https://github.com/melanikshrestha-boop/wonder",
    readout: "view Wonder",
    description:
      "One place for my books, finances, health, agents, and wardrobe.",
  },
  lensoss: {
    title: "LensLab",
    href: "https://lenslab.dev",
    github: "https://github.com/melanikshrestha-boop/LensOSS",
    readout: "GitHub",
    description:
      "sports photographers workflow system",
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
          <a
            href={googleScholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="builds-surface__scholar"
          >
            Google Scholar ↗
          </a>
        </header>

        <BuildsScholar />

        <BuildsGithub />

        <section className="builds-products" aria-label="Selected work">
          <ProjectGrid projects={stage} />
        </section>

        <section className="builds-designs" aria-labelledby="builds-designs-title">
          <h2 id="builds-designs-title" className="builds-designs__title">
            Designs
          </h2>
          <p className="builds-designs__note">
            P.S. I designed melanilaurents.com (my personal website) from
            scratch using TypeScript, React, HTML, and CSS.
          </p>
          <BuildsDesigns />
        </section>
      </div>
    </div>
  );
}
