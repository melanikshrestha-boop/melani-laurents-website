export interface MkSection {
  id: string;
  label: string;
  href: string;
}

export const mkSections: MkSection[] = [
  { id: "mk", label: "M.K.", href: "#mk" },
  { id: "chapters", label: "Chapters", href: "#chapters" },
  { id: "nerd", label: "Nerd sheet", href: "#nerd" },
  { id: "operate", label: "Operate", href: "#operate" },
  { id: "spec", label: "Spec", href: "#spec" },
];

export const mkIntro = {
  headline: "Melani Kirstein",
  paragraphs: [
    "I build at the intersection of med-tech, research, and content — less portfolio, more field notes from someone who reads signal traces for fun.",
    "This page is M.K.: my story, the nerdy metadata, and how I actually operate. Jump below if you only have thirty seconds.",
  ],
  draftVoice:
    "I think in systems, prototype in code, and explain in public — med-tech because the stakes are real, content because teaching is how I learn, research because rigor is the only moat that compounds.",
};

export interface NerdFact {
  key: string;
  value: string;
  note?: string;
}

export const nerdFacts: NerdFact[] = [
  { key: "stack", value: "Next.js · GSAP · Lenis · TypeScript" },
  { key: "domain", value: "med-tech · signals · validation" },
  { key: "signal_interest", value: "ECG · SNR · motion artifact rejection" },
  { key: "editor", value: "Cursor (Geist enjoyer)" },
  { key: "content", value: "Instagram · TikTok · long-form research memos" },
  { key: "github", value: "melanikshrestha-boop" },
  { key: "reading", value: "systems papers · founder postmortems · FDA-adjacent docs" },
  { key: "currently", value: "clinical signal infra + RBCivosocial research thread" },
  { key: "hot_take", value: "a wrong abstraction costs more than a delayed launch" },
  { key: "easter_egg", value: "this site background listens to your cursor", note: "try it" },
];

export const principles = [
  {
    title: "Rigor before scale",
    body: "In med-tech, a wrong abstraction costs more than a delayed launch. I optimize for correctness first, then velocity.",
  },
  {
    title: "Build to learn",
    body: "Code is an instrument for testing hypotheses. I ship prototypes to understand problems, not to perform building.",
  },
  {
    title: "Make the next person faster",
    body: "Every tool, doc, and system should reduce friction for whoever comes after — including future me.",
  },
];

export const specReadout: Record<string, string> = {
  status: "online",
  mode: "clinical_cinema",
  cursor_tracking: "enabled",
  scroll_chapters: "5",
  last_build: "local",
};
