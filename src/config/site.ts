export const siteConfig = {
  name: "Celine Nova",
  domain: "celinenova.com",
  url: "https://celinenova.com",
  title: "Celine Nova",
  description:
    "Essays, books, daily inputs, art, and the things I build.",
  email: "celinenovaa@gmail.com",
  location: "Mostly LA, sometimes SF or NYC",
  /**
   * Bookshelf manifesto (home callout + /bookshelf).
   * Used to live under Daily — now owns this line.
   */
  bookshelfDescription:
    'The consolidation of memory is the art of writing what you listen to, read about, or converse with other people while adding your own "n+1" aspect on a consistent basis. Follow along if you want to grow your neuroplasticity by incremental daily learning on a variety of topics.',
  /** @deprecated kept for any leftover Daily surfaces */
  dailyDescription:
    'The consolidation of memory is the art of writing what you listen to, read about, or converse with other people while adding your own "n+1" aspect on a consistent basis. Follow along if you want to grow your neuroplasticity by incremental daily learning on a variety of topics.',
  dailySlogan: "",
  artPath: "/art",
  photographyPath: "/photography",
  /** Occasional long-form channel — an extension of the public archive. */
  youtubeTitle: "CELINE NOVA ON YOUTUBE",
  youtubeCadence: "about 1x/month",
  youtubeDescription:
    "Long-form videos for ideas that need more room: what I am learning, reading, building, and changing my mind about.",
  youtubeAudience: "An occasional extension of the archive.",
  youtubeSlogan: "watch on youtube",
  youtubePath: "/youtube",
  /** Original interview-show archive retained on the restored homepage. */
  podcastTitle: "CELINE NOVA S(HOW)",
  podcastCadence: "1x/week",
  podcastDescription:
    "Unfiltered, deep-end conversations. Topics that are favored: technology, human-made art, philosophy, history, psychology, robotics, business, space exploration, films, music, sports, mathematics, physics, economics, engineering, and the cool things that make up a human experience.",
  podcastAudience: "Made for curious people from all walks of life.",
  podcastSlogan: "thinking from first principles",
  podcastUrl: "/podcast",
  linkedinUrl: "https://www.linkedin.com/in/melanilaurents/",
  spotifyUrl:
    "https://open.spotify.com/user/21etydsnbqyqe7ekagfnqbhoq?si=c3c26ede4c8a46a5",
  /**
   * Header social row (home top-right). Fun stuff only — GitHub / LinkedIn / Scholar live on Builds.
   * X · YouTube · Spotify · Instagram · TikTok
   * hoverNote = personal popup on cursor only (omit until Melani writes one).
   */
  socialLinks: [
    {
      id: "x",
      label: "X",
      href: "https://x.com/melanilaurents",
      hoverNote: "opinions are my own 🤓👆",
    },
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/@Celine_Nova",
      hoverNote:
        "this platform basically raised and taught me everything I know. I want to contribute my creativity as well. Hope you enjoy :)",
    },
    {
      id: "spotify",
      label: "Spotify",
      href: "https://open.spotify.com/user/21etydsnbqyqe7ekagfnqbhoq?si=c3c26ede4c8a46a5",
      hoverNote:
        "I rarely make music, but listen to a lot. I listen and make podcasts simultaneously. Check it out.",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/melanilaurents/",
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://www.tiktok.com/@melanilaurents",
    },
  ],
  /** The single public index shown at the bottom of the home hero. */
  hubPortals: [
    { label: "Builds", href: "/projects", tagline: "Things I make" },
    { label: "Blog", href: "/blog", tagline: "Theses · public opinions" },
    { label: "Bookshelf", href: "/bookshelf", tagline: "Notes · highlights" },
    { label: "Art", href: "/photography", tagline: "Photo · sketches · shot by Celine" },
    { label: "Contact", href: "/contact", tagline: "Say hello" },
  ],
  /** HOME first on every page, then BUILDS · BLOG · BOOKSHELF · ART · CONTACT */
  nav: [
    { label: "Home", href: "/" },
    { label: "Builds", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Bookshelf", href: "/bookshelf" },
    { label: "Art", href: "/photography" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SocialId = (typeof siteConfig.socialLinks)[number]["id"];

export type NavItem = (typeof siteConfig.nav)[number];

export type HubPortal = (typeof siteConfig.hubPortals)[number];

export const deadPoetsQuote =
  "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race, and the human race is filled with passion.";
