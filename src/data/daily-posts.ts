export interface DailyPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  /** Short notes open on X; journals open as full site entries. */
  source?: "x" | "journal";
  /** Required for X notes; journals default to /daily/[slug]. */
  href?: string;
}

/** Placeholder daily archive — wire to CMS when ready. */
const dailyPosts: DailyPost[] = [];

export function getDailyPosts(): DailyPost[] {
  return [...dailyPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getRecentDailyPosts(limit = 3): DailyPost[] {
  return getDailyPosts().slice(0, limit);
}
