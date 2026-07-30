/**
 * Daily = curated public surface (not the X firehose).
 *
 * HEART RULE
 * When you post on X and react with a heart on your own tweet,
 * that post is eligible for Daily. Add it here (newest first).
 * Everything else stays on X.
 *
 * YouTube: add videoId to embed on-site.
 * IG / TikTok: cross-post links only (no embeds).
 */

export type SocialPlatform = "x" | "youtube" | "instagram" | "tiktok";

/** Curated X post — only heart-marked ones belong here */
export interface CuratedXPost {
  id: string;
  date: string; // YYYY-MM-DD
  text: string;
  href: string;
}

/** YouTube video embeddable on the site */
export interface DailyYouTube {
  id: string;
  title: string;
  date: string;
  videoId: string;
  blurb?: string;
}

/** Always-on outbound social */
export const dailySocial = {
  x: {
    handle: "@MelaniLaurentS",
    href: "https://x.com/MelaniLaurentS",
    label: "Most active on X",
    note: "The firehose lives here. Daily only keeps the heart picks.",
  },
  youtube: {
    handle: "YouTube",
    href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
    label: "Long-form on YouTube",
  },
  instagram: {
    handle: "@melanilaurents",
    href: "https://www.instagram.com/melanilaurents/",
    label: "Instagram",
    note: "Cross-posted with TikTok",
  },
  tiktok: {
    handle: "@melanilaurents",
    href: "https://www.tiktok.com/@melanilaurents",
    label: "TikTok",
    note: "Cross-posted with Instagram",
  },
} as const;

/** Heart picks — newest first */
export const curatedXPosts: CuratedXPost[] = [
  {
    id: "2082718301851943375",
    date: "2026-07-30",
    text: "Reluctantly having to post on LinkedIn bc YC asks for it. Elon can you acquire LinkedIn and wipe it off the internet?",
    href: "https://x.com/MelaniLaurentS/status/2082718301851943375",
  },
  {
    id: "2082711485315268684",
    date: "2026-07-30",
    text: "Unfortunately Grok Pro's $300/month subscription is worth it. The devs are fking cracked",
    href: "https://x.com/MelaniLaurentS/status/2082711485315268684",
  },
  {
    id: "2064235359186374952",
    date: "2026-06-09",
    text: "99% of the world's problems would be gone if people pursued what they loved.",
    href: "https://x.com/MelaniLaurentS/status/2064235359186374952",
  },
];

/** YouTube embeds — empty until first real video */
export const dailyYouTube: DailyYouTube[] = [];

export function getCuratedXPosts(): CuratedXPost[] {
  return [...curatedXPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getDailyYouTube(): DailyYouTube[] {
  return [...dailyYouTube].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// Back-compat for older imports
export type DailySource = "x" | "journal" | "site";
export interface DailyPost {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  source?: DailySource;
  href?: string;
}
const dailyPosts: DailyPost[] = [];
export function getDailyPosts(): DailyPost[] {
  return [...dailyPosts];
}
export function getRecentDailyPosts(limit = 3): DailyPost[] {
  return getDailyPosts().slice(0, limit);
}
export function getJournalPosts(): DailyPost[] {
  return getDailyPosts().filter((p) => p.source === "journal");
}
