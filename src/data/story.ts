export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
}

/**
 * Public About story — founder + engineer path.
 * Not a med-school arc. Melani builds companies and systems; Celine Nova is the public name.
 */
export const storyChapters: StoryChapter[] = [
  {
    id: "origin",
    title: "01 — Origin",
    subtitle: "Systems, not scripts",
    body: [
      "I care about how hard systems work — software, hardware, organizations, and the people stuck inside them. Curiosity beat a career template.",
      "Bronx Science taught me to sit with difficulty. Building taught me that difficulty only counts if something real ships.",
    ],
  },
  {
    id: "names",
    title: "02 — Names",
    subtitle: "Melani · Celine Nova",
    body: [
      "Melani is who I am. Celine Nova is the public face of the work — writing, builds, photography, and the brand on this site.",
      "Same person. One legal life, one open archive. If you found me through school or LinkedIn, you’re looking at Melani. If you found the work, you’re looking at Celine.",
    ],
  },
  {
    id: "technical",
    title: "03 — Going deep",
    subtitle: "Engineering as instrument",
    body: [
      "I go deep on the unglamorous parts: data flow, interfaces that stay fast, reliability when nobody is watching, and tools that don’t lie.",
      "Code isn’t the destination. It’s how I test ideas, ship products, and learn faster than reading alone allows.",
    ],
  },
  {
    id: "build",
    title: "04 — Building in the open",
    subtitle: "Operator mode",
    body: [
      "I build my own stack first — Wonder (personal OS), this site, LensLab for photographers, Dream Life for the long game. Founder work, not homework demos.",
      "Entrepreneurship isn’t a costume. It’s noticing a painful process and choosing to fix it until it works every day.",
    ],
  },
  {
    id: "now",
    title: "05 — Now",
    subtitle: "Before the next chapter",
    body: [
      "I’m shipping in public: builds, bookshelf, essays, photography. The site is the portfolio and the practice.",
      "Recruitment is optional. Learning to build my own company is not. If you want the work, start at Builds. If you want the mind, start at Blog and Bookshelf.",
    ],
  },
];
