export type DesignSite = {
  id: string;
  title: string;
  href: string;
  previewImage: string;
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
];
