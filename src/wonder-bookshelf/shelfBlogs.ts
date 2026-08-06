/**
 * Blogs Melani actually liked — numbered list, chronological by read order.
 * Single tap → open post. Double tap → her annotations (when she writes them).
 */

export type ShelfBlog = {
  id: string;
  title: string;
  url: string;
  author: string;
  /** ISO date published — shown as M/D/YY next to title */
  date?: string;
  /** Her notes — empty until she writes */
  annotation?: string;
};

/** Format 2014-01-28 → 1/28/14 */
export function shortBlogDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${m}/${d}/${String(y).slice(-2)}`;
}

/**
 * Chronological order she read (1 → n).
 * Specific posts she liked — not author shout-out cards.
 */
export const SHELF_BLOGS: ShelfBlog[] = [
  {
    id: "sa-tech-wealth",
    title: "Technology and wealth inequality",
    url: "https://blog.samaltman.com/technology-and-wealth-inequality",
    author: "Sam Altman",
    date: "2014-01-28",
  },
  {
    id: "sa-value-doing",
    title: "Value is created by doing",
    url: "https://blog.samaltman.com/value-is-created-by-doing",
    author: "Sam Altman",
    date: "2014-01-16",
  },
  {
    id: "sa-super-successful",
    title: "Super successful companies",
    url: "https://blog.samaltman.com/super-successful-companies",
    author: "Sam Altman",
    date: "2014-01-15",
  },
  {
    id: "sa-productivity",
    title: "Productivity",
    url: "https://blog.samaltman.com/productivity",
    author: "Sam Altman",
    date: "2018-04-10",
  },
  {
    id: "sa-archive",
    title: "Sam Altman — full archive (daily essay goal)",
    url: "https://blog.samaltman.com/archive?date=1362096000",
    author: "Sam Altman",
    annotation:
      "Owner goal: ≥1 essay by Sam Altman or Paul Graham every day. Start here and walk the archive.",
  },
  {
    id: "pg-articles",
    title: "Paul Graham — essays index (daily essay goal)",
    url: "https://www.paulgraham.com/articles.html",
    author: "Paul Graham",
    annotation:
      "Owner goal: ≥1 essay by Sam Altman or Paul Graham every day. Pair with SA archive.",
  },
  {
    id: "pc-why-aesthetics",
    title: "Why Aesthetics",
    url: "https://patrickcollison.com/dispatches/why-aesthetics",
    author: "Patrick Collison",
    date: "2026-08-02",
  },
  {
    id: "pc-paris",
    title: "Paris",
    url: "https://patrickcollison.com/dispatches/paris",
    author: "Patrick Collison",
    date: "2026-06-20",
  },
  {
    id: "pc-new-aesthetics",
    title: "New Aesthetics",
    url: "https://patrickcollison.com/dispatches/new-aesthetics",
    author: "Patrick Collison",
    date: "2026-05-25",
  },
  {
    id: "pc-fast",
    title: "Fast",
    url: "https://patrickcollison.com/fast",
    author: "Patrick Collison",
  },
];
