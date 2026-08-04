/**
 * Greats · blogs & essays — people Melani reads beyond books.
 * Bookshelf will grow into this: books + blogs from founders / artists / operators.
 * Seed list only; expand anytime.
 */

export type GreatsPost = {
  id: string;
  title: string;
  url: string;
  /** Optional one-line why this matters */
  note?: string;
};

export type GreatsAuthor = {
  id: string;
  name: string;
  /** Home / index for their writing */
  homeUrl: string;
  kind: "blog" | "essays" | "newsletter";
  /** Soft accent for chips */
  accent: string;
  posts: GreatsPost[];
};

/**
 * Core greats. Sam Altman first (user-seeded), Paul Graham essays next.
 * Add Bowie/Jobs later if you want essay archives, not just quotes.
 */
export const GREATS_AUTHORS: GreatsAuthor[] = [
  {
    id: "sam-altman",
    name: "Sam Altman",
    homeUrl: "https://blog.samaltman.com/",
    kind: "blog",
    accent: "#7eb8ff",
    posts: [
      {
        id: "sa-growth-gov",
        title: "Growth and government",
        url: "https://blog.samaltman.com/growth-and-government",
        note: "How growth, policy, and power shape the future",
      },
      {
        id: "sa-how-to-be-successful",
        title: "How to Be Successful",
        url: "https://blog.samaltman.com/how-to-be-successful",
      },
      {
        id: "sa-productivity",
        title: "Productivity",
        url: "https://blog.samaltman.com/productivity",
      },
      {
        id: "sa-hard",
        title: "Hard tech is back",
        url: "https://blog.samaltman.com/hard-tech-is-back",
      },
    ],
  },
  {
    id: "paul-graham",
    name: "Paul Graham",
    homeUrl: "https://www.paulgraham.com/articles.html",
    kind: "essays",
    accent: "#d6b367",
    posts: [
      {
        id: "pg-ds",
        title: "Do Things that Don't Scale",
        url: "https://www.paulgraham.com/ds.html",
      },
      {
        id: "pg-growth",
        title: "Startup = Growth",
        url: "https://www.paulgraham.com/growth.html",
      },
      {
        id: "pg-mean",
        title: "Mean People Fail",
        url: "https://www.paulgraham.com/mean.html",
      },
      {
        id: "pg-cities",
        title: "How to Be Silicon Valley",
        url: "https://www.paulgraham.com/siliconvalley.html",
      },
    ],
  },
  {
    id: "patrick-collison",
    name: "Patrick Collison",
    homeUrl: "https://patrickcollison.com/dispatches",
    kind: "essays",
    accent: "#5b8c5a",
    posts: [
      {
        id: "pc-why-aesthetics",
        title: "Why Aesthetics",
        url: "https://patrickcollison.com/dispatches/why-aesthetics",
        note: "Beauty, modernism, and why ugliness inhibits creation",
      },
      {
        id: "pc-paris",
        title: "Paris",
        url: "https://patrickcollison.com/dispatches/paris",
        note: "Haussmann, materials, and whether central Paris is the peak built environment",
      },
      {
        id: "pc-new-aesthetics",
        title: "New Aesthetics",
        url: "https://patrickcollison.com/dispatches/new-aesthetics",
        note: "Grants for work beyond the current aesthetic moment",
      },
      {
        id: "pc-fast",
        title: "Fast",
        url: "https://patrickcollison.com/fast",
        note: "How long things take — and how long they used to take",
      },
    ],
  },
  {
    id: "celine-nova",
    name: "Celine Nova",
    homeUrl: "https://celinenova.com/blog",
    kind: "blog",
    accent: "#e58fa3",
    posts: [],
  },
];
