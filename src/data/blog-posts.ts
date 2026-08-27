import type { BlogPost } from "./consume-types";
import { listConsume } from "./consume-log";

/**
 * Blog posts — Sam Altman–style archive: title + date, full width.
 * draft: true = still rough; listed with a Draft label until she locks it.
 *
 * LAW: Melani writes every word of lede / thesis / body.
 * Agents may add an empty shell (slug, title, date, draft: true) only when she asks.
 * Never invent essay prose for her.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "nineteen",
    title: "Nineteen",
    date: "2026-08-11",
    draft: true,
    lede: "",
    stance: "curious",
    thesis: "",
    tags: ["draft"],
    /** You write this. Empty until you do. */
    body: [],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function listBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

/** Plain document date: "September 8, 2025". */
export function formatBlogArchiveDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
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
