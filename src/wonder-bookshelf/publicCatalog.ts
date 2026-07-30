/**
 * Public-only catalog extras (papers / podcasts / fave titles)
 * used by the Wonder BooksLibrary port on the public site.
 */
import { bookshelfEntries, type BookshelfEntry } from "@/data/bookshelf";
import { newBook, type Book } from "./booksStore";

export const PUBLIC_PAPERS = bookshelfEntries.filter((e) => e.kind === "paper");
export const PUBLIC_PODCASTS = bookshelfEntries.filter(
  (e) => e.kind === "podcast"
);

/** Titles marked favorite in public bookshelf data */
export const PUBLIC_FAVE_TITLE_KEYS = new Set(
  bookshelfEntries
    .filter((e) => e.favorite)
    .map((e) => e.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim())
);

function titleKey(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function isPublicFave(book: Pick<Book, "title" | "rating" | "notes">): boolean {
  if (book.rating >= 4) return true;
  if ((book.notes || "").toLowerCase().includes("fave")) return true;
  const key = titleKey(book.title || "");
  if (PUBLIC_FAVE_TITLE_KEYS.has(key)) return true;
  // Partial match so "Zero to One Notes on Startups..." still counts as the fave "Zero to One"
  for (const fave of PUBLIC_FAVE_TITLE_KEYS) {
    if (fave.length >= 6 && (key.includes(fave) || fave.includes(key))) return true;
  }
  return false;
}

/** Turn a public catalog row into a Wonder Book for the same card UI. */
export function catalogEntryToBook(entry: BookshelfEntry): Book {
  return newBook({
    id: `public-${entry.id}`,
    title: entry.title,
    author: entry.source,
    status: entry.favorite ? "finished" : "want",
    category: "Unsorted",
    categoryOverride: false,
    statusOverride: true,
    source: "manual",
    format: "manual",
    readingFormats: entry.kind === "book" ? ["physical"] : ["ebook"],
    description: entry.summary || entry.thoughts || entry.applied || "",
    notes: entry.favoriteWhy || entry.applied || entry.thoughts || "",
    externalUrl:
      entry.kind === "book"
        ? undefined // set by PublicBookshelf via storeUrlForBook
        : entry.href || undefined,
    rating: entry.favorite ? 5 : 0,
  });
}

export const publicPaperBooks: Book[] = PUBLIC_PAPERS.map(catalogEntryToBook);
export const publicPodcastBooks: Book[] =
  PUBLIC_PODCASTS.map(catalogEntryToBook);
