/**
 * Blogs Melani has *finished* reading — public shelf only.
 * Law: no unread placeholders. Every entry needs a highlight + her take (n+1).
 * Data: src/data/shelf-blogs.json (editable from the page in edit mode).
 */

import raw from "@/data/shelf-blogs.json";

export type ShelfBlog = {
  id: string;
  title: string;
  url: string;
  author: string;
  /** ISO date the essay was published */
  date?: string;
  /** ISO date she finished reading (optional) */
  readAt?: string;
  /** Line she marked in the piece — always shown on the shelf */
  highlight: string;
  /** Her contribution / n+1 — always shown on the shelf */
  take: string;
};

/** Format 2014-01-28 → 1/28/14 */
export function shortBlogDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${m}/${d}/${String(y).slice(-2)}`;
}

export const SHELF_BLOGS: ShelfBlog[] = raw as ShelfBlog[];

/** Public list: finished + has contribution (never empty rows) */
export function getShelfBlogs(): ShelfBlog[] {
  return SHELF_BLOGS.filter(
    (b) => b.highlight.trim().length > 0 && b.take.trim().length > 0
  );
}
