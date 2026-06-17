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

export const projects: Project[] = [
  {
    id: "clinical-signal-platform",
    title: "Clinical Signal Platform",
    role: "Founder & Builder",
    status: "Active",
    description:
      "Infrastructure for turning noisy physiological signals into actionable clinical insights — built for teams who need rigor without the enterprise bloat.",
    tags: ["med-tech", "signals"],
    featured: true,
    readout: "SNR: 42.3 dB · latency: 12ms",
    createdAt: "2026-01-15",
  },
  {
    id: "device-validation-toolkit",
    title: "Device Validation Toolkit",
    role: "Creator",
    status: "Stealth",
    description:
      "Automated test harnesses and traceability workflows for early-stage medical devices — from bench to regulatory-ready documentation.",
    tags: ["hardware", "validation"],
    featured: true,
    readout: "tests: 847 · coverage: 94%",
    createdAt: "2025-11-02",
  },
  {
    id: "research-os",
    title: "Research OS",
    role: "Open Source Maintainer",
    status: "Open Source",
    description:
      "A minimal toolkit for reproducible research notes, experiment logs, and literature synthesis — git-native, markdown-first.",
    tags: ["tools", "open-source"],
    href: "https://github.com/melanikshrestha-boop",
    featured: true,
    readout: "commits: 312",
    createdAt: "2025-08-20",
  },
];
