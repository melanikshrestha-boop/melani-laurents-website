"use client";

import type { Project } from "@/data/projects";

/**
 * Builds list — single-spaced, no dividers, no boxes.
 * Dense tech folio: title · status · one-line desc · stack as plain text.
 */

function ProjectRow({ project }: { project: Project }) {
  const isExternal = Boolean(project.href && !project.href.startsWith("/"));
  const isLink = Boolean(project.href);
  const tags = project.tags.slice(0, 4);
  const meta = [project.readout || project.status, ...tags]
    .filter(Boolean)
    .join(" · ");

  const body = (
    <>
      <div className="bp-row__line">
        <h2 className="bp-row__title">{project.title}</h2>
        {isLink ? (
          <span className="bp-row__go" aria-hidden>
            {isExternal ? "↗" : "→"}
          </span>
        ) : null}
      </div>
      {project.description ? (
        <p className="bp-row__desc">{project.description}</p>
      ) : null}
      {meta ? <p className="bp-row__meta">{meta}</p> : null}
    </>
  );

  return (
    <li className="bp-row">
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
    </li>
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
    <ul className="bp-list" aria-label="Builds">
      {sorted.map((project) => (
        <ProjectRow key={project.id} project={project} />
      ))}
    </ul>
  );
}
