import { googleScholarUrl } from "@/data/publications";

export type ProjectStatus = "Active" | "Stealth" | "Open Source" | "Research";

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
  /** Lower = higher on Builds (1 = first). Array order alone is not enough — grid sorts. */
  priority?: number;
}

/**
 * Founder / systems / research builds.
 * Display order: priority asc, then createdAt desc.
 * Google Scholar is #1 — groundbreaking work (Melani).
 */
export const projects: Project[] = [
  {
    id: "google-scholar",
    title: "Google Scholar",
    role: "Researcher & Inventor",
    status: "Research",
    description:
      "Groundbreaking work: deep learning, neuroscience, and in-ear EEG systems — Bronx Science, Columbia Neuroscience, NIURA. Patents on wireless earbud EEG, multi-parameter vitals, and conductive electrode systems. This is the record that matters most.",
    tags: ["research", "neuroscience", "deep learning", "patents", "EEG"],
    href: googleScholarUrl,
    featured: true,
    priority: 1,
    readout: "scholar.google.com · cited work · patents",
    createdAt: "2023-01-01",
  },
  {
    id: "niura-ear-eeg",
    title: "In-ear EEG systems",
    role: "Inventor / Co-author",
    status: "Research",
    description:
      "Patent family for real-time in-the-ear electroencephalography: charging case with EEG, earbud electrode ports that play audio, n-doped silicone / filament electrodes, multi-parameter vitals connectivity. Hardware + signal path for what people actually wear.",
    tags: ["hardware", "EEG", "patents", "signals"],
    href: googleScholarUrl,
    featured: true,
    priority: 2,
    readout: "US patent applications · NIURA lineage",
    createdAt: "2023-08-01",
  },
  {
    id: "wonder-os",
    title: "Wonder",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Personal OS — bookshelf, finances, agents, wardrobe, and life tools in one local-first app. Built to beat fragmented SaaS for the one user who matters first: me.",
    tags: ["systems", "product", "local-first"],
    featured: true,
    priority: 3,
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
    href: "https://celinenova.com",
    featured: true,
    priority: 4,
    readout: "celinenova.com",
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
    priority: 5,
    readout: "LA ↔ SF · in progress",
    createdAt: "2025-11-02",
  },
  {
    id: "shotbyceline",
    title: "shotbyceline",
    role: "Photographer & Builder",
    status: "Active",
    description:
      "Art profile and photography product — full-bleed portfolio, collections, booking. Visual work as a real surface, not a buried gallery page.",
    tags: ["photography", "art", "product"],
    href: "https://celinenova.com/photography",
    featured: true,
    priority: 6,
    readout: "/photography",
    createdAt: "2025-09-01",
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
    priority: 7,
    readout: "github.com/melanikshrestha-boop",
    createdAt: "2025-08-20",
  },
  {
    id: "reproducible-research",
    title: "Reproducible research protocol",
    role: "Author",
    status: "Research",
    description:
      "Git-native research workflow design: literature, experiments, memos, tools — provenance without a bloated ELN. Notebooks for exploration; versioned structure for the long arc.",
    tags: ["research", "infrastructure", "tools"],
    href: "/research",
    featured: true,
    priority: 8,
    readout: "/research",
    createdAt: "2026-04-02",
  },
  {
    id: "signal-integrity",
    title: "Signal integrity · low resource",
    role: "Researcher",
    status: "Research",
    description:
      "Field notes and systems thinking on getting clean physiological and research signals under real constraints — low resource, high rigor.",
    tags: ["signals", "research", "systems"],
    href: "/research",
    featured: true,
    priority: 9,
    readout: "/research",
    createdAt: "2026-03-15",
  },
  {
    id: "rbcivosocial",
    title: "RBCivosocial",
    role: "Research lead",
    status: "Research",
    description:
      "Research framework at the edge of civic engagement, social infrastructure, and institutional health — translation layers between community signals and research workflows.",
    tags: ["research", "civic", "social"],
    href: "/research",
    featured: true,
    priority: 10,
    readout: "research thread",
    createdAt: "2026-05-28",
  },
  {
    id: "celine-agents",
    title: "Celine agent stack",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Custom agents for the public product: design, copy law, shelf UI, ratings, memory, ship — so the site stays empire-grade and never relearns the same mistakes.",
    tags: ["ai", "agents", "tooling"],
    featured: true,
    priority: 11,
    readout: ".grok/agents · shipping",
    createdAt: "2026-07-01",
  },
  {
    id: "grok-build-ops",
    title: "Grok Build ops",
    role: "Operator",
    status: "Active",
    description:
      "Daily use of frontier AI as leverage for engineering, design, and company building — not demos. The loop that ships Wonder, Celine Nova, and Dream Life.",
    tags: ["ai", "ops", "engineering"],
    featured: true,
    priority: 12,
    readout: "build loop",
    createdAt: "2026-06-01",
  },
];
