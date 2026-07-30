/**
 * Daily surface data — X heart picks, short notes, and YouTube.
 * Curated by hand (not a live likes API). Edit here to ship new picks.
 */

export type DailyKind = "x-heart" | "x-note" | "youtube" | "journal";

export interface DailyPost {
  slug: string;
  title: string;
  date: string; // ISO date
  excerpt?: string;
  kind: DailyKind;
  /** External or internal URL */
  href: string;
  /** e.g. @handle or channel label */
  sourceLabel?: string;
}

/** X posts / accounts worth keeping (hearts + own notes). */
const dailyPosts: DailyPost[] = [
  {
    slug: "x-pursue-what-you-love",
    title: "99% of the world’s problems would be gone if people pursued what they loved.",
    date: "2026-06-09",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2064235359186374952",
    sourceLabel: "@MelaniLaurentS",
    excerpt: "On the timeline — short form, still true.",
  },
  {
    slug: "x-heart-paul-graham",
    title: "Do Things that Don’t Scale",
    date: "2026-05-28",
    kind: "x-heart",
    href: "https://www.paulgraham.com/ds.html",
    sourceLabel: "paulgraham.com",
    excerpt: "Hearted for founders who still do the unscalable work first.",
  },
  {
    slug: "x-heart-zero-to-one",
    title: "Competition is for losers — monopoly is the goal of every successful business.",
    date: "2026-05-12",
    kind: "x-heart",
    href: "https://x.com/search?q=zero%20to%20one%20thiel",
    sourceLabel: "Thiel / Zero to One orbit",
    excerpt: "Saved for the shelf energy, not the quote-tweet war.",
  },
  {
    slug: "x-heart-sam-altman-productivity",
    title: "Productivity",
    date: "2026-04-30",
    kind: "x-heart",
    href: "https://blog.samaltman.com/productivity",
    sourceLabel: "blog.samaltman.com",
    excerpt: "Heart pick — high-signal, low-theater.",
  },
  {
    slug: "yt-celine-nova-channel",
    title: "CELINE NOVA ON YOUTUBE",
    date: "2026-04-01",
    kind: "youtube",
    href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
    sourceLabel: "YouTube",
    excerpt:
      "Long-form when a thread isn’t enough — learning, reading, building, changing my mind.",
  },
];

export function getDailyPosts(): DailyPost[] {
  return [...dailyPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getDailyByKind(kind: DailyKind): DailyPost[] {
  return getDailyPosts().filter((p) => p.kind === kind);
}

export function getRecentDailyPosts(limit = 3): DailyPost[] {
  return getDailyPosts().slice(0, limit);
}

export function getXHeartPicks(): DailyPost[] {
  return getDailyPosts().filter(
    (p) => p.kind === "x-heart" || p.kind === "x-note",
  );
}

export function getYouTubePicks(): DailyPost[] {
  return getDailyPosts().filter((p) => p.kind === "youtube");
}
