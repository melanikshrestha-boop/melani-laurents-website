import type { BlogPost } from "./consume-types";
import { listConsume } from "./consume-log";

/**
 * Blog posts — empty until she writes.
 * Index is Sam Altman–style: title + date archive, full width.
 */
export const blogPosts: BlogPost[] = [];

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
