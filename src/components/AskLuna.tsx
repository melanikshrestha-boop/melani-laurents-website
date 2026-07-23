"use client";

import {
  FormEvent,
  PointerEvent as ReactPointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { LANG_OPTIONS, useI18n, type Lang } from "@/lib/i18n";
import { lunara } from "@/lib/lunara";
import {
  formatCategoryExpert,
  formatExpertReply,
  getExpertByName,
  SERVICE_EXPERTS,
} from "@/lib/lunara-expertise";
import { lunaCopy, openMessage, starterChips } from "@/lib/luna-copy";

/* ═══════════════════════════════════════════════════════════════════
   Luna — smart in-chat booking (service → time → phone → done)
   Understands intent first. Never invents a random facial for “idk”.
   ═══════════════════════════════════════════════════════════════════ */

type ServicePick = {
  categoryId: string;
  categoryTitle: string;
  name: string;
  price: string;
  time: string;
};

type Chip = { label: string; value: string };

type ChatMessage = {
  id: string;
  role: "luna" | "user";
  text: string;
  chips?: Chip[];
  picks?: ServicePick[];
  times?: string[];
  showPhone?: boolean;
  showEg?: boolean; // show “e.g.” before example chips
  summary?: {
    service: string;
    price: string;
    slot: string;
    phone: string;
  };
};

type Draft = {
  service: ServicePick | null;
  slot: string | null;
  phone: string;
};

type Intent =
  | "greeting"
  | "unsure"
  | "hours"
  | "offer"
  | "loyalty"
  | "reset"
  | "pick_service"
  | "pick_time"
  | "phone"
  | "book_flow"
  | "category"
  | "explain"
  | "chat"
  | "unknown";

/** What we were just talking about — so “that’s cool” isn’t a dead end */
type ChatTopic =
  | "loyalty"
  | "wax"
  | "brows"
  | "lashes"
  | "facials"
  | "expert"
  | "booking"
  | "hours"
  | "open"
  | "none";

const ALL: ServicePick[] = lunara.services.flatMap((g) =>
  g.items.map((item) => ({
    categoryId: g.id,
    categoryTitle: g.title,
    name: item.name,
    price: item.price,
    time: item.time,
  })),
);

const TIMES = [...lunara.bookingTimes];

// Shown after Luna needs a category (not on first open)
const CATEGORY_CHIPS: Chip[] = [
  { label: "Brows", value: "eyebrows" },
  { label: "Lashes", value: "lashes" },
  { label: "Waxing", value: "waxing" },
  { label: "Facial", value: "facial" },
];

// Default EN starters (live open uses language-aware starterChips)
const OPENING_CHIPS: Chip[] = [
  { label: "Help me choose", value: "help me choose" },
  {
    label: "How free points work",
    value: "Explain the loyalty program",
  },
];

/** Always at most 2 chips — Grok-style tight follow-ups */
function two(chips: Chip[]): Chip[] {
  const seen = new Set<string>();
  const out: Chip[] = [];
  for (const c of chips) {
    if (!c?.label || !c?.value) continue;
    if (seen.has(c.value)) continue;
    seen.add(c.value);
    out.push(c);
    if (out.length >= 2) break;
  }
  return out;
}

/**
 * Pick 2 follow-ups tightly tied to what they just asked / we just said.
 * Never dump a menu of unrelated options.
 */
function relatedChips(ctx: {
  topic:
    | "open"
    | "loyalty"
    | "loyalty-status"
    | "loyalty-known"
    | "wax-where"
    | "wax-body"
    | "wax-face"
    | "brows"
    | "lashes"
    | "facials"
    | "expert-service"
    | "expert-category"
    | "unsure"
    | "booked"
    | "generic";
  serviceName?: string;
  categoryId?: string;
  points?: number;
}): Chip[] {
  switch (ctx.topic) {
    case "open":
      return two(OPENING_CHIPS);
    case "loyalty":
      return two([
        { label: "Check my points", value: "__check_points__" },
        { label: "Book brow threading", value: "pick:Brow Threading" },
      ]);
    case "loyalty-status":
      return two([
        { label: "Book brow threading", value: "pick:Brow Threading" },
        {
          label: "Book chocolate wax",
          value: "I want a chocolate wax, schedule it.",
        },
      ]);
    case "loyalty-known":
      return two([
        { label: "Book brow threading", value: "pick:Brow Threading" },
        {
          label: "Book chocolate wax",
          value: "I want a chocolate wax, schedule it.",
        },
      ]);
    case "wax-where":
      return two([
        { label: "Body", value: "wax on body" },
        { label: "Face", value: "wax on face" },
      ]);
    case "wax-body":
      return two([
        { label: "Legs", value: "wax legs next" },
        { label: "Arms", value: "wax arms next" },
      ]);
    case "wax-face":
      return two([
        { label: "Brows", value: "pick:Brow Wax" },
        { label: "Lip", value: "pick:Lip" },
      ]);
    case "brows":
      return two([
        { label: "Brow wax · $40", value: "pick:Brow Wax" },
        { label: "Threading · $25", value: "pick:Brow Threading" },
      ]);
    case "lashes":
      return two([
        { label: "Lift + tint · $70", value: "pick:Lash Lift + Tint" },
        { label: "Extensions · $150", value: "pick:Classic Lash Extensions" },
      ]);
    case "facials":
      return two([
        { label: "Hydra Medic", value: "pick:Hydra Medic" },
        { label: "Herbal facial", value: "pick:Herbal Facial" },
      ]);
    case "expert-service": {
      const name = ctx.serviceName || "Brow Wax";
      const cat = ctx.categoryId || "waxing";
      const sibling =
        SERVICE_EXPERTS.find(
          (e) => e.categoryId === cat && e.name !== name,
        )?.name || "Brow Threading";
      return two([
        { label: `Book ${name}`, value: `pick:${name}` },
        { label: `What’s in ${sibling}?`, value: `explain ${sibling}` },
      ]);
    }
    case "expert-category":
      if (ctx.categoryId === "facials") {
        return two([
          { label: "What’s in Hydra Medic?", value: "explain Hydra Medic" },
          { label: "What’s in Seaweed?", value: "explain Seaweed" },
        ]);
      }
      if (ctx.categoryId === "lashes") {
        return two([
          { label: "Explain lash lift", value: "explain Lash Lift + Tint" },
          {
            label: "Explain extensions",
            value: "explain Classic Lash Extensions",
          },
        ]);
      }
      if (ctx.categoryId === "brows") {
        return two([
          {
            label: "Explain brow lamination",
            value: "explain Brow Lamination + Shaping",
          },
          { label: "Explain brow tint", value: "explain Brow Tint" },
        ]);
      }
      return two([
        { label: "Body wax", value: "wax on body" },
        { label: "Face wax", value: "wax on face" },
      ]);
    case "unsure":
      return two([
        { label: "Brows", value: "I want brows" },
        { label: "Waxing", value: "I want a chocolate wax, schedule it." },
      ]);
    case "booked":
      return two([
        { label: "Add another booking", value: "__reset__" },
        { label: "Check my points", value: "__check_points__" },
      ]);
    default:
      return two([
        { label: "Book something", value: "I want to book" },
        { label: "Explain loyalty", value: "Explain the loyalty program" },
      ]);
  }
}

/** Translate chip labels for the active language (values stay English for the engine) */
function localizeChips(chips: Chip[] | undefined, lang: Lang): Chip[] | undefined {
  if (!chips?.length) return chips;
  const c = lunaCopy(lang);
  const map: Record<string, string> = {
    "Check my points": c.chipCheckPoints,
    "Book brow threading": c.chipBookThreading,
    "Book chocolate wax": c.chipBookWax,
    "Add another booking": c.chipAddAnother,
    "Book something": c.chipBookSomething,
    "Explain loyalty": c.chipExplainLoyalty,
    "Explain the loyalty program": c.chipLoyalty,
    Brows: c.chipBrows,
    Waxing: c.chipWaxing,
    Body: c.chipBody,
    Face: c.chipFace,
    Legs: c.chipLegs,
    Arms: c.chipArms,
    Lip: c.chipLip,
    "Body wax": c.chipBody,
    "Face wax": c.chipFace,
    "help me choose": c.chipHelp,
    "Help me choose": c.chipHelp,
    "How free points work": c.chipLoyalty,
    "I want brows": c.chipBrows,
    "I want a chocolate wax, schedule it.": c.chipWax,
  };
  return chips.map((chip) => ({
    ...chip,
    label: map[chip.label] || map[chip.value] || chip.label,
  }));
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function useDraft() {
  const [draft, setDraftState] = useState<Draft>({
    service: null,
    slot: null,
    phone: "",
  });
  const ref = useRef(draft);
  function setDraft(next: Draft) {
    ref.current = next;
    setDraftState(next);
  }
  return { draft, setDraft, draftRef: ref };
}

/* ── Normalize messy human text ──────────────────────────────────── */

function normalize(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9:.\s+\-/@]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Fix common typos / shorthand before matching */
function fixTypos(s: string): string {
  let t = ` ${s} `;
  const swaps: Array<[RegExp, string]> = [
    [/\bidk\b/g, "i don't know"],
    [/\bidc\b/g, "i don't care"],
    [/\bwya\b/g, "where are you"],
    [/\bpls\b/g, "please"],
    [/\bplz\b/g, "please"],
    [/\bthx\b/g, "thanks"],
    [/\bty\b/g, "thank you"],
    [/\bu\b/g, "you"],
    [/\bur\b/g, "your"],
    [/\bnvm\b/g, "never mind"],
    [/\bappt\b/g, "appointment"],
    [/\bapointment\b/g, "appointment"],
    [/\bappoitment\b/g, "appointment"],
    [/\beybrow\b/g, "eyebrow"],
    [/\beybrows\b/g, "eyebrows"],
    [/\bbrows?\b/g, "brows"], // keep brows
    [/\blases\b/g, "lashes"],
    [/\blashs\b/g, "lashes"],
    [/\bfacia\b/g, "facial"],
    [/\bfacials\b/g, "facial"],
    [/\bwaxxing\b/g, "waxing"],
    [/\bhel+p\b/g, "help"],
    [/\belp\b/g, "help"], // "elp me choose"
    [/\bcho+se\b/g, "choose"],
    [/\bpick\b/g, "choose"],
    [/\breccomend\b/g, "recommend"],
    [/\brecomend\b/g, "recommend"],
    [/\btom+or+ow\b/g, "tomorrow"],
    [/\btmrw\b/g, "tomorrow"],
    [/\btmr\b/g, "tomorrow"],
    [/\basap\b/g, "as soon as possible"],
  ];
  for (const [re, to] of swaps) t = t.replace(re, ` ${to} `);
  return t.replace(/\s+/g, " ").trim();
}

/** Casual friend talk — not a booking command */
function isCasualChat(n: string): boolean {
  if (!n || looksLikePhone(n)) return false;
  if (hasServiceSignal(n) || wantsBook(n) || parseTimeFromText(n)) return false;
  if (isExplainIntent(n)) return false;
  // Short vibes / reactions / thanks
  if (
    /^(that'?s cool|thats cool|cool|nice|ok|okay|k|kk|bet|dope|lit|fire|love it|love that|awesome|great|amazing|sick|tight|facts|true|word|for sure|sounds good|perfect|alright|got it|makes sense|interesting|oh|wow|haha|lol|lmao|hehe|yes|yeah|yep|yup|no|nah|hmm|hm|mhm|sure|thanks|thank you|ty|thx|appreciate it|same|idc|whatever|fr|real|bet bet)[\s!.?]*$/i.test(
      n,
    )
  ) {
    return true;
  }
  // Short message with no service words = chat, not “unknown”
  const words = n.split(/\s+/).filter(Boolean);
  return words.length <= 4 && n.length <= 28;
}

/* ── Intent detection (runs BEFORE menu matching) ────────────────── */

function detectIntent(raw: string, draft: Draft): Intent {
  const n = fixTypos(normalize(raw));

  if (raw.startsWith("pick:") || raw.startsWith("time:") || raw.startsWith("__")) {
    if (raw.startsWith("pick:")) return "pick_service";
    if (raw.startsWith("time:")) return "pick_time";
    if (raw === "__reset__") return "reset";
  }

  // If we're waiting on phone, almost anything digit-ish is phone
  if (draft.service && draft.slot && !draft.phone) {
    if (looksLikePhone(raw) || /\b(phone|number|call me|text me)\b/.test(n)) {
      return "phone";
    }
    // still might be changing time/service — fall through carefully
    if (parseTimeFromText(n) && !looksLikePhone(raw)) return "pick_time";
  }

  // Waiting on time only
  if (draft.service && !draft.slot) {
    if (parseTimeFromText(n) || TIMES.some((t) => t.toLowerCase() === n)) {
      return "pick_time";
    }
  }

  // Pure greeting (short)
  if (
    /^(hi|hey|hello|yo|sup|hiya|good morning|good afternoon|good evening)[\s!.]*$/.test(
      n,
    )
  ) {
    return "greeting";
  }

  // Friend chat / reactions (“thats cool”, “ok”, “thanks”) — before unknown
  if (isCasualChat(n)) {
    return "chat";
  }

  // Unsure / help me choose — MUST beat service matching
  if (
    /\b(i don't know|not sure|unsure|help me choose|help me pick|help choose|recommend|suggest|what should i|idk|no idea|whatever|surprise me|you choose|you pick)\b/.test(
      n,
    ) ||
    /^(help|help me|choose|options)\??$/.test(n)
  ) {
    return "unsure";
  }

  if (
    /\b(hour|hours|open|opening|close|closed|address|where are you|location|map|directions|phone number|call you)\b/.test(
      n,
    )
  ) {
    return "hours";
  }

  if (/\b(first time|new client|new customer|discount|20%|twenty percent)\b/.test(n)) {
    return "offer";
  }

  if (
    /\b(loyalty|reward|punch card|visit card|loyalty program|points?\b.*\b10|free eyebrow threading|free brow threading|check my points|my points|my loyalty)\b/.test(
      n,
    ) ||
    /\bexplain (the )?loyalty\b/.test(n)
  ) {
    return "loyalty";
  }

  // Expert explain / ingredients — before booking flow
  if (isExplainIntent(n) || raw.startsWith("explain ")) {
    return "explain";
  }

  // Broad category words only
  if (/^(brows?|eyebrows?|lashes?|waxing|wax|facials?)$/.test(n)) {
    return "category";
  }

  // Has booking language and/or a service signal
  if (
    hasServiceSignal(n) ||
    /\b(book|appointment|schedule|reserve|come in)\b/.test(n) ||
    parseTimeFromText(n)
  ) {
    return "book_flow";
  }

  // Greeting + more words still might be greeting-only fluff
  if (/^(hi|hey|hello)\b/.test(n) && !hasServiceSignal(n) && !parseTimeFromText(n)) {
    return "greeting";
  }

  return "unknown";
}

function hasServiceSignal(n: string): boolean {
  return /\b(brow|brows|eyebrow|eyebrows|lash|lashes|eyelash|wax|waxing|facial|skin|leg|legs|arm|arms|bikini|underarm|lip|chin|tint|lift|lamination|extension|cluster|hydra|threading|tweeze|glow|acne|chocolate|ingredient|ingredients|serum|mask)\b/.test(
    n,
  );
}

/** “what’s in…”, “explain…”, “tell me about…”, ingredients questions */
function isExplainIntent(n: string): boolean {
  return (
    /\b(explain|what's in|whats in|what is in|ingredients?|tell me about|how does .+ work|what is a|what is the|what does .+ include|difference between|vs\.?|versus)\b/.test(
      n,
    ) ||
    /\b(expert|break down|details on|info on)\b/.test(n)
  );
}

function findExpertMatch(query: string) {
  const n = fixTypos(normalize(query))
    .replace(/^(explain|tell me about|what is|what's|whats|details on|info on)\s+/i, "")
    .replace(/\?+$/, "")
    .trim();

  // Exact / near name
  const exact = getExpertByName(n);
  if (exact) return { type: "service" as const, expert: exact };

  // Score experts by word overlap
  let best: (typeof SERVICE_EXPERTS)[number] | null = null;
  let bestScore = 0;
  for (const e of SERVICE_EXPERTS) {
    const hay = e.name.toLowerCase();
    let score = 0;
    if (n.includes(hay) || hay.includes(n)) score += 20;
    for (const w of hay.split(/[\s+/]+/).filter((x) => x.length > 2)) {
      if (n.includes(w)) score += 4;
    }
    // common aliases
    if (/\bchocolate\b/.test(n) && e.categoryId === "waxing") score += 6;
    if (/\bhydra medic\b/.test(n) && e.name === "Hydra Medic") score += 15;
    if (/\bhydra dew\b/.test(n) && e.name === "Hydra Dew") score += 15;
    if (/\blamination\b/.test(n) && e.name.includes("Lamination")) score += 10;
    if (/\blash lift\b/.test(n) && e.name.includes("Lash Lift")) score += 12;
    if (/\bextension\b/.test(n) && e.name.includes("Extensions")) score += 10;
    if (/\bclassic facial\b/.test(n) && e.name === "Classic Facial") score += 12;
    if (score > bestScore) {
      bestScore = score;
      best = e;
    }
  }
  if (best && bestScore >= 8) return { type: "service" as const, expert: best };

  // Category overview
  const cat = detectCategoryId(n);
  if (cat && (isExplainIntent(fixTypos(normalize(query))) || n === cat || n.includes(cat))) {
    return { type: "category" as const, categoryId: cat };
  }
  if (/\b(waxing|wax|chocolate wax)\b/.test(n) && !best) {
    return { type: "category" as const, categoryId: "waxing" };
  }
  if (/\b(facials?|skin)\b/.test(n) && !best) {
    return { type: "category" as const, categoryId: "facials" };
  }
  if (/\b(brows?|eyebrows?)\b/.test(n) && !best) {
    return { type: "category" as const, categoryId: "brows" };
  }
  if (/\b(lashes?|eyelash)\b/.test(n) && !best) {
    return { type: "category" as const, categoryId: "lashes" };
  }

  return null;
}

/* ── Service matching (only when intent says so) ─────────────────── */

const SERVICE_HINTS: Array<{
  words: string[];
  nameBoost: string[];
  category?: string;
  weight: number;
}> = [
  {
    words: ["eyebrow", "eyebrows", "brow", "brows"],
    nameBoost: ["brow"],
    category: "brows",
    weight: 10,
  },
  {
    words: ["lash", "lashes", "eyelash", "eyelashes"],
    nameBoost: ["lash"],
    category: "lashes",
    weight: 10,
  },
  {
    words: ["extension", "extensions"],
    nameBoost: ["extension"],
    category: "lashes",
    weight: 8,
  },
  {
    words: ["cluster", "clusters"],
    nameBoost: ["cluster"],
    category: "lashes",
    weight: 8,
  },
  // Generic “wax/waxing” — prefer body; face only when they say face/lip/chin/brow
  {
    words: ["wax", "waxing"],
    nameBoost: ["leg", "arm", "bikini", "underarm"],
    category: "waxing",
    weight: 6,
  },
  {
    words: ["chocolate wax", "chocolate"],
    nameBoost: ["leg", "arm", "bikini", "underarm", "full arm", "half arm", "lower leg", "upper leg"],
    category: "waxing",
    weight: 10,
  },
  {
    words: ["leg", "legs"],
    nameBoost: ["leg"],
    category: "waxing",
    weight: 9,
  },
  {
    words: ["arm", "arms"],
    nameBoost: ["arm"],
    category: "waxing",
    weight: 9,
  },
  {
    words: ["bikini"],
    nameBoost: ["bikini"],
    category: "waxing",
    weight: 10,
  },
  {
    words: ["facial", "face", "skin", "glow"],
    nameBoost: ["facial", "hydra", "gold", "seaweed", "herbal", "biolight", "express", "classic", "four", "eye"],
    category: "facials",
    weight: 7,
  },
  {
    words: ["hydrate", "hydrating", "dry", "dewy", "moisture"],
    nameBoost: ["hydra dew", "dew", "hydra"],
    category: "facials",
    weight: 9,
  },
  {
    words: ["acne", "breakout", "clear", "congested"],
    nameBoost: ["medic", "gold", "deep"],
    category: "facials",
    weight: 9,
  },
  {
    words: ["tired eyes", "eye bags", "dark circle", "under eye"],
    nameBoost: ["eye optimum", "eye"],
    category: "facials",
    weight: 10,
  },
  {
    words: ["quick", "fast", "express", "short"],
    nameBoost: ["express", "tint", "center", "lip", "brow wax"],
    weight: 4,
  },
  {
    words: ["lift"],
    nameBoost: ["lift"],
    weight: 7,
  },
  {
    words: ["lamination", "laminate"],
    nameBoost: ["lamination"],
    weight: 9,
  },
  {
    words: ["tint"],
    nameBoost: ["tint"],
    weight: 7,
  },
  {
    words: ["threading", "thread"],
    nameBoost: ["thread"],
    category: "waxing",
    weight: 9,
  },
  {
    words: ["cleaned up", "cleanup", "shape", "shaping", "done"],
    nameBoost: ["brow wax", "shaping", "wax"],
    weight: 3,
  },
];

const MIN_SCORE = 8; // below this = no match (stops “idk” → Hydra Medic)

/** Chocolate hard wax is the product — not “brow wax”. Guide the body area. */
function isChocolateWaxRequest(q: string): boolean {
  return (
    /\bchocolate\b/.test(q) ||
    /\bchocolate hard wax\b/.test(q) ||
    /\bhard wax\b/.test(q)
  );
}

function hasSpecificWaxArea(q: string): boolean {
  return /\b(brow|brows|eyebrow|lip|chin|underarm|arm|arms|leg|legs|bikini|face|body|full arm|half arm|lower leg|upper leg)\b/.test(
    q,
  );
}

function scoreService(query: string, s: ServicePick): number {
  const q = fixTypos(normalize(query));
  const hay = `${s.name} ${s.categoryTitle}`.toLowerCase();
  let score = 0;

  // Exact / near-exact name
  const name = s.name.toLowerCase();
  if (q === name || q.includes(name)) score += 20;
  for (const word of name.split(/[\s+/]+/).filter((w) => w.length > 2)) {
    if (q.includes(word)) score += 3;
  }

  for (const hint of SERVICE_HINTS) {
    if (!hint.words.some((w) => q.includes(w))) continue;
    if (hint.nameBoost.some((b) => hay.includes(b))) score += hint.weight;
    if (hint.category && s.categoryId === hint.category) score += 2;
  }

  // Chocolate wax alone is NOT brow/lip/chin — push body services only
  if (isChocolateWaxRequest(q) && !hasSpecificWaxArea(q)) {
    if (/\b(brow|lip|chin|thread|tweeze)\b/.test(name)) score -= 20;
    if (/\b(arm|leg|underarm|bikini)\b/.test(name)) score += 12;
  }

  // “eyebrows done” default toward Brow Wax
  if (/\b(eyebrow|eyebrows|brows)\b/.test(q) && !/\b(tint|laminat|lift)\b/.test(q)) {
    if (s.name === "Brow Wax") score += 6;
    if (s.name === "Brow Threading") score += 2;
  }

  // “lash lift” exact preference
  if (/\blash lift\b/.test(q) && s.name.includes("Lash Lift")) score += 12;

  // duration preference
  if (/\b(quick|fast|express|under 30|30 min)\b/.test(q)) {
    const mins = parseInt(s.time, 10);
    if (!Number.isNaN(mins) && mins <= 30) score += 4;
    if (!Number.isNaN(mins) && mins > 60) score -= 3;
  }

  return score;
}

function findServices(query: string, limit = 5): ServicePick[] {
  const ranked = ALL.map((s) => ({ s, score: scoreService(query, s) }))
    .filter((r) => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const out: ServicePick[] = [];
  for (const r of ranked) {
    if (seen.has(r.s.name)) continue;
    seen.add(r.s.name);
    out.push(r.s);
    if (out.length >= limit) break;
  }
  return out;
}

function detectCategoryId(n: string): string | null {
  if (/\b(brow|brows|eyebrow|eyebrows)\b/.test(n)) {
    // brow wax is still brows intent for “get brows done”; waxing if explicit body wax
    if (/\b(leg|arm|bikini|underarm|body)\b/.test(n)) return "waxing";
    if (/\bwax\b/.test(n) && !/\bbrow wax\b/.test(n) && /\b(full|half|leg)\b/.test(n))
      return "waxing";
    return "brows";
  }
  if (/\b(lash|lashes|eyelash)\b/.test(n)) return "lashes";
  if (/\b(wax|waxing|leg|bikini|underarm)\b/.test(n)) return "waxing";
  if (/\b(facial|skin|glow|hydra|acne)\b/.test(n)) return "facials";
  if (n === "brows" || n === "eyebrows") return "brows";
  if (n === "lashes") return "lashes";
  if (n === "waxing" || n === "wax") return "waxing";
  if (n === "facial" || n === "facials") return "facials";
  return null;
}

/* ── Time + phone ────────────────────────────────────────────────── */

function parseTimeFromText(text: string): string | null {
  const t = fixTypos(normalize(text));

  if (/\bnoon\b/.test(t)) return nearestSlot(12, 0);

  const m12 = t.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/);
  if (m12) {
    let hour = parseInt(m12[1], 10);
    const minute = m12[2] ? parseInt(m12[2], 10) : 0;
    const ap = m12[3].replace(/\./g, "");
    if (ap.startsWith("p") && hour < 12) hour += 12;
    if (ap.startsWith("a") && hour === 12) hour = 0;
    return nearestSlot(hour, minute);
  }

  const m24 = t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (m24) return nearestSlot(parseInt(m24[1], 10), parseInt(m24[2], 10));

  const bare = t.match(/\b(?:at|around|by|for)\s+(\d{1,2})\b/);
  if (bare) {
    let hour = parseInt(bare[1], 10);
    if (hour >= 1 && hour <= 7) hour += 12; // salon day → pm
    if (hour >= 8 && hour <= 11) {
      /* keep morning */
    }
    return nearestSlot(hour, 0);
  }

  // lone hour if short message like "3" or "3:30"
  if (/^\d{1,2}$/.test(t)) {
    let hour = parseInt(t, 10);
    if (hour >= 1 && hour <= 7) hour += 12;
    return nearestSlot(hour, 0);
  }
  if (/^\d{1,2}:\d{2}$/.test(t)) {
    const [h, m] = t.split(":").map(Number);
    let hour = h;
    if (hour >= 1 && hour <= 7) hour += 12;
    return nearestSlot(hour, m);
  }

  if (/\bmorning\b/.test(t)) return nearestSlot(10, 0);
  if (/\bafternoon\b/.test(t)) return nearestSlot(14, 0);
  if (/\bevening\b/.test(t)) return nearestSlot(18, 0);

  // exact slot string
  const exact = TIMES.find((slot) => slot.toLowerCase() === t);
  if (exact) return exact;

  return null;
}

function nearestSlot(hour24: number, minute: number): string | null {
  const total = hour24 * 60 + minute;
  let best: string | null = null;
  let bestDiff = Infinity;
  for (const slot of TIMES) {
    const mins = slotToMinutes(slot);
    if (mins == null) continue;
    const diff = Math.abs(mins - total);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = slot;
    }
  }
  return best;
}

function slotToMinutes(slot: string): number | null {
  const m = slot.match(/^(\d{1,2}):(\d{2})\s*(a\.m\.|p\.m\.)$/);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (m[3] === "p.m." && h < 12) h += 12;
  if (m[3] === "a.m." && h === 12) h = 0;
  return h * 60 + min;
}

function nearbyTimes(center: string | null, count = 8): string[] {
  if (!center) {
    // sensible daytime sample
    return TIMES.filter((_, i) => i % 2 === 0).slice(2, 2 + count);
  }
  const idx = TIMES.indexOf(center);
  if (idx < 0) return TIMES.slice(0, count);
  const start = Math.max(0, idx - 2);
  return TIMES.slice(start, start + count);
}

function looksLikePhone(text: string): boolean {
  // Accept 10–11 digits in any common format: 347..., (347)..., +1 347...
  const digits = text.replace(/\D/g, "");
  if (digits.length === 10) return true;
  if (digits.length === 11 && digits.startsWith("1")) return true;
  return false;
}

function normalizePhone(text: string): string {
  const d = text.replace(/\D/g, "");
  if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  if (d.length === 11 && d.startsWith("1")) {
    return `(${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7)}`;
  }
  return text.trim();
}

function wantsBook(n: string): boolean {
  return /\b(book|appointment|schedule|reserve|come in|sign me up|schedule it)\b/.test(
    n,
  );
}

/* ── Opening (language-aware, beginner-first) ────────────────────── */

function openMsg(lang: Lang = "en"): ChatMessage {
  return openMessage(lang);
}

/* ── Size limits for stretchable chat ────────────────────────────── */

const SIZE_KEY = "lunara-luna-chat-size";
const POS_KEY = "lunara-luna-pos"; // where Luna sits on screen (free drag)
const DEFAULT_W = 340; // roomy enough for a clean header by default
const DEFAULT_H = 440;
const MIN_W = 280; // never thinner than a good header layout
const MIN_H = 320;
const MAX_W = 560;
const MAX_H = 720;

type ChatSize = { w: number; h: number };
/** Anchor = bottom-right corner of the Luna dock (px from top-left of window) */
type DockPos = { x: number; y: number };

type Sparkle = {
  id: string;
  x: number;
  y: number;
  emoji: string;
  life: number;
};

const SPARKLE_EMOJIS = ["✨", "⭐", "💫", "🌙", "✦", "·"];
const IDLE_TIPS = [
  "Drag me anywhere",
  "Fling me across the page",
  "Double-tap for magic",
  "Ask me anything",
  "I book at light speed",
  "Move me. I dare you.",
];

function loadSize(): ChatSize {
  if (typeof window === "undefined") return { w: DEFAULT_W, h: DEFAULT_H };
  try {
    const raw = window.localStorage.getItem(SIZE_KEY);
    if (!raw) return { w: DEFAULT_W, h: DEFAULT_H };
    const parsed = JSON.parse(raw) as ChatSize;
    return {
      w: Math.min(MAX_W, Math.max(MIN_W, Number(parsed.w) || DEFAULT_W)),
      h: Math.min(MAX_H, Math.max(MIN_H, Number(parsed.h) || DEFAULT_H)),
    };
  } catch {
    return { w: DEFAULT_W, h: DEFAULT_H };
  }
}

function clampSize(w: number, h: number): ChatSize {
  const maxW = Math.min(MAX_W, window.innerWidth - 24);
  const maxH = Math.min(MAX_H, window.innerHeight - 96);
  return {
    w: Math.min(maxW, Math.max(MIN_W, w)),
    h: Math.min(maxH, Math.max(MIN_H, h)),
  };
}

/** Default bottom-right corner with a little breathing room */
function defaultPos(): DockPos {
  if (typeof window === "undefined") return { x: 900, y: 700 };
  return {
    x: window.innerWidth - 18,
    y: window.innerHeight - 18,
  };
}

function loadPos(): DockPos {
  if (typeof window === "undefined") return { x: 900, y: 700 };
  try {
    const raw = window.localStorage.getItem(POS_KEY);
    if (!raw) return defaultPos();
    const parsed = JSON.parse(raw) as DockPos;
    return clampPos({
      x: Number(parsed.x) || defaultPos().x,
      y: Number(parsed.y) || defaultPos().y,
    });
  } catch {
    return defaultPos();
  }
}

/** Keep Luna fully on screen (anchor is bottom-right of dock) */
function clampPos(p: DockPos, dockW = 56, dockH = 56): DockPos {
  if (typeof window === "undefined") return p;
  const pad = 8;
  const minX = pad + dockW;
  const minY = pad + dockH;
  const maxX = window.innerWidth - pad;
  const maxY = window.innerHeight - pad;
  return {
    x: Math.min(maxX, Math.max(minX, p.x)),
    y: Math.min(maxY, Math.max(minY, p.y)),
  };
}

function savePos(p: DockPos) {
  try {
    window.localStorage.setItem(POS_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

/* ── Component: floating corner Luna (not in the hero) ───────────── */

const KNOWN_PHONE_KEY = "lunara-known-phone";

function loadKnownPhone(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(KNOWN_PHONE_KEY) ?? "";
  } catch {
    return "";
  }
}

function saveKnownPhone(phone: string) {
  try {
    window.localStorage.setItem(KNOWN_PHONE_KEY, phone);
  } catch {
    /* ignore */
  }
}

export function AskLuna() {
  const { lang, setLang } = useI18n();
  const copy = lunaCopy(lang);
  const [open, setOpen] = useState(false);
  // Start with English open; re-sync when lang loads / changes
  const [messages, setMessages] = useState<ChatMessage[]>(() => [openMsg("en")]);
  const [query, setQuery] = useState("");
  const [thinking, setThinking] = useState(false);
  const langRef = useRef(lang);
  langRef.current = lang;
  const { draft, setDraft, draftRef } = useDraft();
  const [phoneInput, setPhoneInput] = useState("");
  const [done, setDone] = useState(false);
  const doneRef = useRef(false);
  /** Phone from a past website booking — personalizes loyalty CTAs */
  const knownPhoneRef = useRef(
    typeof window !== "undefined" ? loadKnownPhone() : "",
  );
  /** Waiting for a number only to check loyalty points */
  const awaitingLoyaltyPhoneRef = useRef(false);
  /** Locked service+slot while we wait for phone (survives draft glitches) */
  const pendingBookingRef = useRef<{
    service: ServicePick;
    slot: string;
  } | null>(null);
  /** Last topic we talked about — so casual replies stay in context */
  const lastTopicRef = useRef<ChatTopic>("open");
  const lastServiceRef = useRef<string>("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const phoneFieldRef = useRef<HTMLInputElement>(null);
  // Lazy init from localStorage — no setState-in-effect (that was the red error)
  const [size, setSize] = useState<ChatSize>(() => loadSize());
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startW: number;
    startH: number;
    mode: "both" | "width" | "height";
  } | null>(null);

  /* ── Free move around the screen (the fun part) ── */
  const [pos, setPos] = useState<DockPos>(() => loadPos());
  const posRef = useRef(pos);
  posRef.current = pos;
  const [dragging, setDragging] = useState(false);
  const [tossing, setTossing] = useState(false); // fling / bounce anim
  const [spin, setSpin] = useState(false); // double-tap magic spin
  const [tip, setTip] = useState(IDLE_TIPS[0]);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const moveRef = useRef<{
    pointerId: number;
    offsetX: number; // grab offset from anchor
    offsetY: number;
    startClientX: number;
    startClientY: number;
    lastX: number;
    lastY: number;
    lastT: number;
    vx: number; // velocity px/ms
    vy: number;
    moved: boolean; // true if dragged past click threshold
  } | null>(null);
  const throwRaf = useRef<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  function markDone(v: boolean) {
    doneRef.current = v;
    setDone(v);
  }

  function setKnown(phone: string) {
    knownPhoneRef.current = phone;
    if (phone) saveKnownPhone(phone);
  }

  function setAwaitingLoyalty(v: boolean) {
    awaitingLoyaltyPhoneRef.current = v;
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !open) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, open]);

  // Focus input when the bubble opens
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [open]);

  // If chat only has the open message, refresh it when language changes
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0]?.id === "open") {
        return [openMsg(lang)];
      }
      return prev;
    });
  }, [lang]);

  // Drag to stretch — panel size handles
  useEffect(() => {
    function onMove(e: PointerEvent) {
      const d = dragRef.current;
      if (!d) return;
      // Drag left → wider, drag up → taller
      const nextW =
        d.mode === "height" ? d.startW : d.startW + (d.startX - e.clientX);
      const nextH =
        d.mode === "width" ? d.startH : d.startH + (d.startY - e.clientY);
      setSize(clampSize(nextW, nextH));
    }

    function onUp() {
      if (!dragRef.current) return;
      dragRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setSize((current) => {
        try {
          window.localStorage.setItem(SIZE_KEY, JSON.stringify(current));
        } catch {
          /* ignore */
        }
        return current;
      });
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Keep Luna on screen when the window resizes
  useEffect(() => {
    function onResize() {
      const rect = dockRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 56;
      const h = rect?.height ?? 56;
      setPos((p) => {
        const next = clampPos(p, w, h);
        posRef.current = next;
        return next;
      });
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Idle tip rotation — keeps her feeling alive
  useEffect(() => {
    if (open || dragging) return;
    const id = window.setInterval(() => {
      setTip(IDLE_TIPS[Math.floor(Math.random() * IDLE_TIPS.length)]);
    }, 4200);
    return () => window.clearInterval(id);
  }, [open, dragging]);

  // Sparkle cleanup — fade trail particles
  useEffect(() => {
    if (!sparkles.length) return;
    const id = window.setInterval(() => {
      setSparkles((prev) =>
        prev
          .map((s) => ({ ...s, life: s.life - 1 }))
          .filter((s) => s.life > 0)
          .slice(-24),
      );
    }, 50);
    return () => window.clearInterval(id);
  }, [sparkles.length > 0]);

  function dockBox() {
    const rect = dockRef.current?.getBoundingClientRect();
    return {
      w: rect?.width ?? (open ? size.w : 56),
      h: rect?.height ?? (open ? size.h : 56),
    };
  }

  function spawnSparkle(x: number, y: number) {
    const emoji =
      SPARKLE_EMOJIS[Math.floor(Math.random() * SPARKLE_EMOJIS.length)];
    setSparkles((prev) => [
      ...prev.slice(-20),
      {
        id: uid(),
        x: x + (Math.random() - 0.5) * 28,
        y: y + (Math.random() - 0.5) * 28,
        emoji,
        life: 12 + Math.floor(Math.random() * 8),
      },
    ]);
  }

  function burstSparkles(cx: number, cy: number, n = 12) {
    const batch: Sparkle[] = [];
    for (let i = 0; i < n; i++) {
      batch.push({
        id: uid(),
        x: cx + (Math.random() - 0.5) * 80,
        y: cy + (Math.random() - 0.5) * 80,
        emoji: SPARKLE_EMOJIS[i % SPARKLE_EMOJIS.length],
        life: 14 + Math.floor(Math.random() * 10),
      });
    }
    setSparkles((prev) => [...prev, ...batch].slice(-36));
  }

  /** Start free-move drag from FAB or chat header */
  function startMove(e: ReactPointerEvent<HTMLElement>) {
    // Ignore if resize handle / form controls
    if ((e.target as HTMLElement).closest?.(".luna-resize-handle")) return;
    if ((e.target as HTMLElement).closest?.("input,textarea,a,select")) return;
    // Don't start move from action buttons inside header except drag grip
    if (
      (e.target as HTMLElement).closest?.("button") &&
      !(e.currentTarget as HTMLElement).classList.contains("luna-fab") &&
      !(e.target as HTMLElement).closest?.(".luna-drag-grip")
    ) {
      // allow header bar itself (not child buttons)
      if ((e.target as HTMLElement).closest?.(".luna-reset-btn")) return;
    }

    e.preventDefault();
    const box = dockBox();
    const anchor = posRef.current;
    // Cancel any fling in progress
    if (throwRaf.current != null) {
      cancelAnimationFrame(throwRaf.current);
      throwRaf.current = null;
    }
    setTossing(false);
    moveRef.current = {
      pointerId: e.pointerId,
      offsetX: anchor.x - e.clientX,
      offsetY: anchor.y - e.clientY,
      startClientX: e.clientX,
      startClientY: e.clientY,
      lastX: e.clientX,
      lastY: e.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0,
      moved: false,
    };
    setDragging(true);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    try {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      /* ignore */
    }
  }

  function onMovePointer(e: ReactPointerEvent<HTMLElement>) {
    const m = moveRef.current;
    if (!m || m.pointerId !== e.pointerId) return;
    const now = performance.now();
    const dt = Math.max(1, now - m.lastT);
    const dx = e.clientX - m.lastX;
    const dy = e.clientY - m.lastY;
    // Velocity in px/ms for fling
    m.vx = dx / dt;
    m.vy = dy / dt;
    m.lastX = e.clientX;
    m.lastY = e.clientY;
    m.lastT = now;

    const dist = Math.hypot(
      e.clientX - m.startClientX,
      e.clientY - m.startClientY,
    );
    if (dist > 6) m.moved = true;

    const box = dockBox();
    const next = clampPos(
      {
        x: e.clientX + m.offsetX,
        y: e.clientY + m.offsetY,
      },
      box.w,
      box.h,
    );
    posRef.current = next;
    setPos(next);

    // Sparkle trail while moving
    if (m.moved && Math.random() > 0.35) {
      spawnSparkle(e.clientX, e.clientY);
    }
  }

  function endMove(e: ReactPointerEvent<HTMLElement>) {
    const m = moveRef.current;
    if (!m || m.pointerId !== e.pointerId) return;
    moveRef.current = null;
    setDragging(false);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";

    // Click (no real drag) → open chat when closed
    if (!m.moved) {
      if (!open) {
        setOpen(true);
        burstSparkles(e.clientX, e.clientY, 8);
      }
      return;
    }

    // Fling if they were moving fast enough — "woah" physics
    const speed = Math.hypot(m.vx, m.vy); // px/ms
    if (speed > 0.35) {
      setTossing(true);
      fling(m.vx * 16, m.vy * 16); // scale to px/frame-ish
    } else {
      savePos(posRef.current);
      setTossing(true);
      window.setTimeout(() => setTossing(false), 420);
    }
  }

  /** Inertia fling + soft bounce off walls */
  function fling(vx0: number, vy0: number) {
    let vx = vx0;
    let vy = vy0;
    let last = performance.now();

    const step = (now: number) => {
      const dt = Math.min(32, now - last) / 16.67; // ~frames
      last = now;
      // Friction
      vx *= Math.pow(0.92, dt);
      vy *= Math.pow(0.92, dt);

      const box = dockBox();
      let { x, y } = posRef.current;
      x += vx * dt;
      y += vy * dt;

      // Bounce off edges (anchor is bottom-right)
      const pad = 8;
      const minX = pad + box.w;
      const minY = pad + box.h;
      const maxX = window.innerWidth - pad;
      const maxY = window.innerHeight - pad;

      if (x < minX) {
        x = minX;
        vx = Math.abs(vx) * 0.55;
        burstSparkles(x - box.w / 2, y - box.h / 2, 6);
      } else if (x > maxX) {
        x = maxX;
        vx = -Math.abs(vx) * 0.55;
        burstSparkles(x - box.w / 2, y - box.h / 2, 6);
      }
      if (y < minY) {
        y = minY;
        vy = Math.abs(vy) * 0.55;
        burstSparkles(x - box.w / 2, y - box.h / 2, 6);
      } else if (y > maxY) {
        y = maxY;
        vy = -Math.abs(vy) * 0.55;
        burstSparkles(x - box.w / 2, y - box.h / 2, 6);
      }

      const next = { x, y };
      posRef.current = next;
      setPos(next);

      if (Math.hypot(vx, vy) > 0.4) {
        throwRaf.current = requestAnimationFrame(step);
      } else {
        throwRaf.current = null;
        savePos(next);
        setTossing(false);
        setTip("That was fun");
      }
    };

    if (throwRaf.current != null) cancelAnimationFrame(throwRaf.current);
    throwRaf.current = requestAnimationFrame(step);
  }

  function onFabDoubleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSpin(true);
    burstSparkles(e.clientX, e.clientY, 18);
    setTip("No way");
    window.setTimeout(() => setSpin(false), 900);
  }

  function startResize(
    e: ReactPointerEvent<HTMLButtonElement>,
    mode: "both" | "width" | "height",
  ) {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startW: size.w,
      startH: size.h,
      mode,
    };
    document.body.style.cursor =
      mode === "width" ? "ew-resize" : mode === "height" ? "ns-resize" : "nwse-resize";
    document.body.style.userSelect = "none";
  }

  function resetSize() {
    const next = { w: DEFAULT_W, h: DEFAULT_H };
    setSize(next);
    try {
      window.localStorage.setItem(SIZE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  /** Snap Luna back to bottom-right corner */
  function resetPlace() {
    if (throwRaf.current != null) {
      cancelAnimationFrame(throwRaf.current);
      throwRaf.current = null;
    }
    const next = defaultPos();
    posRef.current = next;
    setPos(next);
    savePos(next);
    setTossing(true);
    burstSparkles(next.x - 28, next.y - 28, 10);
    window.setTimeout(() => setTossing(false), 500);
    setTip("Home base");
  }

  function setTopic(topic: ChatTopic, serviceName?: string) {
    lastTopicRef.current = topic;
    if (serviceName) lastServiceRef.current = serviceName;
  }

  function addLuna(partial: Omit<ChatMessage, "id" | "role">) {
    // Hard cap: never more than 2 suggestion chips (Grok-style)
    // Labels follow active language; values stay English for the engine
    const chips = partial.chips
      ? localizeChips(two(partial.chips), langRef.current)
      : partial.chips;
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "luna", ...partial, chips },
    ]);
  }

  /** React like a friend to what they just said, using last topic */
  function replyAsFriend(userText: string, current: Draft): Draft {
    const n = fixTypos(normalize(userText));
    const topic = lastTopicRef.current;
    const positive =
      /\b(cool|nice|love|awesome|great|amazing|dope|lit|fire|sick|perfect|good|bet|facts|true|wow)\b/.test(
        n,
      );
    const thanks = /\b(thanks|thank|ty|thx|appreciate)\b/.test(n);
    const agree = /^(yes|yeah|yep|yup|sure|ok|okay|k|mhm|for sure|bet)[\s!.]*$/.test(
      n,
    );
    const no = /^(no|nah|nope)[\s!.]*$/.test(n);

    if (thanks) {
      const L = langRef.current;
      addLuna({
        text:
          L === "es"
            ? topic === "loyalty"
              ? "Cuando quieras. ¿Empezamos a sumar puntos?"
              : "Cuando quieras. ¿En qué más te ayudo?"
            : L === "hi"
              ? topic === "loyalty"
                ? "जब चाहो। पॉइंट्स शुरू करें?"
                : "जब चाहो। और क्या मदद चाहिए?"
              : topic === "loyalty"
                ? "Anytime. Want to start stacking points?"
                : "Anytime. What else can I help with?",
        chips:
          topic === "loyalty"
            ? relatedChips({ topic: "loyalty" })
            : two([
                {
                  label: "Book something",
                  value: "I want to book",
                },
                {
                  label: "Explain a service",
                  value: "what services can you explain",
                },
              ]),
      });
      return current;
    }

    if (topic === "loyalty") {
      if (positive || agree) {
        addLuna({
          text:
            langRef.current === "es"
              ? "¿Verdad? Fácil. ¿Reservamos?"
              : langRef.current === "hi"
                ? "सही? आसान। बुक करें?"
                : "Right? Easy wins. Want to book?",
          chips: relatedChips({ topic: "loyalty-status" }),
        });
        return current;
      }
      if (no) {
        addLuna({
          text: "All good. I’m here when you want to book.",
          chips: relatedChips({ topic: "loyalty-status" }),
        });
        return current;
      }
      addLuna({
        text: "Want to book brow threading or wax?",
        chips: relatedChips({ topic: "loyalty-status" }),
      });
      return current;
    }

    if (topic === "wax") {
      addLuna({
        text: positive
          ? "Chocolate wax hits different ✨ Body or face?"
          : "Still thinking wax? Body or face?",
        chips: relatedChips({ topic: "wax-where" }),
      });
      return current;
    }

    if (topic === "brows" || topic === "lashes" || topic === "facials") {
      addLuna({
        text: positive
          ? `Nice. Want to book ${topic}, or hear what’s in a service?`
          : `Want to keep going on ${topic}?`,
        chips: relatedChips({ topic }),
      });
      return current;
    }

    if (topic === "expert" && lastServiceRef.current) {
      const name = lastServiceRef.current;
      addLuna({
        text: positive
          ? `Glad that helped. Book ${name}, or dig into another service?`
          : `Want to book ${name}, or ask about something else?`,
        chips: relatedChips({
          topic: "expert-service",
          serviceName: name,
        }),
      });
      return current;
    }

    if (topic === "booking" || draft.service) {
      addLuna({
        text: positive
          ? "Let’s finish it — time or phone next?"
          : "Want to keep booking, or switch services?",
        chips: two([
          draft.service
            ? {
                label: `Keep ${draft.service.name}`,
                value: `pick:${draft.service.name}`,
              }
            : { label: "Book something", value: "I want to book" },
          { label: "Start over", value: "__reset__" },
        ]),
      });
      return current;
    }

    // Default friend energy — never “I didn’t catch that” for vibes
    addLuna({
      text: positive
        ? "Appreciate you 🌙 Want to book, or ask me anything about the menu?"
        : "I’m with you. Book something, or ask me a question?",
      chips: two([
        {
          label: "Chocolate wax",
          value: "I want a chocolate wax, schedule it.",
        },
        { label: "Loyalty card", value: "Explain the loyalty program" },
      ]),
    });
    return current;
  }

  function addUser(text: string) {
    setMessages((prev) => [...prev, { id: uid(), role: "user", text }]);
  }

  function askTime(service: ServicePick, hintSlot: string | null) {
    pendingBookingRef.current = null;
    setTopic("booking", service.name);
    setDraft({ service, slot: null, phone: "" });
    addLuna({
      text: `${service.name} — ${service.price}, ~${service.time}. What time?`,
      times: nearbyTimes(hintSlot, 6),
    });
  }

  function askPhone(service: ServicePick, slot: string) {
    // Keep a hard copy so phone submit never loses the appointment
    pendingBookingRef.current = { service, slot };
    setTopic("booking", service.name);
    setDraft({ service, slot, phone: "" });
    addLuna({
      text: `Locked: ${service.name} at ${slot} (${service.price}).\n\nType your phone number below — I’ll iMessage the confirmation.`,
      showPhone: true,
    });
    window.setTimeout(() => phoneFieldRef.current?.focus(), 120);
  }

  function finish(service: ServicePick, slot: string, phone: string) {
    // Only mark done after the API succeeds — so a failed submit can be retried
    addLuna({
      text: `Got it — locking ${service.name} at ${slot}. Sending your confirmation as an iMessage with the exact details now…`,
    });
    void submitBooking(service, slot, phone);
  }

  /** Guided chocolate-wax booking: one question, two choices */
  function guideChocolateWax(slot: string | null): Draft {
    setTopic("wax");
    addLuna({
      text: "Chocolate hard wax is what we use ✨\n\nWhere do you want it?",
      chips: relatedChips({ topic: "wax-where" }),
    });
    return { service: null, slot, phone: "" };
  }

  function guideWaxBody(slot: string | null): Draft {
    setTopic("wax");
    addLuna({
      text: "Body — legs or arms?",
      chips: relatedChips({ topic: "wax-body" }),
    });
    return { service: null, slot, phone: "" };
  }

  function guideWaxFace(slot: string | null): Draft {
    setTopic("wax");
    addLuna({
      text: "Face — brows or lip?",
      chips: relatedChips({ topic: "wax-face" }),
    });
    return { service: null, slot, phone: "" };
  }

  function guideWaxLegs(slot: string | null): Draft {
    setTopic("wax");
    addLuna({
      text: "Legs — full or half?",
      chips: two([
        { label: "Full legs · $40", value: "pick:Upper Leg" },
        { label: "Half legs · $25", value: "pick:Lower Leg" },
      ]),
    });
    return { service: null, slot, phone: "" };
  }

  function guideWaxArms(slot: string | null): Draft {
    setTopic("wax");
    addLuna({
      text: "Arms — full or half?",
      chips: two([
        { label: "Full arms · $25", value: "pick:Full Arm" },
        { label: "Half arms · $20", value: "pick:Half Arm" },
      ]),
    });
    return { service: null, slot, phone: "" };
  }

  /**
   * mode "rules" = how loyalty works (full card)
   * mode "status" = check my points (short personal only — no loop)
   */
  async function explainLoyalty(
    phoneHint?: string,
    mode: "rules" | "status" = "rules",
  ) {
    setTopic("loyalty");
    const phone =
      phoneHint?.trim() ||
      draftRef.current.phone ||
      knownPhoneRef.current ||
      "";

    // Full rules only — no phone required
    if (mode === "rules" && !phoneHint) {
      // Beginner-friendly loyalty card in the active language
      addLuna({
        text: lunaCopy(langRef.current).loyaltyRules,
        chips: relatedChips({ topic: "loyalty" }),
      });
      return;
    }

    // Status check needs a number
    if (!phone) {
      setAwaitingLoyalty(true);
      addLuna({
        text: "What’s the phone number on your bookings?",
        showPhone: true,
      });
      return;
    }

    try {
      const res = await fetch(
        `/api/lunara/loyalty?phone=${encodeURIComponent(phone)}&mode=status`,
      );
      const data = (await res.json()) as {
        ok?: boolean;
        text?: string;
        status?: {
          visitCount: number;
          points: number;
          justHitTen: boolean;
        };
      };

      if (!res.ok || !data.ok || !data.text) {
        addLuna({
          text: "Couldn’t find a card for that number. Book a visit and complete it to start at 1/10.",
          chips: relatedChips({ topic: "loyalty-status" }),
        });
        return;
      }

      setKnown(phone);
      setAwaitingLoyalty(false);
      // After status: never offer “check my points” again
      addLuna({
        text: data.text,
        chips: relatedChips({ topic: "loyalty-status" }),
      });
    } catch {
      addLuna({
        text: "Couldn’t load your card right now. Try booking, or ask again in a sec.",
        chips: relatedChips({ topic: "loyalty-status" }),
      });
    }
  }

  /** Save booking → text client exact details (required path) */
  async function submitBooking(
    service: ServicePick,
    slot: string,
    phone: string,
  ) {
    try {
      const res = await fetch("/api/lunara/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: service.name,
          categoryId: service.categoryId,
          price: service.price,
          duration: service.time,
          slot,
          phone,
          source: "luna",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
        smsSent?: boolean;
        booking?: {
          id: string;
          service: string;
          date: string;
          dateLabel: string;
          slot: string;
          price: string;
          duration: string;
          phone: string;
          smsStatus?: string;
        };
        loyalty?: {
          visitCount: number;
          points: number;
          justHitTen: boolean;
          line: string;
        } | null;
        notify?: {
          smsCustomer?: string;
          smsBody?: string;
          clientChannel?: string;
          emailSalon?: string;
          calendar?: string;
          details?: string[];
        };
      };

      if (!res.ok || !data.ok || !data.booking) {
        addLuna({
          text: `I couldn’t finish that booking: ${data.error || "try again"}. Your number was ${phone}. Call ${lunara.phone} if it keeps failing — or send the number again.`,
          showPhone: true,
          chips: [{ label: "Start over", value: "__reset__" }],
        });
        return;
      }

      markDone(true);
      setKnown(data.booking.phone);
      setDraft({
        service,
        slot,
        phone: data.booking.phone,
      });
      const b = data.booking;
      const smsOk = data.smsSent === true || data.notify?.smsCustomer === "sent";
      const viaImsg = data.notify?.clientChannel === "imessage";
      const failHint = data.notify?.details?.[0];

      const smsLine = smsOk
        ? viaImsg
          ? `An iMessage with these exact details was just sent to ${b.phone}.`
          : `A text with these exact details was just sent to ${b.phone}.`
        : data.notify?.smsCustomer === "failed"
          ? `Booking is saved, but the iMessage didn’t send${failHint ? ` (${failHint})` : ""}. Check Messages is signed in, then try again — or call ${lunara.phone}.`
          : `Booking is saved. For iMessage: keep this Mac signed into Messages (Apple ID).`;

      const loyaltyLine = data.loyalty?.line
        ? `\n\n${data.loyalty.line}`
        : "";

      addLuna({
        text: `You’re confirmed ⚡\n\nService: ${b.service}\nWhen: ${b.dateLabel} at ${b.slot}\nLength: ${b.duration}\nPrice: ${b.price}\nPhone: ${b.phone}\nRef: ${b.id}\n\n${smsLine}${loyaltyLine}\n\n${lunara.offer}`,
        summary: {
          service: b.service,
          price: b.price,
          slot: `${b.dateLabel} · ${b.slot}`,
          phone: b.phone,
        },
        chips: relatedChips({ topic: "booked" }),
      });
    } catch {
      addLuna({
        text: `Network hiccup — I couldn’t reach the booking system. Please call ${lunara.phone} to confirm ${service.name} at ${slot}, or try your number again.`,
        showPhone: true,
        chips: two([
          { label: "Try number again", value: phone },
          { label: "Start over", value: "__reset__" },
        ]),
      });
    }
  }

  /** Smart turn — intent first, menu second */
  function handleTurn(raw: string, current: Draft): Draft {
    const text = raw.trim();
    if (!text) return current;

    if (doneRef.current && text !== "__reset__") {
      addLuna({
        text: "That appointment is already locked. Tap below to add another booking.",
        chips: [{ label: "Add another booking", value: "__reset__" }],
      });
      return current;
    }

    // Structured chip values
    if (text === "__reset__") {
      return current; // handled outside
    }

    if (text === "__check_points__") {
      // Already know their number → pull status immediately (no re-ask loop)
      if (knownPhoneRef.current) {
        void explainLoyalty(knownPhoneRef.current, "status");
        return current;
      }
      setAwaitingLoyalty(true);
      addLuna({
        text: "What’s the phone number on your bookings?",
        showPhone: true,
      });
      return current;
    }

    // Loyalty point check: waiting only for a phone number
    if (awaitingLoyaltyPhoneRef.current) {
      if (looksLikePhone(text)) {
        setAwaitingLoyalty(false);
        void explainLoyalty(normalizePhone(text), "status");
        return current;
      }
      addLuna({
        text: "Need a 10-digit number (ex: 3475364259).",
        showPhone: true,
      });
      return current;
    }

    // explain <service or category> — but never steal loyalty questions
    if (text.toLowerCase().startsWith("explain ")) {
      const topic = text.slice(8).trim().toLowerCase();
      if (
        topic.includes("loyalty") ||
        topic.includes("reward") ||
        topic.includes("punch card") ||
        topic.includes("visit card")
      ) {
        // fall through to loyalty intent below
      } else {
        return replyAsExpert(text.slice(8).trim(), current);
      }
    }

    if (text.startsWith("pick:")) {
      const name = text.slice(5);
      const service = ALL.find((s) => s.name === name);
      if (!service) {
        addLuna({ text: "I lost that pick — tell me the service again?" });
        return current;
      }
      const slotReady = current.slot || pendingBookingRef.current?.slot || null;
      if (slotReady) {
        askPhone(service, slotReady);
        return { service, slot: slotReady, phone: "" };
      }
      askTime(service, null);
      return { service, slot: null, phone: "" };
    }

    if (text.startsWith("time:")) {
      const slot = text.slice(5);
      const serviceReady =
        current.service || pendingBookingRef.current?.service || null;
      if (!serviceReady) {
        addLuna({
          text: "Time noted. What are we booking?",
          chips: CATEGORY_CHIPS,
        });
        return { ...current, slot };
      }
      if (!TIMES.includes(slot as (typeof TIMES)[number])) {
        addLuna({
          text: "That slot isn’t on our board. Pick one of these:",
          times: nearbyTimes(null, 6),
        });
        return current;
      }
      askPhone(serviceReady, slot);
      return { service: serviceReady, slot, phone: "" };
    }

    // Guided wax paths (one question, two choices at a time)
    const nEarly = fixTypos(normalize(text));
    if (/^wax on body$/.test(nEarly) || nEarly === "body wax") {
      return guideWaxBody(current.slot);
    }
    if (/^wax on face$/.test(nEarly) || nEarly === "face wax") {
      return guideWaxFace(current.slot);
    }
    if (/^wax legs next$/.test(nEarly)) {
      return guideWaxLegs(current.slot);
    }
    if (/^wax arms next$/.test(nEarly)) {
      return guideWaxArms(current.slot);
    }

    const intent = detectIntent(text, current);
    const n = fixTypos(normalize(text));
    const slotInText = parseTimeFromText(text);

    // Phone step — use pendingBookingRef so we never lose service/time
    const phoneService =
      current.service || pendingBookingRef.current?.service || null;
    const phoneSlot = current.slot || pendingBookingRef.current?.slot || null;

    if (phoneService && phoneSlot && !current.phone && !doneRef.current) {
      if (looksLikePhone(text)) {
        const phone = normalizePhone(text);
        finish(phoneService, phoneSlot, phone);
        return { service: phoneService, slot: phoneSlot, phone: "" };
      }
      // User changing time mid-phone
      if (slotInText) {
        askPhone(phoneService, slotInText);
        return { service: phoneService, slot: slotInText, phone: "" };
      }
      // User typed something that isn't a phone — re-prompt clearly
      if (!slotInText) {
        addLuna({
          text: "Need your 10-digit phone to send the iMessage (ex: 3475364259).",
          showPhone: true,
        });
        window.setTimeout(() => phoneFieldRef.current?.focus(), 80);
        return { service: phoneService, slot: phoneSlot, phone: "" };
      }
    }

    // Waiting on time
    if (current.service && !current.slot) {
      const slot =
        slotInText ||
        (TIMES.includes(text as (typeof TIMES)[number]) ? text : null);
      if (slot) {
        askPhone(current.service, slot);
        return { service: current.service, slot, phone: "" };
      }
      addLuna({
        text: `What time for ${current.service.name}?`,
        times: nearbyTimes(null, 6),
      });
      return current;
    }

    switch (intent) {
      case "greeting":
        setTopic("open");
        addLuna({
          text: "Hey — book a service or ask me anything about the menu. What’s up?",
          chips: relatedChips({ topic: "open" }),
        });
        return current;

      case "unsure":
        setTopic("open");
        addLuna({
          // Super beginner path — no jargon
          text: lunaCopy(langRef.current).helpChoose,
          chips: relatedChips({ topic: "unsure" }),
        });
        return current;

      case "chat":
        return replyAsFriend(text, current);

      case "explain":
        return replyAsExpert(text, current);

      case "hours":
        addLuna({
          text: `Open ${lunara.hours}.\n📍 ${lunara.address}\n📞 ${lunara.phone}`,
          chips: two([
            { label: "Book now", value: "I want to book" },
            { label: "Loyalty card", value: "Explain the loyalty program" },
          ]),
        });
        return current;

      case "offer":
        addLuna({
          text: `${lunara.offer} What do you want to book?`,
          chips: two([
            { label: "Brows", value: "I want brows" },
            {
              label: "Chocolate wax",
              value: "I want a chocolate wax, schedule it.",
            },
          ]),
        });
        return current;

      case "loyalty":
        void explainLoyalty();
        return current;

      case "category": {
        const cat = detectCategoryId(n);
        if (!cat) {
          addLuna({
            text: "What are we looking at?",
            chips: two([
              { label: "Brows", value: "I want brows" },
              {
                label: "Chocolate wax",
                value: "I want a chocolate wax, schedule it.",
              },
            ]),
          });
          return current;
        }
        // One question, two related choices
        if (cat === "waxing") return guideChocolateWax(current.slot);
        if (cat === "brows") {
          setTopic("brows");
          addLuna({
            text: "Brows — wax or thread?",
            chips: relatedChips({ topic: "brows" }),
          });
          return current;
        }
        if (cat === "lashes") {
          setTopic("lashes");
          addLuna({
            text: "Lashes — lift or extensions?",
            chips: relatedChips({ topic: "lashes" }),
          });
          return current;
        }
        if (cat === "facials") {
          setTopic("facials");
          addLuna({
            text: "Facial — clarifying or gentle herbal?",
            chips: relatedChips({ topic: "facials" }),
          });
          return current;
        }
        return current;
      }

      case "book_flow": {
        // Chocolate wax = product type → ask Face / Body / Bikini (not brow dump)
        if (isChocolateWaxRequest(n) && !hasSpecificWaxArea(n)) {
          return guideChocolateWax(slotInText || current.slot);
        }
        if (
          (/\bwax\b/.test(n) || /\bwaxing\b/.test(n)) &&
          /\bbody\b/.test(n) &&
          !hasSpecificWaxArea(n.replace(/\bbody\b/, ""))
        ) {
          return guideWaxBody(slotInText || current.slot);
        }
        if (
          (/\bwax\b/.test(n) || /\bwaxing\b/.test(n)) &&
          /\bface\b/.test(n) &&
          !/\b(lip|chin|brow)\b/.test(n)
        ) {
          return guideWaxFace(slotInText || current.slot);
        }

        const hits = findServices(text);
        const cat = detectCategoryId(n);

        // Strong single service + time → jump to phone
        if (hits.length === 1 && slotInText) {
          askPhone(hits[0], slotInText);
          return { service: hits[0], slot: slotInText, phone: "" };
        }

        // Single service, no time
        if (hits.length === 1) {
          askTime(hits[0], slotInText);
          return { service: hits[0], slot: null, phone: "" };
        }

        // Multiple matches → exactly two closest options
        if (hits.length > 1) {
          addLuna({
            text: slotInText
              ? `Got ${slotInText}. Which one?`
              : "Which one did you mean?",
            chips: two(
              hits.slice(0, 2).map((p) => ({
                label: `${p.name} · ${p.price}`,
                value: `pick:${p.name}`,
              })),
            ),
          });
          return { service: null, slot: slotInText || current.slot, phone: "" };
        }

        // Category only — two related choices
        if (cat) {
          if (cat === "waxing") {
            return guideChocolateWax(slotInText || current.slot);
          }
          if (cat === "brows") {
            addLuna({
              text: "Brows — wax or thread?",
              chips: relatedChips({ topic: "brows" }),
            });
            return { service: null, slot: slotInText, phone: "" };
          }
          if (cat === "lashes") {
            addLuna({
              text: "Lashes — lift or extensions?",
              chips: relatedChips({ topic: "lashes" }),
            });
            return { service: null, slot: slotInText, phone: "" };
          }
          if (cat === "facials") {
            addLuna({
              text: "Facial — clarifying or gentle herbal?",
              chips: relatedChips({ topic: "facials" }),
            });
            return { service: null, slot: slotInText, phone: "" };
          }
        }

        // Book language but no service
        if (wantsBook(n) || slotInText) {
          addLuna({
            text: slotInText
              ? `Got ${slotInText}. Brows or wax?`
              : "Brows or wax?",
            chips: two([
              { label: "Brows", value: "I want brows" },
              {
                label: "Chocolate wax",
                value: "I want a chocolate wax, schedule it.",
              },
            ]),
          });
          return { service: null, slot: slotInText, phone: "" };
        }

        addLuna({
          text: "What do you want?",
          chips: two([
            { label: "Book something", value: "I want to book" },
            { label: "Explain loyalty", value: "Explain the loyalty program" },
          ]),
        });
        return current;
      }

      default: {
        // Maybe they asked about ingredients without perfect phrasing
        if (hasServiceSignal(n) || /\b(what|how|ingredient)\b/.test(n)) {
          const expertTry = findExpertMatch(text);
          if (expertTry) return replyAsExpert(text, current);
        }

        // Last chance: try services only if score is high
        const hits = findServices(text);
        if (hits.length === 1) {
          setTopic("booking", hits[0].name);
          askTime(hits[0], null);
          return { service: hits[0], slot: null, phone: "" };
        }
        if (hits.length > 1) {
          setTopic("booking");
          addLuna({
            text: "Which one did you mean?",
            chips: two(
              hits.slice(0, 2).map((p) => ({
                label: `${p.name} · ${p.price}`,
                value: `pick:${p.name}`,
              })),
            ),
          });
          return current;
        }

        // Still treat short / vibe messages as chat (never cold “didn’t catch that”)
        return replyAsFriend(text, current);
      }
    }
  }

  /** Full expert answer — ingredients, steps, aftercare + 2 related follow-ups */
  function replyAsExpert(query: string, current: Draft): Draft {
    const q = fixTypos(normalize(query));
    setTopic("expert");

    if (
      /\b(what services|what can you explain|all services|menu expert)\b/.test(q)
    ) {
      addLuna({
        text: "I can break down any service — ingredients, steps, aftercare. What’s on your mind?",
        chips: two([
          { label: "What’s in Hydra Medic?", value: "explain Hydra Medic" },
          { label: "Explain lash lift", value: "explain Lash Lift + Tint" },
        ]),
      });
      return current;
    }

    const match = findExpertMatch(query);
    if (!match) {
      addLuna({
        text: "Which service should I break down?",
        chips: two([
          { label: "Hydra Medic", value: "explain Hydra Medic" },
          {
            label: "Brow lamination",
            value: "explain Brow Lamination + Shaping",
          },
        ]),
      });
      return current;
    }

    if (match.type === "category") {
      if (match.categoryId === "waxing") setTopic("wax");
      else if (match.categoryId === "brows") setTopic("brows");
      else if (match.categoryId === "lashes") setTopic("lashes");
      else if (match.categoryId === "facials") setTopic("facials");
      const overview = formatCategoryExpert(match.categoryId);
      addLuna({
        text:
          overview ||
          "Here’s that category. Want details on a specific service?",
        chips: relatedChips({
          topic: "expert-category",
          categoryId: match.categoryId,
        }),
      });
      return current;
    }

    const e = match.expert;
    setTopic("expert", e.name);
    addLuna({
      text: formatExpertReply(e),
      chips: relatedChips({
        topic: "expert-service",
        serviceName: e.name,
        categoryId: e.categoryId,
      }),
    });
    return current;
  }

  function resetChat() {
    markDone(false);
    setDraft({ service: null, slot: null, phone: "" });
    setPhoneInput("");
    setThinking(false);
    setQuery("");
    setAwaitingLoyalty(false);
    pendingBookingRef.current = null;
    lastTopicRef.current = "open";
    lastServiceRef.current = "";
    setMessages([openMsg(langRef.current)]);
  }

  /**
   * Switch language — wipe chat and open fully in that language.
   * No leftover English messages. No emoji spam.
   */
  function switchLunaLang(next: Lang) {
    if (next === lang) return;
    setLang(next);
    // Full reset so the whole thread matches ES / HI / EN
    markDone(false);
    setDraft({ service: null, slot: null, phone: "" });
    setPhoneInput("");
    setThinking(false);
    setQuery("");
    setAwaitingLoyalty(false);
    pendingBookingRef.current = null;
    lastTopicRef.current = "open";
    lastServiceRef.current = "";
    setMessages([openMsg(next)]);
    setTip(lunaCopy(next).funWave[0]);
  }

  function runTurn(userVisible: string, engineText: string) {
    if (!engineText.trim() || thinking) return;
    if (engineText === "__reset__") {
      resetChat();
      return;
    }

    addUser(userVisible);
    setQuery("");
    setThinking(true);

    window.setTimeout(() => {
      const next = handleTurn(engineText, draftRef.current);
      setDraft(next);
      setThinking(false);
      inputRef.current?.focus();
    }, 260);
  }

  function pushMessage(text: string) {
    const cleaned = text.trim();
    if (!cleaned || thinking) return;
    if (cleaned === "__reset__") {
      resetChat();
      return;
    }
    if (cleaned === "__check_points__") {
      runTurn("Check my points", cleaned);
      return;
    }
    if (cleaned.startsWith("time:")) {
      runTurn(cleaned.slice(5), cleaned);
      return;
    }
    if (cleaned.startsWith("pick:")) {
      runTurn(cleaned.slice(5), cleaned);
      return;
    }
    runTurn(cleaned, cleaned);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    pushMessage(query);
  }

  function submitPhone(e: FormEvent) {
    e.preventDefault();
    const value = phoneInput.trim();
    if (!value) return;

    // Prefer pending booking — most reliable path for confirmations
    const pending = pendingBookingRef.current;
    const service = draftRef.current.service || pending?.service;
    const slot = draftRef.current.slot || pending?.slot;

    if (service && slot && looksLikePhone(value)) {
      setPhoneInput("");
      addUser(value);
      finish(service, slot, normalizePhone(value));
      return;
    }

    setPhoneInput("");
    runTurn(value, value);
  }

  const last = messages[messages.length - 1];
  const stepService = Boolean(draft.service);
  const stepTime = Boolean(draft.slot);
  const stepPhone = Boolean(draft.phone);
  const stepDone = done;

  const dockClass = [
    "luna-dock",
    dragging ? "is-dragging" : "",
    tossing ? "is-tossing" : "",
    spin ? "is-spinning" : "",
    open ? "is-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Sparkles in true viewport space (not inside dock transform) */}
      {sparkles.length ? (
        <div className="luna-sparkle-layer" aria-hidden>
          {sparkles.map((s) => (
            <span
              key={s.id}
              className="luna-sparkle"
              style={{
                left: s.x,
                top: s.y,
                opacity: Math.min(1, s.life / 10),
              }}
            >
              {s.emoji}
            </span>
          ))}
        </div>
      ) : null}

      <div
        ref={dockRef}
        className={dockClass}
        style={{
          // Anchor = bottom-right of dock; free position on the page
          left: pos.x,
          top: pos.y,
          right: "auto",
          bottom: "auto",
          transform: "translate(-100%, -100%)",
        }}
      >
      {/* Popup chat — only when open */}
      {open ? (
        <div
          className="luna-panel"
          role="dialog"
          aria-label="Luna booking chat"
          data-w={size.w < 320 ? "xs" : size.w < 380 ? "sm" : "md"}
          style={{ width: size.w, height: size.h }}
        >
          {/* Drag handles — stretch chat to your liking */}
          <button
            type="button"
            className="luna-resize-handle luna-resize-handle--corner"
            aria-label="Drag corner to resize chat"
            title="Drag to resize"
            onPointerDown={(e) => startResize(e, "both")}
          />
          <button
            type="button"
            className="luna-resize-handle luna-resize-handle--left"
            aria-label="Drag to change width"
            title="Drag for width"
            onPointerDown={(e) => startResize(e, "width")}
          />
          <button
            type="button"
            className="luna-resize-handle luna-resize-handle--top"
            aria-label="Drag to change height"
            title="Drag for height"
            onPointerDown={(e) => startResize(e, "height")}
          />

          {/* Header: identity + language next to tagline + actions */}
          <header
            className="luna-chat-header luna-drag-grip"
            onPointerDown={startMove}
            onPointerMove={onMovePointer}
            onPointerUp={endMove}
            onPointerCancel={endMove}
          >
            <div className="luna-head-id">
              <div className="luna-avatar luna-avatar-bounce" aria-hidden>
                🌙
              </div>
              <div className="luna-head-copy">
                <p className="luna-head-name">
                  Luna{" "}
                  <span className="luna-online" aria-hidden>
                    · {copy.online}
                  </span>
                </p>
                {/* Tag + EN/ES/HI right next to it — easy language switch */}
                <div className="luna-head-tag-row">
                  <p className="luna-head-tag">{copy.tag}</p>
                  <div
                    className="luna-lang-mini"
                    role="group"
                    aria-label={copy.langLabel}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    {LANG_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`luna-lang-pill${lang === opt.id ? " is-active" : ""}`}
                        onClick={() => switchLunaLang(opt.id)}
                        aria-pressed={lang === opt.id}
                        title={opt.label}
                      >
                        {opt.native}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="luna-head-actions"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={resetPlace}
                className="luna-icon-btn"
                title="Snap back to corner"
                aria-label={copy.place}
              >
                <span className="luna-icon-btn-full">{copy.place}</span>
                <span className="luna-icon-btn-short" aria-hidden>
                  ⌂
                </span>
              </button>
              <button
                type="button"
                onClick={resetSize}
                className="luna-icon-btn"
                title="Default size"
                aria-label={copy.size}
              >
                <span className="luna-icon-btn-full">{copy.size}</span>
                <span className="luna-icon-btn-short" aria-hidden>
                  ⛶
                </span>
              </button>
              <button
                type="button"
                onClick={resetChat}
                className="luna-icon-btn"
                title="Reset chat"
                aria-label={copy.reset}
              >
                <span className="luna-icon-btn-full">{copy.reset}</span>
                <span className="luna-icon-btn-short" aria-hidden>
                  ↺
                </span>
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="luna-icon-btn luna-icon-btn-close"
                aria-label={copy.close}
                title={copy.close}
              >
                ✕
              </button>
            </div>
          </header>

          <div className="luna-progress" aria-label="Booking progress">
            <span className={stepService ? "on" : ""}>{copy.stepService}</span>
            <span className="dot">→</span>
            <span className={stepTime ? "on" : ""}>{copy.stepTime}</span>
            <span className="dot">→</span>
            <span className={stepPhone || stepDone ? "on" : ""}>
              {copy.stepPhone}
            </span>
            <span className="dot">→</span>
            <span className={stepDone ? "on" : ""}>{copy.stepDone}</span>
          </div>

          <div
            ref={scrollerRef}
            className="luna-chat-thread"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={
                  msg.role === "luna"
                    ? "flex items-start gap-2"
                    : "flex justify-end"
                }
              >
                {msg.role === "luna" ? (
                  <div className="luna-avatar luna-avatar-sm mt-0.5" aria-hidden>
                    🌙
                  </div>
                ) : null}

                <div
                  className={
                    msg.role === "luna"
                      ? "flex max-w-[90%] flex-col gap-2"
                      : "max-w-[85%]"
                  }
                >
                  <div
                    className={
                      msg.role === "luna"
                        ? "luna-msg luna-msg-bot"
                        : "luna-msg luna-msg-user"
                    }
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <p key={i} className={i ? "mt-2" : undefined}>
                        {line}
                      </p>
                    ))}
                  </div>

                  {msg.summary ? (
                    <div className="luna-summary">
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent-dark)]">
                        {copy.locked}
                      </p>
                      <p className="mt-2 font-display text-xl text-[var(--text)]">
                        {msg.summary.service}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">
                        {msg.summary.slot} · {msg.summary.price}
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-soft)]">
                        {copy.confirmOn} {msg.summary.phone}
                      </p>
                    </div>
                  ) : null}

                  {msg.picks?.length ? (
                    <div className="flex w-full flex-col gap-1.5">
                      {msg.picks.map((p) => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => pushMessage(`pick:${p.name}`)}
                          className="luna-pick-btn"
                        >
                          <span className="min-w-0 text-left">
                            <span className="block text-sm font-semibold text-[var(--text)]">
                              {p.name}
                            </span>
                            <span className="block text-xs text-[var(--text-soft)]">
                              {p.categoryTitle} · {p.time}
                            </span>
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-[var(--accent-dark)]">
                            {p.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {msg.times?.length && msg.id === last?.id && !thinking ? (
                    <div className="luna-chip-row">
                      {msg.times.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => pushMessage(`time:${slot}`)}
                          className="luna-chip-btn"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : null}

                  {msg.chips?.length && msg.id === last?.id && !thinking ? (
                    <div className="luna-chip-block">
                      {msg.showEg ? (
                        <p className="luna-eg-label">{copy.eg}</p>
                      ) : null}
                      <div className="luna-chip-row">
                        {msg.chips.map((chip) => (
                          <button
                            key={`${chip.label}-${chip.value}`}
                            type="button"
                            onClick={() => pushMessage(chip.value)}
                            className="luna-chip-btn luna-chip-fun"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {msg.showPhone && msg.id === last?.id && !thinking && !done ? (
                    <form onSubmit={submitPhone} className="luna-phone-form">
                      <input
                        ref={phoneFieldRef}
                        type="tel"
                        inputMode="numeric"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="3475364259"
                        className="luna-phone-input"
                        autoComplete="tel"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="luna-chip-btn luna-chip-btn-strong"
                      >
                        Send iMessage
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))}

            {thinking ? (
              <div className="flex items-center gap-2">
                <div className="luna-avatar luna-avatar-sm" aria-hidden>
                  🌙
                </div>
                <div className="luna-msg luna-msg-bot luna-thinking">
                  <span className="luna-dot" />
                  <span className="luna-dot" />
                  <span className="luna-dot" />
                  <span className="luna-thinking-label">{copy.thinking}</span>
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="luna-composer-bar">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.placeholder}
              className="luna-composer-input"
              autoComplete="off"
              disabled={thinking || done}
            />
            <button
              type="submit"
              className="luna-composer-send"
              disabled={thinking || done || !query.trim()}
            >
              {copy.send}
            </button>
          </form>
        </div>
      ) : null}

      {/* Free-roam moon — drag, fling, double-tap magic, click to open */}
      {!open ? (
        <button
          type="button"
          className="luna-fab"
          onPointerDown={startMove}
          onPointerMove={onMovePointer}
          onPointerUp={endMove}
          onPointerCancel={endMove}
          onDoubleClick={onFabDoubleClick}
          aria-expanded={false}
          aria-label="Luna — drag me around, or click to chat"
          title="Drag me · fling me · double-tap for magic"
        >
          <span className="luna-fab-ring" aria-hidden />
          <span className="luna-fab-emoji" aria-hidden>
            🌙
          </span>
          <span className="luna-fab-tip">{dragging ? "I’m flying ✨" : tip}</span>
        </button>
      ) : null}
      </div>
    </>
  );
}
