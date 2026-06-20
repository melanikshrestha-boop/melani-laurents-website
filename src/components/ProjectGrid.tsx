"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Project } from "@/data/projects";

const statusClass: Record<Project["status"], string> = {
  Active: "status-active",
  Stealth: "status-stealth",
  "Open Source": "status-open",
};

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const Wrapper = project.href ? "a" : "div";
  const wrapperProps = project.href
    ? { href: project.href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <Wrapper
        {...wrapperProps}
        className="relative block overflow-hidden border-l-2 border-accent/50 py-6 pl-6 pr-4 transition-all hover:border-accent hover:bg-accent-muted/30 hover:pl-8"
      >
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="font-mono-label text-[10px] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="font-sans text-xl font-semibold text-foreground">
            {project.title}
          </h3>
          <span
            className={`rounded-full px-2 py-0.5 font-mono-label text-[10px] ${statusClass[project.status]}`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-1 font-mono-label text-[11px] text-accent">
          {project.role}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {project.description}
        </p>
        {project.readout && (
          <p className="mt-3 font-mono-label text-[10px] text-muted-foreground opacity-60 transition-opacity group-hover:opacity-100">
            {project.readout}
          </p>
        )}
      </Wrapper>
    </motion.div>
  );
}

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const sorted = [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="divide-y divide-border/50">
      {sorted.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
