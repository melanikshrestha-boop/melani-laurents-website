export interface MkSection {
  id: string;
  label: string;
  href: string;
}

export const mkSections: MkSection[] = [
  { id: "mk", label: "About", href: "#mk" },
  { id: "chapters", label: "Chapters", href: "#chapters" },
  { id: "nerd", label: "Nerd sheet", href: "#nerd" },
  { id: "operate", label: "Operate", href: "#operate" },
];

export const googleScholarUrl =
  "https://scholar.google.com/citations?user=vke09BMAAAAJ&hl=en";

export interface ResumePublication {
  title: string;
  authors: string;
  venue: string;
  year: number;
  kind: "patent" | "article";
  citations?: number;
}

export interface ResumeExperience {
  role?: string;
  organization: string;
  period?: string;
  detail?: string;
}

export interface ResumeEducation {
  organization: string;
  detail?: string;
}

export interface ResumeSkillGroup {
  label: string;
  items: string[];
  placeholder?: boolean;
}

export interface ResumeScholar {
  name: string;
  affiliation: string;
  url: string;
}

export interface ResumeData {
  scholar: ResumeScholar;
  publications: ResumePublication[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkillGroup[];
}

/** Patents & profile from Google Scholar; experience/skills are editable placeholders. */
export const resumeData: ResumeData = {
  scholar: {
    name: "Melani Laurent S.",
    affiliation:
      "The Bronx High School of Science / Neuroscience Dept, Columbia University / NIURA",
    url: googleScholarUrl,
  },
  publications: [
    {
      title:
        "Charging and processing case for wireless earbuds with in-the-ear electroencephalography implementation",
      authors:
        "R Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
      venue: "US Patent App. 18/459,379",
      year: 2023,
      kind: "patent",
    },
    {
      title:
        "Earbud apparatus with integration of real time in-the-ear electroencephalography and electrode port that can simultaneously play audio via speaker housing",
      authors:
        "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
      venue: "US Patent App. 18/452,526",
      year: 2024,
      kind: "patent",
    },
    {
      title:
        "Electrode system for rubber ear tips with conductivity from n-doped silicone or conductive filaments in mixture for electroencephalography",
      authors:
        "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
      venue: "US Patent App. 18/454,063",
      year: 2023,
      kind: "patent",
    },
    {
      title:
        "In-ear electroencephalography electrodes with multi-parameter vitals monitor connectivity",
      authors:
        "RF Ahmed, S Huda, A Das, S Rajapaksha, M Shrestha, A Karim, C Kan, …",
      venue: "US Patent App. 18/452,561",
      year: 2024,
      kind: "patent",
    },
  ],
  experience: [
    {
      role: "Research & prototyping",
      organization: "NIURA · in-ear EEG",
      period: "—",
      detail:
        "Co-inventor on wireless earbud EEG patent family (see Scholar). Add titles, dates, and impact metrics here.",
    },
  ],
  education: [
    {
      organization: "The Bronx High School of Science",
      detail: "Per Google Scholar affiliation",
    },
    {
      organization: "Columbia University",
      detail: "Neuroscience Dept (affiliation on Scholar)",
    },
  ],
  skills: [
    {
      label: "Signals & neurotech",
      items: ["In-ear EEG", "Electrode systems", "Motion artifact awareness"],
      placeholder: false,
    },
    {
      label: "Build & research",
      items: ["Prototype validation", "Med-tech rigor", "Technical writing"],
      placeholder: true,
    },
    {
      label: "Stack",
      items: ["TypeScript", "Next.js", "Python (add level)"],
      placeholder: true,
    },
  ],
};

export const mkIntro = {
  headline: "Melani Laurent S.",
  paragraphs: [
    "I'm the kind of person who patents EEG earbuds and still chases golden hour like it's a full-time job. Med-tech builder, photographer, creator — I like my rigor with a side of sparkle.",
    "This page is the real me: story, nerdy metadata, and how I actually operate. No corporate speak, I promise.",
  ],
  draftVoice:
    "I think in systems, feel in light, and explain everything in public — med-tech because the stakes are real, photography because beauty matters, content because teaching is how I learn.",
};

export interface NerdFact {
  key: string;
  value: string;
  note?: string;
}

export const nerdFacts: NerdFact[] = [
  { key: "stack", value: "Next.js · GSAP · Lenis · TypeScript" },
  { key: "domain", value: "med-tech · signals · validation" },
  {
    key: "scholar",
    value: "Publications",
    note: "patents · Google Scholar",
  },
  { key: "signal_interest", value: "ECG · SNR · motion artifact rejection" },
  { key: "editor", value: "Cursor (Geist enjoyer)" },
  { key: "content", value: "Instagram · TikTok · photography" },
  { key: "reading", value: "systems papers · founder postmortems · FDA-adjacent docs" },
  { key: "currently", value: "clinical signal infra + RBCivosocial research thread" },
  { key: "hot_take", value: "a wrong abstraction costs more than a delayed launch" },
  { key: "easter_egg", value: "click anywhere — soft glow follows", note: "subtle" },
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
  mode: "editorial",
  cursor_tracking: "enabled",
  scroll_chapters: "6",
  last_build: "local",
};
