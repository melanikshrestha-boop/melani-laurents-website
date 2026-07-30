/**
 * Public bookshelf — what I read / listen to / study, with notes.
 * Physical books link out to the store page (no PDFs — copyright).
 */

export type BookshelfKind =
  | "book"
  | "paper"
  | "blog"
  | "podcast";

export type BookshelfEntry = {
  id: string;
  kind: BookshelfKind;
  title: string;
  /** Author, journal, host, publication */
  source: string;
  /** ISO date when you logged it (not publish date) */
  loggedAt: string;
  /** Short public blurb */
  summary: string;
  /** Your takeaways */
  thoughts?: string;
  /** How you used it in real life */
  applied?: string;
  /**
   * Outbound link:
   * - book → Amazon (or other store)
   * - paper / blog / podcast → original URL
   */
  href?: string;
  /** Optional year of the work itself */
  year?: number;
};

export const BOOKSHELF_KIND_LABEL: Record<BookshelfKind, string> = {
  book: "Physical book",
  paper: "Research paper",
  blog: "Blog",
  podcast: "Podcast",
};

/** Newest first */
export const bookshelfEntries: BookshelfEntry[] = [
  {
    id: "zero-to-one",
    kind: "book",
    title: "Zero to One",
    source: "Peter Thiel",
    loggedAt: "2026-05-20",
    year: 2014,
    summary:
      "On building things that don’t exist yet — monopoly as a feature, not a bug.",
    thoughts:
      "The contrarian question is useful every week: what important truth do few people agree with you on?",
    applied:
      "Used it as a filter for what I ship in public — unique systems over me-too features.",
    // Store link only (no PDF). Swap in your tagged URL when ready.
    href: "https://www.amazon.com/s?k=Zero+to+One+Peter+Thiel",
  },
  {
    id: "attention-is-all-you-need",
    kind: "paper",
    title: "Attention Is All You Need",
    source: "Vaswani et al.",
    loggedAt: "2026-05-12",
    year: 2017,
    summary:
      "The transformer paper — self-attention as the core of modern sequence models.",
    thoughts:
      "Architecture clarity beats hype: understand the mechanism before the product story.",
    applied:
      "Framed how I explain AI systems to non-technical people — attention as selective focus.",
    href: "https://arxiv.org/abs/1706.03762",
  },
  {
    id: "paulg-maker",
    kind: "blog",
    title: "Maker's Schedule, Manager's Schedule",
    source: "Paul Graham",
    loggedAt: "2026-05-05",
    year: 2009,
    summary:
      "Why a single meeting can destroy a whole day of deep work.",
    thoughts:
      "Protect maker blocks like product deadlines.",
    applied:
      "Batch meetings. Morning = build. Afternoon = optional noise.",
    href: "https://paulgraham.com/makersschedule.html",
  },
  {
    id: "lex-first-principles",
    kind: "podcast",
    title: "First principles conversations",
    source: "Long-form tech / science shows",
    loggedAt: "2026-04-28",
    summary:
      "Hours with builders and researchers — less soundbite, more mechanism.",
    thoughts:
      "Good interviews are research notes in audio form.",
    applied:
      "Capture 3 bullets after every episode before they evaporate.",
    href: "https://open.spotify.com/",
  },
];

export function getBookshelfEntries(): BookshelfEntry[] {
  return [...bookshelfEntries].sort(
    (a, b) => +new Date(b.loggedAt) - +new Date(a.loggedAt)
  );
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
