import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { BuildsScholar } from "@/components/BuildsScholar";
import { projects } from "@/data/projects";
import { googleScholarUrl } from "@/data/publications";

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

const PRODUCT_GITHUB: Record<string, string> = {
  "wonder-os": "https://github.com/melanikshrestha-boop/wonder",
  lensoss: "https://github.com/melanikshrestha-boop/LensOSS",
  "celine-nova": "https://github.com/melanikshrestha-boop/melani-laurents-website",
  "dream-life": "https://github.com/melanikshrestha-boop",
  shotbyceline: "https://github.com/melanikshrestha-boop/melani-laurents-website",
};

export default function ProjectsPage() {
  const stage = projects
    .filter((p) => STAGE_IDS.has(p.id))
    .map((project) => ({
      ...project,
      href: PRODUCT_GITHUB[project.id] ?? project.href,
      readout: "GitHub",
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
