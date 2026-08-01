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
 * Builds copy: short, human, scannable.
 * No patent-brochure walls. One idea per card — why it exists.
 */
export const projects: Project[] = [
  {
    id: "google-scholar",
    title: "Google Scholar",
    role: "Researcher & Inventor",
    status: "Research",
    description:
      "The public record of work I actually did — brain signals, deep learning, and gear people can wear. Not a résumé dump. Proof.",
    tags: ["research", "EEG", "patents"],
    href: googleScholarUrl,
    featured: true,
    priority: 1,
    readout: "cited work · patents",
    createdAt: "2023-01-01",
  },
  {
    id: "niura-ear-eeg",
    title: "In-ear EEG",
    role: "Inventor",
    status: "Research",
    description:
      "Brain signal from earbuds — not a lab helmet. Hardware for real ears, real life.",
    tags: ["hardware", "EEG"],
    href: googleScholarUrl,
    featured: true,
    priority: 2,
    readout: "patent family",
    createdAt: "2023-08-01",
  },
  {
    id: "wonder-os",
    title: "Wonder",
    role: "Founder & Builder",
    status: "Active",
    description:
      "My personal OS. Books, money, agents, wardrobe — one app, local-first, built for me first.",
    tags: ["product", "systems"],
    featured: true,
    priority: 3,
    readout: "shipping now",
    createdAt: "2026-03-01",
  },
  {
    id: "celine-nova",
    title: "Celine Nova",
    role: "Founder & Builder",
    status: "Active",
    description:
      "This site. How I think in public — builds, bookshelf, opinions. Not a template portfolio.",
    tags: ["web", "brand"],
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
      "3D life sim — LA rooftop, jet, SF. Beautiful enough to want. Playable enough to stay.",
    tags: ["3d", "game"],
    featured: true,
    priority: 5,
    readout: "LA ↔ SF",
    createdAt: "2025-11-02",
  },
  {
    id: "shotbyceline",
    title: "shotbyceline",
    role: "Photographer",
    status: "Active",
    description:
      "Photography as a real product — portraits, scenery, booking. Not a forgotten gallery tab.",
    tags: ["photo", "art"],
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
      "Notes and experiment logs in git. A paper trail without enterprise theater.",
    tags: ["tools", "open source"],
    href: "https://github.com/melanikshrestha-boop/melani-laurents-website",
    featured: true,
    priority: 7,
    readout: "github",
    createdAt: "2025-08-20",
  },
  {
    id: "reproducible-research",
    title: "Research protocol",
    role: "Author",
    status: "Research",
    description:
      "How I keep research honest over years — versioned, git-native, no bloated ELN.",
    tags: ["research", "tools"],
    href: "/research",
    featured: true,
    priority: 8,
    readout: "/research",
    createdAt: "2026-04-02",
  },
  {
    id: "signal-integrity",
    title: "Signal integrity",
    role: "Researcher",
    status: "Research",
    description:
      "Clean signals under ugly constraints. Rigor when the lab isn’t perfect.",
    tags: ["signals", "research"],
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
      "Civic + social infrastructure research — how community signal becomes something institutions can act on.",
    tags: ["research", "civic"],
    href: "/research",
    featured: true,
    priority: 10,
    readout: "research thread",
    createdAt: "2026-05-28",
  },
  {
    id: "celine-agents",
    title: "Celine agents",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Agents that ship and protect this product — design law, shelf UI, push. So nothing relearns bad habits.",
    tags: ["ai", "agents"],
    featured: true,
    priority: 11,
    readout: "shipping",
    createdAt: "2026-07-01",
  },
  {
    id: "grok-build-ops",
    title: "AI build loop",
    role: "Operator",
    status: "Active",
    description:
      "Frontier models as leverage for real engineering — Wonder, this site, Dream Life. Not demo cosplay.",
    tags: ["ai", "ops"],
    featured: true,
    priority: 12,
    readout: "daily loop",
    createdAt: "2026-06-01",
  },
];
