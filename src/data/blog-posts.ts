import type { BlogPost } from "./consume-types";
import { listConsume } from "./consume-log";

/**
 * Blog posts — Sam Altman–style archive: title + date, full width.
 * draft: true = still rough; listed with a Draft label until she locks it.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "nineteen",
    title: "Nineteen",
    date: "2026-08-11",
    draft: true,
    lede: "A draft on the age everyone treats as a waiting room — and the year I’m refusing to wait.",
    stance: "building-on",
    thesis:
      "Nineteen is not a practice round. If the work is real, the year counts.",
    tags: ["life", "building", "draft"],
    body: [
      "I’m nineteen. People say it like a disclaimer — young enough that the bar is lower, old enough that the clock has started. I don’t use it as either. It’s just the year I’m in while I build.",
      "Most of the scripts for this age are someone else’s. School first, then permission, then a career that looks good on a form. I’m not against school. I’m against treating my twenties like a rehearsal for a life I’m already living. The product is shipping. The company path is real. The public work has a name.",
      "Melani is who I am. Celine Nova is how the work shows up — essays, builds, photography, the site. Same person. One of me doesn’t get to stay “potential” while the other pretends to be finished. At nineteen that split is loud if you let other people define it. I don’t.",
      "What I care about is systems: software that holds under load, interfaces that stay fast, tools that don’t lie, companies that can beat the incumbents instead of cosplaying them. Quantum, compute, product — the frontier is not a mood board. It’s what I study and ship toward. Creative work still matters — photo, video, music — but the spine is engineering and company building.",
      "Being nineteen also means people underestimate you on purpose or by habit. That’s fine. Underestimation is free fuel as long as you don’t internalize it. The correction is boring and daily: write, build, publish, fix, ship again. Empire talk without a commit history is cosplay. I want the commits.",
      "I take health seriously without making it my identity. I take taste seriously — books, music, rooms, code. I take pride in the stack I’m assembling before the world decides I’m “old enough.” Wonder. Lens. This site. Dream Life as the long game. None of that waits for a diploma to become true.",
      "This post is a draft because the year is a draft. I’m not trying to sound finished. I’m trying to leave a record of what it felt like to refuse the waiting room — to treat nineteen as the work year it is, not a trailer for later.",
      "If you’re nineteen too, or remember it, or are building while people still call you early: the only age that matters is whether you shipped something real today. Everything else is commentary.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function listBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Sam Altman archive date: "SEPTEMBER 8, 2025" */
export function formatBlogArchiveDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export function consumeForPost(post: BlogPost) {
  return (post.consumeIds || [])
    .map((id) => listConsume().find((c) => c.id === id))
    .filter(Boolean);
}

export function threadIdForBlog(slug: string): string {
  return `blog:${slug}`;
}

export function threadIdForConsume(id: string): string {
  return `consume:${id}`;
}
