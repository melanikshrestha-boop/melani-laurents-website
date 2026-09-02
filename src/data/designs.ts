export type DesignSite = {
  id: string;
  title: string;
  href: string;
  previewImage: string;
  /** Hover line she dictated. Never invent one. */
  story?: string;
  /** Live iframe in the card — scroll and click the real site. */
  live?: boolean;
};

/** Sites Melani designed. Titles + front stills only unless she dictates more. */
export const designs: DesignSite[] = [
  {
    id: "lunar-glow-dev",
    title: "Lunar Glow Dev",
    href: "https://lunaraglowsalon.lovable.app",
    previewImage: "/builds/designs/lunar-glow-dev.png",
    live: true,
  },
  {
    id: "celine-nova",
    title: "Celine Nova.",
    href: "https://celinenova.vercel.app",
    previewImage: "/builds/designs/celine-nova.jpg",
    live: true,
  },
  {
    id: "celinenovalinks",
    title: "celinenovalinks",
    href: "https://celinenovalinks.vercel.app",
    previewImage: "/builds/designs/celinenovalinks.jpg",
    story:
      "I didn't understand the exact point of linktree aside from just stacking links from top of each other so I just created my own version of it for free to add under social handles.",
    live: true,
  },
];
