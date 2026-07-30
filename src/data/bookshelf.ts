/**
 * Public bookshelf catalog.
 * Books use Amazon /dp/{ASIN} + matching cover. No PDFs.
 *
 * To add a book by title only, run:
 *   npm run bookshelf:add -- "Atomic Habits" "James Clear"
 * Or tell the agent the title — it runs the same script.
 */

import catalog from "./bookshelf-catalog.json";

export type BookshelfKind = "book" | "paper" | "blog" | "podcast";

export type BookshelfEntry = {
  id: string;
  kind: BookshelfKind;
  title: string;
  source: string;
  loggedAt: string;
  summary?: string;
  thoughts?: string;
  applied?: string;
  href?: string;
  /** Amazon ASIN — product page + matching cover art */
  asin?: string;
  /**
   * Override cover image when Amazon’s ASIN art is wrong
   * (e.g. back cover, blank, or foreign edition).
   */
  coverUrl?: string;
  /**
   * Explicit public shelf folder.
   * When set, PublicBookshelf uses this instead of keyword auto-sort.
   */
  category?: string;
  year?: number;
  /**
   * Personal rating 1–5.
   * Faves = only 5-star books (see favorite + PublicBookshelf Faves chip).
   */
  rating?: 1 | 2 | 3 | 4 | 5;
  favorite?: boolean;
  favoriteWhy?: string;
};

export const BOOKSHELF_KIND_LABEL: Record<BookshelfKind, string> = {
  book: "Book",
  paper: "Paper",
  blog: "Blog",
  podcast: "Podcast",
};

export const bookshelfEntries: BookshelfEntry[] =
  catalog as BookshelfEntry[];

export function getBookshelfEntries(): BookshelfEntry[] {
  return [...bookshelfEntries].sort(
    (a, b) => +new Date(b.loggedAt) - +new Date(a.loggedAt)
  );
}

/** Faves = only 5-star personal ratings (favorite flag kept in sync). */
export function getFavorites(): BookshelfEntry[] {
  return getBookshelfEntries().filter(
    (e) => e.rating === 5 || e.favorite === true
  );
}

export function isFiveStar(entry: BookshelfEntry): boolean {
  return entry.rating === 5 || entry.favorite === true;
}

/** Meditations shelf — Marcus Aurelius + title match */
export function isMeditation(entry: BookshelfEntry): boolean {
  const title = entry.title.toLowerCase();
  const source = (entry.source || "").toLowerCase();
  return (
    title.includes("meditation") ||
    source.includes("marcus aurelius") ||
    source.includes("aurelius")
  );
}

/**
 * Your intelligence = 5★ faves + meditations (Melani).
 * Public chip / flat grid on the shelf.
 */
export function isYourIntelligence(entry: BookshelfEntry): boolean {
  return isFiveStar(entry) || isMeditation(entry);
}

export function getYourIntelligence(): BookshelfEntry[] {
  return getBookshelfEntries().filter(isYourIntelligence);
}

export function getRecentBookshelf(limit = 3): BookshelfEntry[] {
  return getBookshelfEntries().slice(0, limit);
}

export function countByKind(entries: BookshelfEntry[] = getBookshelfEntries()) {
  return entries.reduce(
    (acc, e) => {
      acc[e.kind] = (acc[e.kind] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<BookshelfKind, number>>
  );
}
