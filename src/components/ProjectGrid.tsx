"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

/** MakerMods-style product cards — tag · big title · desc · meta + View → */

const VISUAL: Record<string, string> = {
  "google-scholar": "linear-gradient(145deg, #1a1814 0%, #3d3428 55%, #c9a962 140%)",
  "niura-ear-eeg": "linear-gradient(145deg, #0f1418 0%, #2a4a5c 60%, #7eb8da 130%)",
  "wonder-os": "linear-gradient(145deg, #141210 0%, #2f6b4f 70%, #a8d5c0 140%)",
  "celine-nova": "linear-gradient(145deg, #0a0a0a 0%, #2a2218 50%, #d4af6a 130%)",
  "dream-life": "linear-gradient(145deg, #0c1020 0%, #3a2a5c 55%, #e8a0c0 130%)",
  shotbyceline: "linear-gradient(145deg, #1a1210 0%, #5c4030 55%, #e8c4a0 130%)",
  "build-os": "linear-gradient(145deg, #12141a 0%, #3d5a80 60%, #a0c0e8 130%)",
  "reproducible-research": "linear-gradient(145deg, #141210 0%, #4a4030 60%, #c9a962 130%)",
  "signal-integrity": "linear-gradient(145deg, #0e1214 0%, #2a5058 60%, #80c8c0 130%)",
  rbcivosocial: "linear-gradient(145deg, #141018 0%, #4a3050 60%, #d0a0c8 130%)",
  "celine-agents": "linear-gradient(145deg, #101014 0%, #303848 60%, #a8b8d8 130%)",
  "grok-build-ops": "linear-gradient(145deg, #101010 0%, #404040 55%, #e0e0e0 130%)",
};

function tagFor(project: Project): string {
  if (project.status === "Active") return "ACTIVE · SHIPPING";
  if (project.status === "Stealth") return "STEALTH";
  if (project.status === "Open Source") return "OPEN SOURCE";
  return "RESEARCH";
}

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  const isLink = Boolean(project.href);
  const visual = VISUAL[project.id] || VISUAL["celine-nova"];
  const initial = project.title.trim().charAt(0).toUpperCase() || "C";

  const inner = (
    <>
      <div className="mm-card__photo" style={{ background: visual }} aria-hidden>
        <span className="mm-card__tag">{tagFor(project)}</span>
        <span className="mm-card__corner mm-card__corner--tl" />
        <span className="mm-card__corner mm-card__corner--tr" />
        <span className="mm-card__corner mm-card__corner--bl" />
        <span className="mm-card__corner mm-card__corner--br" />
        <span className="mm-card__mono">{initial}</span>
      </div>
      <div className="mm-card__body">
        {project.role ? (
          <p className="mm-card__eyebrow">{project.role}</p>
        ) : null}
        <h2 className="mm-card__title">{project.title}</h2>
        <p className="mm-card__desc">{project.description}</p>
        <div className="mm-card__meta">
          <span className="mm-card__price">
            {project.readout || project.tags.slice(0, 2).join(" · ") || project.status}
          </span>
          {isLink ? <span className="mm-card__view">View →</span> : <span className="mm-card__view">—</span>}
        </div>
      </div>
    </>
  );

  return (
    <motion.li
      className="mm-card__item"
      initial={reduced ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLink ? (
        <a
          href={project.href}
          target={project.href?.startsWith("/") ? undefined : "_blank"}
          rel={project.href?.startsWith("/") ? undefined : "noopener noreferrer"}
          className="mm-card"
        >
          {inner}
        </a>
      ) : (
        <div className="mm-card mm-card--static">{inner}</div>
      )}
    </motion.li>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const sorted = [...projects].sort((a, b) => {
    const pa = a.priority ?? 999;
    const pb = b.priority ?? 999;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ul className="mm-grid" aria-label="Builds">
      {sorted.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </ul>
  );
}
