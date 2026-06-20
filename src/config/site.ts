export const siteConfig = {
  name: "Melani Laurent S.",
  domain: "melanilaurents.com",
  url: "https://melanilaurents.com",
  title: "Melani Laurent S.",
  description:
    "BCI researcher and neurotech builder — in-ear EEG, neural interfaces, clinical cinema, and art.",
  email: "hello@melanilaurents.com",
  location: "LA / SF / NYC",
  /** Pull quote on the dark hub hero — neuroscience ethos. */
  heroQuote:
    "Neuroscience remains such an exciting field because of the wealth of unanswered questions.",
  /** Daily letter — home archive + /daily page. */
  dailyDescription:
    "The consolidation of memory is the art of writing about what you listen to, read about, or conversed with other people on a consistent basis. Read these if you want incremental daily learning on a variety of topics (always backed by neuroscience) as I do, or just watch my neuroplasticity grow.",
  artPath: "/art",
  photographyPath: "/photography",
  /** Weekly interview show — Melani Shrestha Laurent Show (YouTube + audio feeds). */
  podcastTitle: "Melani Shrestha Laurent Show",
  podcastTagline: "Neuroscience & neurotechnology — from lab to bedside",
  podcastCadence: "1x/week",
  podcastDescription:
    "Melani interviews neurosurgeons, neuroscientists, and BCI builders on the frontier of brain-computer interfaces — in-ear EEG, neural implants, and what it takes to bring neurotech to clinic.",
  podcastUrl: "https://www.youtube.com/@ResetYourMind.-fb5nn",
  linkedinUrl: "https://www.linkedin.com/in/melanilaurents/",
  socialLinks: [
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/melanilaurents/",
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
    {
      id: "x",
      label: "X",
      href: "https://x.com/MelaniShrestha",
    },
  ],
  /** Hub hero portals — podcast first, contact rendered separately in HomeHub. */
  hubPortals: [
    {
      label: "Podcast",
      href: "https://www.youtube.com/@ResetYourMind.-fb5nn",
      external: true,
      tagline: "Melani Shrestha Laurent Show",
    },
    { label: "Research", href: "/research", tagline: "BCI · neurotech · med-tech" },
    { label: "Daily", href: "/daily", tagline: "Neural log · daily", comingSoon: true },
    { label: "Art", href: "/photography", tagline: "Visual signal · cinema" },
  ],
  nav: [
    { label: "Podcast", href: "https://www.youtube.com/@ResetYourMind.-fb5nn" },
    { label: "Research", href: "/research" },
    { label: "Daily", href: "/daily" },
    { label: "Art", href: "/photography" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type SocialId = (typeof siteConfig.socialLinks)[number]["id"];

export type NavItem = (typeof siteConfig.nav)[number];

export type HubPortal = (typeof siteConfig.hubPortals)[number];

export const deadPoetsQuote =
  "We don't read and write poetry because it's cute. We read and write poetry because we are members of the human race, and the human race is filled with passion.";
