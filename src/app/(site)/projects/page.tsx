import type { Metadata } from "next";
import Link from "next/link";
import { ProjectGrid } from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Builds",
  description:
    "What I’m shipping — systems, tools, and products. Founder builds, not a portfolio dump.",
};

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status === "Active").length;
  const open = projects.filter((p) => p.status === "Open Source").length;

  return (
    <div className="builds-surface">
      <div className="builds-surface__inner">
        <header>
          <p className="builds-surface__kicker">Builds</p>
          <h1 className="builds-surface__title">What I ship.</h1>
          <p className="builds-surface__lede">
            Products and tools I build for myself and for the company — systems
            thinking, real code, no vapor slides. Longer notes live under{" "}
            <Link href="/daily#journals">Daily</Link>.
          </p>
          <div className="builds-surface__meta" aria-label="Build totals">
            <span>
              <b>{String(projects.length).padStart(2, "0")}</b> projects
            </span>
            <span>
              <b>{String(active).padStart(2, "0")}</b> active
            </span>
            <span>
              <b>{String(open).padStart(2, "0")}</b> open source
            </span>
          </div>
        </header>

        <ProjectGrid projects={projects} />

        <p className="builds-surface__home">
          <Link href="/">← Back home</Link>
        </p>
      </div>
    </div>
  );
}
