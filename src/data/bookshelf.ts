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
  year?: number;
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

export function getFavorites(): BookshelfEntry[] {
  return getBookshelfEntries().filter((e) => e.favorite);
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
