export type ProjectStatus = "Active" | "Stealth" | "Open Source";

export interface Project {
  id: string;
  title: string;
  role: string;
  status: ProjectStatus;
  description: string;
  tags: string[];
  href?: string;
  featured?: boolean;
  readout?: string;
  createdAt: string;
}

/** Founder / systems builds — empire-grade products, not a generic portfolio. */
export const projects: Project[] = [
  {
    id: "wonder-os",
    title: "Wonder",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Personal OS — bookshelf, finances, agents, wardrobe, and life tools in one local-first app. Built to beat fragmented SaaS for the one user who matters first: me.",
    tags: ["systems", "product", "local-first"],
    featured: true,
    readout: "personal OS · shipping continuously",
    createdAt: "2026-03-01",
  },
  {
    id: "celine-nova",
    title: "Celine Nova",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Public site as product: open-sourcing how I think — essays, bookshelf, daily signal, builds. Design and systems obsessed; not a template portfolio.",
    tags: ["web", "brand", "next.js"],
    href: "https://melanilaurents.com",
    featured: true,
    readout: "melanilaurents.com",
    createdAt: "2026-01-15",
  },
  {
    id: "dream-life",
    title: "Dream Life",
    role: "Creator",
    status: "Stealth",
    description:
      "3D first-person dream reality — LA rooftop base, private jet, SF runs. Cinematic graphics that still play. Built for the life, not a crime sandbox.",
    tags: ["3d", "engine", "experience"],
    featured: true,
    readout: "LA ↔ SF · in progress",
    createdAt: "2025-11-02",
  },
  {
    id: "build-os",
    title: "Build OS",
    role: "Open Source",
    status: "Open Source",
    description:
      "Git-native notes, experiment logs, and literature synthesis. Minimal tooling for builders who want a paper trail without enterprise ceremony.",
    tags: ["tools", "open-source", "markdown"],
    href: "https://github.com/melanikshrestha-boop/melani-laurents-website",
    featured: true,
    readout: "github.com/melanikshrestha-boop",
    createdAt: "2025-08-20",
  },
];
