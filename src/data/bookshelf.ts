/**
 * Public bookshelf — books, papers, blogs, podcasts.
 * Physical books: store links only (no PDFs).
 * Edit this file to add/change entries (no admin UI yet).
 */

export type BookshelfKind = "book" | "paper" | "blog" | "podcast";

export type BookshelfEntry = {
  id: string;
  kind: BookshelfKind;
  title: string;
  source: string;
  /** When you logged it (ISO) */
  loggedAt: string;
  /** One-line what it is */
  summary?: string;
  /** Your take */
  thoughts?: string;
  /** How you used it */
  applied?: string;
  href?: string;
  year?: number;
  /** Show in Faves */
  favorite?: boolean;
  /** Why it’s a fave (public) */
  favoriteWhy?: string;
};

export const BOOKSHELF_KIND_LABEL: Record<BookshelfKind, string> = {
  book: "Book",
  paper: "Paper",
  blog: "Blog",
  podcast: "Podcast",
};

export const bookshelfEntries: BookshelfEntry[] = [
  {
    id: "zero-to-one",
    kind: "book",
    title: "Zero to One",
    source: "Peter Thiel",
    loggedAt: "2026-05-20",
    year: 2014,
    summary: "Building what doesn’t exist yet.",
    thoughts:
      "What important truth do few people agree with you on?",
    applied: "Filter for unique systems over me-too features.",
    href: "https://www.amazon.com/s?k=Zero+to+One+Peter+Thiel",
    favorite: true,
    favoriteWhy:
      "The contrarian question is a weekly check on whether I’m actually building something new.",
  },
  {
    id: "attention-is-all-you-need",
    kind: "paper",
    title: "Attention Is All You Need",
    source: "Vaswani et al.",
    loggedAt: "2026-05-12",
    year: 2017,
    summary: "Transformers — self-attention as the core.",
    thoughts: "Mechanism before product story.",
    applied: "How I explain AI without the hype layer.",
    href: "https://arxiv.org/abs/1706.03762",
    favorite: true,
    favoriteWhy:
      "Clean architecture paper — still the mental model I use for modern models.",
  },
  {
    id: "paulg-maker",
    kind: "blog",
    title: "Maker's Schedule, Manager's Schedule",
    source: "Paul Graham",
    loggedAt: "2026-05-05",
    year: 2009,
    summary: "One meeting can kill a maker day.",
    applied: "Mornings = build. Meetings batched.",
    href: "https://paulgraham.com/makersschedule.html",
  },
  {
    id: "lex-first-principles",
    kind: "podcast",
    title: "First principles conversations",
    source: "Long-form tech / science",
    loggedAt: "2026-04-28",
    summary: "Hours with builders — less soundbite.",
    applied: "3 bullets after every episode.",
    href: "https://open.spotify.com/",
  },
];

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
