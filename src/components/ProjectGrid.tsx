"use client";

import type { Project } from "@/data/projects";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const isExternal = Boolean(project.href && !project.href.startsWith("/"));
  const isLink = Boolean(project.href);

  const body = (
    <>
      <span className="bp-row__number" aria-hidden>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="bp-row__title">
        {project.title}
        {isLink ? <span className="bp-row__go" aria-hidden>↗</span> : null}
      </h3>
      {project.description ? (
        <p className="bp-row__desc">{project.description}</p>
      ) : null}
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
          aria-label={`${project.title}: ${project.readout || "open project"}`}
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
      {sorted.map((project, index) => (
        <ProjectRow
          key={project.id}
          project={project}
          index={index}
        />
      ))}
    </ul>
  );
}
