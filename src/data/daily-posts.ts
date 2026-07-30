/**
 * Daily — posts I write on X (mine only) + YouTube.
 * Rendered as real X-style cards, not generic “heart pick” list rows.
 */

export type DailyKind = "x-note" | "youtube" | "journal";

/** Nested quote tweet (X “quote” card). */
export interface QuotedPost {
  displayName: string;
  handle: string;
  date?: string;
  text: string;
  href?: string;
  avatarUrl?: string;
}

export interface DailyPost {
  slug: string;
  /** Tweet body */
  title: string;
  date: string;
  timeLabel?: string; // e.g. "12:36 PM"
  excerpt?: string;
  kind: DailyKind;
  href: string;
  handle?: string;
  displayName?: string;
  avatarUrl?: string;
  viewsLabel?: string;
  quoted?: QuotedPost;
}

const MY_HANDLE = "@MelaniLaurentS";
const MY_NAME = "Celine Nova";
const MY_AVATAR =
  "https://pbs.twimg.com/profile_images/2076576094493327360/LaEvB-1S.jpg";

/** Only posts I posted. */
const dailyPosts: DailyPost[] = [
  {
    slug: "x-econ-prof-college",
    title:
      "I rmr my Econ Prof from last semester saying college won’t exist in 10 years as a joke. He lowk right, it shouldn’t.",
    date: "2026-07-30",
    timeLabel: "11:59 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2082722740339904853",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "7",
  },
  {
    slug: "x-linkedin-yc",
    title:
      "Reluctantly having to post on @LinkedIn bc @ycombinator asks for it. @elonmusk can you acquire linkedin and wipe it off the internet?",
    date: "2026-07-30",
    timeLabel: "11:41 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2082718301851943375",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "13",
  },
  {
    slug: "x-grok-wins",
    title: "Alr @grok wins AI race",
    date: "2026-07-30",
    timeLabel: "11:31 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2082715646475817260",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "15",
  },
  {
    slug: "x-grok-subagents",
    title: "what @grok subagents do ygs add in ur usual coding repos ?",
    date: "2026-07-30",
    timeLabel: "11:24 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2082714037477933506",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "23",
  },
  {
    slug: "x-grok-pro",
    title:
      "Unfortunately Grok Pro’s $300/month subscription is worth it. The devs are fking cracked",
    date: "2026-07-30",
    timeLabel: "11:14 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2082711485315268684",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "25",
  },
  {
    slug: "x-pursue-what-you-love",
    title:
      "99% of the world’s problems would be gone if people pursued what they loved.",
    date: "2026-06-09",
    timeLabel: "11:37 PM",
    kind: "x-note",
    href: "https://x.com/MelaniLaurentS/status/2064235359186374952",
    handle: MY_HANDLE,
    displayName: MY_NAME,
    avatarUrl: MY_AVATAR,
    viewsLabel: "108",
  },
  {
    slug: "yt-celine-nova-channel",
    title: "CELINE NOVA ON YOUTUBE",
    date: "2026-04-01",
    kind: "youtube",
    href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
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

export function getMyXPosts(): DailyPost[] {
  return getDailyPosts().filter((p) => p.kind === "x-note");
}

export function getXHeartPicks(): DailyPost[] {
  return getMyXPosts();
}

export function getYouTubePicks(): DailyPost[] {
  return getDailyPosts().filter((p) => p.kind === "youtube");
}
