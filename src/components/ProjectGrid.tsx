"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

/** Builds stage — full-width product bands (not blog rows, not small cards). */

const ACCENT: Record<string, string> = {
  "wonder-os": "#2f6b4f",
  lensoss: "#7eb8da",
  "celine-nova": "#c9a962",
  "dream-life": "#c4a0e0",
  shotbyceline: "#e0a878",
  "google-scholar": "#c9a962",
  "niura-ear-eeg": "#7eb8da",
};

function statusLabel(project: Project): string {
  if (project.status === "Active") return "Shipping";
  if (project.status === "Stealth") return "Stealth";
  if (project.status === "Open Source") return "Open source";
  return "Research";
}

function BuildBand({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  const isLink = Boolean(project.href);
  const accent = ACCENT[project.id] ?? "#c9a962";
  const n = String(index + 1).padStart(2, "0");

  const body = (
    <>
      <div className="build-band__rail" style={{ background: accent }} aria-hidden />
      <div className="build-band__inner">
        <span className="build-band__index" aria-hidden>
          {n}
        </span>
        <div className="build-band__main">
          <div className="build-band__topline">
            <h2 className="build-band__title">{project.title}</h2>
            <span className="build-band__status">{statusLabel(project)}</span>
          </div>
          {project.readout ? (
            <p className="build-band__readout">{project.readout}</p>
          ) : null}
          {project.description ? (
            <p className="build-band__desc">{project.description}</p>
          ) : null}
        </div>
        {isLink ? (
          <span className="build-band__go" aria-hidden>
            →
          </span>
        ) : (
          <span className="build-band__go build-band__go--mute" aria-hidden>
            ·
          </span>
        )}
      </div>
    </>
  );

  return (
    <motion.li
      className="build-band__item"
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLink ? (
        <a
          href={project.href}
          target={project.href?.startsWith("/") ? undefined : "_blank"}
          rel={
            project.href?.startsWith("/") ? undefined : "noopener noreferrer"
          }
          className="build-band"
        >
          {body}
        </a>
      ) : (
        <div className="build-band build-band--static">{body}</div>
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
    <ul className="build-band-list" aria-label="Builds">
      {sorted.map((project, i) => (
        <BuildBand key={project.id} project={project} index={i} />
      ))}
    </ul>
  );
}
