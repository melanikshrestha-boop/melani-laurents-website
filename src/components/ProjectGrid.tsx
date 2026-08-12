"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

/**
 * Tech portfolio project list — type + stack + link.
 * Inspired by clean engineer sites (clear hierarchy, not blog archive, not void cards).
 */

function ProjectRow({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reduced = useReducedMotion();
  const isExternal = Boolean(project.href && !project.href.startsWith("/"));
  const isLink = Boolean(project.href);
  const tags = project.tags.slice(0, 4);

  const body = (
    <>
      <div className="bp-row__head">
        <h2 className="bp-row__title">
          {project.title}
          {isLink ? (
            <span className="bp-row__arrow" aria-hidden>
              {isExternal ? " ↗" : " →"}
            </span>
          ) : null}
        </h2>
        <span className="bp-row__status">
          {project.readout || project.status}
        </span>
      </div>
      {project.description ? (
        <p className="bp-row__desc">{project.description}</p>
      ) : null}
      {tags.length > 0 ? (
        <ul className="bp-row__stack" aria-label="Stack">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </>
  );

  return (
    <motion.li
      className="bp-row"
      initial={reduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {isLink ? (
        <a
          href={project.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="bp-row__link"
        >
          {body}
        </a>
      ) : (
        <div className="bp-row__link bp-row__link--static">{body}</div>
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
    <ol className="bp-list" aria-label="Builds">
      {sorted.map((project, i) => (
        <ProjectRow key={project.id} project={project} index={i} />
      ))}
    </ol>
  );
}
