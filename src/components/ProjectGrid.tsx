"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

const statusMod: Record<Project["status"], string> = {
  Active: "builds-list__status--active",
  Stealth: "builds-list__status--stealth",
  "Open Source": "builds-list__status--open",
  Research: "builds-list__status--research",
};

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const isLink = Boolean(project.href);

  const body = (
    <>
      <span className="builds-list__index" aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="builds-list__body">
        <div className="builds-list__topline">
          <h2 className="builds-list__name">{project.title}</h2>
          <span className={`builds-list__status ${statusMod[project.status]}`}>
            {project.status}
          </span>
        </div>
        <p className="builds-list__role">{project.role}</p>
        <p className="builds-list__desc">{project.description}</p>
        {project.tags.length > 0 ? (
          <ul className="builds-list__tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        {project.readout ? (
          <p className="builds-list__readout">{project.readout}</p>
        ) : null}
        {isLink ? <span className="builds-list__go">Open ↗</span> : null}
      </div>
    </>
  );

  return (
    <motion.li
      className="builds-list__item"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLink ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="builds-list__card"
        >
          {body}
        </a>
      ) : (
        <div className="builds-list__card builds-list__card--static">{body}</div>
      )}
    </motion.li>
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  // priority first (Scholar = 1), then newer dates
  const sorted = [...projects].sort((a, b) => {
    const pa = a.priority ?? 999;
    const pb = b.priority ?? 999;
    if (pa !== pb) return pa - pb;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <ol className="builds-list">
      {sorted.map((project, i) => (
        <ProjectRow key={project.id} project={project} index={i} />
      ))}
    </ol>
  );
}
