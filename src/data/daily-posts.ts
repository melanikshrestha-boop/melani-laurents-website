/**
 * Daily = my public posts surface (not the X firehose of others).
 *
 * X: only posts I write. Shown as real tweet cards in a slider.
 * YouTube: channel / embeds when we have them.
 */

export type SocialPlatform = "x" | "youtube" | "instagram" | "tiktok";

/** Nested quote tweet (when I quote someone) */
export interface QuotedPost {
  displayName: string;
  handle: string;
  text: string;
  date?: string;
  href?: string;
  avatarUrl?: string;
}

/** One of my X posts — enough shape for the real tweet card UI */
export interface DailyPost {
  slug: string;
  /** Tweet body */
  title: string;
  date: string; // YYYY-MM-DD
  href: string;
  displayName?: string;
  handle?: string;
  avatarUrl?: string;
  timeLabel?: string;
  viewsLabel?: string;
  quoted?: QuotedPost;
  excerpt?: string;
  source?: "x" | "journal" | "site";
}

/** Always-on outbound social */
export const dailySocial = {
  x: {
    handle: "@melanilaurents",
    href: "https://x.com/melanilaurents",
    label: "X",
    note: "My posts live here in full.",
  },
  youtube: {
    handle: "YouTube",
    href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
    label: "YouTube",
  },
  instagram: {
    handle: "@melanilaurents",
    href: "https://www.instagram.com/melanilaurents/",
    label: "Instagram",
  },
  tiktok: {
    handle: "@melanilaurents",
    href: "https://www.tiktok.com/@melanilaurents",
    label: "TikTok",
  },
} as const;

const AVATAR =
  "https://pbs.twimg.com/profile_images/2076576094493327360/LaEvB-1S.jpg";

/** My posts only — newest first */
const myXPosts: DailyPost[] = [
  {
    slug: "2082718301851943375",
    date: "2026-07-30",
    title:
      "Reluctantly having to post on LinkedIn bc YC asks for it. Elon can you acquire LinkedIn and wipe it off the internet?",
    href: "https://x.com/melanilaurents/status/2082718301851943375",
    displayName: "Celine Nova",
    handle: "@melanilaurents",
    avatarUrl: AVATAR,
  },
  {
    slug: "2082711485315268684",
    date: "2026-07-30",
    title:
      "Unfortunately Grok Pro's $300/month subscription is worth it. The devs are fking cracked",
    href: "https://x.com/melanilaurents/status/2082711485315268684",
    displayName: "Celine Nova",
    handle: "@melanilaurents",
    avatarUrl: AVATAR,
  },
  {
    slug: "2064235359186374952",
    date: "2026-06-09",
    title:
      "99% of the world's problems would be gone if people pursued what they loved.",
    href: "https://x.com/melanilaurents/status/2064235359186374952",
    displayName: "Celine Nova",
    handle: "@melanilaurents",
    avatarUrl: AVATAR,
  },
];

export interface DailyYouTube {
  id: string;
  title: string;
  date: string;
  videoId?: string;
  href?: string;
  blurb?: string;
}

/** Channel picks / embeds — empty until first real video */
export const dailyYouTube: DailyYouTube[] = [];

/** Mine-only X posts for the Daily slider */
export function getMyXPosts(): DailyPost[] {
  return [...myXPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/** Alias used by older curated naming */
export function getCuratedXPosts(): DailyPost[] {
  return getMyXPosts();
}

export function getYouTubePicks(): DailyYouTube[] {
  return getDailyYouTube();
}

export function getDailyYouTube(): DailyYouTube[] {
  return [...dailyYouTube].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Back-compat for older list imports
export type DailySource = "x" | "journal" | "site";

export function getDailyPosts(): DailyPost[] {
  return getMyXPosts();
}

export function getRecentDailyPosts(limit = 3): DailyPost[] {
  return getMyXPosts().slice(0, limit);
}

export function getJournalPosts(): DailyPost[] {
  return [];
}
