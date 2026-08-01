import type { ConsumeEntry } from "./consume-types";

/**
 * Public log of what Melani consumes + her take.
 * Newest first. Edit this file (or later: CMS) to publish.
 */
export const consumeLog: ConsumeEntry[] = [
  {
    id: "c-2026-08-01-yc-linkedin",
    title: "YC application theater on LinkedIn",
    medium: "other",
    by: "the feed",
    date: "2026-08-01",
    stance: "rethinking",
    take:
      "Status platforms make you perform seriousness. The work should be the signal — not a timeline of fake milestones.",
    why: "Noticed how much energy goes into looking founder-like instead of shipping.",
    tags: ["startups", "attention", "status"],
    blogSlug: "status-vs-signal",
  },
  {
    id: "c-2026-07-28-neuroplasticity",
    title: "Daily n+1 learning as consolidation of memory",
    medium: "essay",
    by: "self",
    date: "2026-07-28",
    stance: "building-on",
    take:
      "Writing what you listen to, read, and argue about is how you force the brain to keep the signal. Silence after input is wasted plasticity.",
    why: "Core of the bookshelf + daily archive thesis.",
    tags: ["neuroplasticity", "writing", "learning"],
    blogSlug: "consume-to-claim",
  },
  {
    id: "c-2026-07-20-bci-signal",
    title: "Signal integrity in low-resource BCI stacks",
    medium: "paper",
    by: "own research line",
    date: "2026-07-20",
    stance: "building-on",
    take:
      "Clean signal beats clever models. If the acquisition layer is sloppy, the decoder is cosplay.",
    why: "Keeps builds honest when hype wants demos over data.",
    href: "/research",
    tags: ["bci", "neurotech", "engineering"],
  },
  {
    id: "c-2026-07-15-interstellar",
    title: "Interstellar",
    medium: "film",
    by: "Nolan",
    date: "2026-07-15",
    stance: "agree",
    take:
      "Love as a physical hypothesis is overstated — but the craft of making scale feel personal is real engineering of attention.",
    why: "Re-watched for the sound + the dock sequence, not the monologues.",
    tags: ["film", "attention", "craft"],
  },
];

export function getConsumeById(id: string): ConsumeEntry | undefined {
  return consumeLog.find((e) => e.id === id);
}

export function listConsume(limit?: number): ConsumeEntry[] {
  const sorted = [...consumeLog].sort((a, b) => b.date.localeCompare(a.date));
  return limit ? sorted.slice(0, limit) : sorted;
}
