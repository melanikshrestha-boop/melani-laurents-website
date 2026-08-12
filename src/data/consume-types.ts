/**
 * Everything Melani consumes — tracked, with a stance and a reason.
 * Public can respond on linked discussion threads.
 */

export type ConsumeMedium =
  | "book"
  | "paper"
  | "film"
  | "show"
  | "podcast"
  | "music"
  | "essay"
  | "product"
  | "conversation"
  | "place"
  | "build"
  | "other";

/** Her position — short, not a star rating */
export type Stance =
  | "building-on" // using this
  | "agree"
  | "disagree"
  | "curious"
  | "rethinking"
  | "skip"; // consumed, not for me

export type ConsumeEntry = {
  id: string;
  /** What it is */
  title: string;
  medium: ConsumeMedium;
  /** Creator / author / brand */
  by?: string;
  date: string; // YYYY-MM-DD when she engaged
  stance: Stance;
  /** Her take — the opinion others can argue with */
  take: string;
  /** Mindfulness: why this got her attention / time */
  why?: string;
  /** Optional outbound */
  href?: string;
  /** Link to a blog post slug if she expanded this into an essay */
  blogSlug?: string;
  /** Discussion thread id (defaults to consume:{id}) */
  threadId?: string;
  tags?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  /** Short lede under the title */
  lede: string;
  /** Full essay body — plain paragraphs, markdown-lite later */
  body: string[];
  /** Her locked stance on the thesis */
  stance: Stance;
  /** One-line thesis others react to */
  thesis: string;
  /** Related consumption entries */
  consumeIds?: string[];
  tags?: string[];
  /** Discussion thread — defaults to blog:{slug} */
  threadId?: string;
  /** Work-in-progress — still listed, labeled Draft */
  draft?: boolean;
};

export type PublicOpinion = {
  id: string;
  threadId: string;
  /** Display name (no accounts required for v1) */
  name: string;
  stance: Stance;
  body: string;
  createdAt: string; // ISO
  /** Optional site or X handle */
  link?: string;
};

export const STANCE_LABEL: Record<Stance, string> = {
  "building-on": "Building on this",
  agree: "Agree",
  disagree: "Disagree",
  curious: "Curious",
  rethinking: "Rethinking",
  skip: "Not for me",
};

export const MEDIUM_LABEL: Record<ConsumeMedium, string> = {
  book: "Book",
  paper: "Paper",
  film: "Film",
  show: "Show",
  podcast: "Podcast",
  music: "Music",
  essay: "Essay",
  product: "Product",
  conversation: "Conversation",
  place: "Place",
  build: "Build",
  other: "Other",
};
