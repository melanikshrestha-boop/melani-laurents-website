import type { Metadata } from "next";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "What I’m shipping — systems, tools, and products. Founder builds, not a portfolio dump.",
};

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status === "Active").length;
  const research = projects.filter((p) => p.status === "Research").length;
  const open = projects.filter((p) => p.status === "Open Source").length;

  return (
    <div className="builds-surface">
      <div className="builds-surface__inner">
        <header className="builds-surface__head">
          <h1 className="builds-surface__title">Builds</h1>
          <div className="builds-surface__meta" aria-label="Build totals">
            <span>
              <b>{String(projects.length).padStart(2, "0")}</b> projects
            </span>
            <span>
              <b>{String(active).padStart(2, "0")}</b> active
            </span>
            <span>
              <b>{String(research).padStart(2, "0")}</b> research
            </span>
            <span>
              <b>{String(open).padStart(2, "0")}</b> open source
            </span>
          </div>
        </header>

        <ProjectGrid projects={projects} />
      </div>
    </div>
  );
}
