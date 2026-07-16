export const siteConfig = {
  name: "Melani Laurent S.",
  domain: "melanilaurents.com",
  url: "https://melanilaurents.com",
  title: "Melani Laurent S.",
  description:
    "BCI researcher and neurotech builder — in-ear EEG, neural interfaces, clinical cinema, and art.",
  email: "itsmelanilaurents@gmail.com",
  location: "Mostly LA — sometimes SF or NYC",
  /** Daily letter — home archive + /daily page. */
  dailyDescription:
    "The consolidation of memory is the art of writing what you listen to, read about, or converse with other people while adding your own n+1 aspect on a consistent basis. Follow along if you want to grow your neuroplasticity by incremental daily learning on a variety of topics.",
  dailySlogan: "everything backed by neuroscience",
  artPath: "/art",
  photographyPath: "/photography",
  /** Weekly interview show — internal listening page. */
  podcastTitle: "MELANI LAURENT S(HOW)",
  podcastCadence: "1x/week",
  podcastDescription:
    "Unfiltered, deep-end conversations. Topics that are favored: technology, human-made art, philosophy, history, psychology, robotics, business, space exploration, films, music, sports, mathematics, physics, economics, engineering, and the cool things that make up a human experience.",
  /** Bold line on the home card — also the main “button” feel on hover */
  podcastAudience: "Made for curious people from all walks of life.",
  podcastSlogan: "everything backed by neuroscience",
  podcastUrl: "/podcast",
  linkedinUrl: "https://www.linkedin.com/in/melanilaurents/",
  spotifyUrl:
    "https://open.spotify.com/user/21etydsnbqyqe7ekagfnqbhoq?si=c3c26ede4c8a46a5",
  socialLinks: [
    {
      id: "x",
      label: "X",
      href: "https://x.com/MelaniShrestha",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/melanilaurents/",
    },
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/melanikshrestha-boop/melani-laurents-website",
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
    {
      id: "youtube",
      label: "YouTube",
      href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
    },
  ],
  /** Hub hero portals — podcast first, contact rendered separately in HomeHub. */
  hubPortals: [
    {
      label: "Podcast",
      href: "/podcast",
      tagline: "Melani",
    },
    { label: "Art", href: "/photography", tagline: "Visual signal · cinema" },
    { label: "Research", href: "/research", tagline: "BCI · neurotech · med-tech" },
    { label: "Daily", href: "/daily", tagline: "Neural log · daily", comingSoon: true },
  ],
  nav: [
    { label: "Podcast", href: "/podcast" },
    { label: "Art", href: "/photography" },
    { label: "Research", href: "/research" },
    { label: "Daily", href: "/daily" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SocialId = (typeof siteConfig.socialLinks)[number]["id"];

export type NavItem = (typeof siteConfig.nav)[number];

export type HubPortal = (typeof siteConfig.hubPortals)[number];

export const deadPoetsQuote =
  "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race, and the human race is filled with passion.";
