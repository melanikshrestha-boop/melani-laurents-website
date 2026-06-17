export interface StoryChapter {
  id: string;
  title: string;
  subtitle: string;
  body: string[];
}

export const storyChapters: StoryChapter[] = [
  {
    id: "origin",
    title: "01 — Origin",
    subtitle: "Where curiosity met constraint",
    body: [
      "I didn't set out to work in med-tech. I set out to understand systems — biological, technical, organizational — and kept finding myself at the intersection where those systems fail people.",
      "Early on, I learned that the gap between what medicine promises and what infrastructure delivers is not a knowledge problem. It's a build problem.",
    ],
  },
  {
    id: "technical",
    title: "02 — Going Deep",
    subtitle: "Technical foundations",
    body: [
      "I went deep on the hard parts: signal processing, data pipelines, validation workflows, the unglamorous infrastructure that makes clinical tools trustworthy.",
      "Code was never the destination. It was the instrument — a way to test hypotheses, ship prototypes, and learn faster than reading alone allows.",
    ],
  },
  {
    id: "entrepreneurial",
    title: "03 — Building in the Open",
    subtitle: "Operator mode",
    body: [
      "Entrepreneurship, for me, is not about startups as identity. It's about seeing a process that's painful when it doesn't have to be, and choosing to fix it.",
      "I've worked across stealth builds, open-source tools, and research collaborations — always with the same filter: does this make the next person’s work easier or harder?",
    ],
  },
  {
    id: "medtech",
    title: "04 — Med-Tech Lens",
    subtitle: "Why this domain",
    body: [
      "Med-tech sits at the edge of what's possible and what's regulated, what's humane and what's scalable. That tension is where I do my best work.",
      "I'm drawn to problems where a wrong abstraction costs more than a delayed launch — where rigor isn't optional and creativity isn't decorative.",
    ],
  },
  {
    id: "now",
    title: "05 — Now",
    subtitle: "What I'm building toward",
    body: [
      "Today I'm focused on research-grade tooling, clinical signal infrastructure, and the connective tissue between lab bench and real-world deployment.",
      "This site is where I document that work — not as a personal diary, but as field notes for anyone building in the same direction.",
    ],
  },
];
