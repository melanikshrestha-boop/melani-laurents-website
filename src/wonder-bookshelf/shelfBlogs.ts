/**
 * Blogs Melani actually liked — numbered list, chronological by read order.
 * Single tap → open post. Double tap → her annotations (when she writes them).
 */

export type ShelfBlog = {
  id: string;
  title: string;
  url: string;
  /** ISO date published (optional, for display) */
  date?: string;
  /** Her notes — empty until she writes */
  annotation?: string;
};

/**
 * Chronological order she read (1 → n).
 * Seed: three Sam Altman posts she pointed at.
 */
export const SHELF_BLOGS: ShelfBlog[] = [
  {
    id: "sa-tech-wealth",
    title: "Technology and wealth inequality",
    url: "https://blog.samaltman.com/technology-and-wealth-inequality",
    date: "2014-01-28",
  },
  {
    id: "sa-value-doing",
    title: "Value is created by doing",
    url: "https://blog.samaltman.com/value-is-created-by-doing",
    date: "2014-01-16",
  },
  {
    id: "sa-super-successful",
    title: "Super successful companies",
    url: "https://blog.samaltman.com/super-successful-companies",
    date: "2014-01-15",
  },
];
