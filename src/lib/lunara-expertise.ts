/**
 * Luna’s service expert brain — plain English, ingredients where it matters.
 * Tied to the live menu names in lunara.ts.
 */

export type ServiceExpert = {
  name: string;
  categoryId: string;
  summary: string;
  bestFor: string;
  whatHappens: string;
  ingredients?: string; // products / actives / materials
  aftercare?: string;
  price: string;
  time: string;
};

const WAX_BASE =
  "We use chocolate hard wax (warm, creamy resin wax). It sticks to hair more than skin, so it tends to feel gentler than older strip wax. Soft oil or powder may prep the skin; cool gel or lotion finishes.";

export const SERVICE_EXPERTS: ServiceExpert[] = [
  // ── Waxing ───────────────────────────────────────────────────────
  {
    name: "Brow Wax",
    categoryId: "waxing",
    price: "$40",
    time: "15 min",
    summary:
      "Shapes the brows with warm chocolate hard wax for a clean, polished arch.",
    bestFor: "Quick tidy brows with a clear shape.",
    whatHappens:
      "Skin is prepped, wax is applied in the direction of growth, then removed cleanly. Stray hairs are cleaned up so both brows match.",
    ingredients: WAX_BASE,
    aftercare: "Skip heavy scrubbing or strong actives on the brow for a day.",
  },
  {
    name: "Brow Tweeze",
    categoryId: "waxing",
    price: "$50",
    time: "20 min",
    summary:
      "Hand shaping with tweezers only — no wax — for precise, controlled cleanup.",
    bestFor: "Sensitive skin or when you want maximum control hair by hair.",
    whatHappens:
      "Each hair is plucked with sterile tweezers along the natural brow line.",
    ingredients:
      "No wax. Optional soothing oil or aloe-style balm if skin looks pink.",
    aftercare: "Avoid rubbing the brow area hard the same day.",
  },
  {
    name: "Brow Threading",
    categoryId: "waxing",
    price: "$25",
    time: "15 min",
    summary:
      "Cotton thread twists and lifts hair at the root for a sharp, detailed edge.",
    bestFor: "Crisp lines and people who prefer no wax on the face.",
    whatHappens:
      "A sterile cotton thread is looped and rolled along the brow to remove fine hairs.",
    ingredients: "100% cotton thread. Optional toner or cool wipe after.",
    aftercare: "Light redness is normal and usually fades quickly.",
  },
  {
    name: "Lip",
    categoryId: "waxing",
    price: "$15",
    time: "5 min",
    summary: "Fast upper-lip wax for a smooth finish.",
    bestFor: "Shadow or peach fuzz above the lip.",
    whatHappens: "Chocolate hard wax on the upper lip, quick remove, soothe.",
    ingredients: WAX_BASE,
  },
  {
    name: "Chin",
    categoryId: "waxing",
    price: "$15",
    time: "10 min",
    summary: "Chin wax to clear coarser or scattered hairs.",
    bestFor: "Chin hairs that catch light or makeup.",
    whatHappens: "Spot wax with chocolate hard wax, then clean edges.",
    ingredients: WAX_BASE,
  },
  {
    name: "Underarms",
    categoryId: "waxing",
    price: "$25",
    time: "15 min",
    summary: "Full underarm wax for smooth results that last longer than shaving.",
    bestFor: "Fewer razor bumps and longer smooth time.",
    whatHappens: "Warm wax, remove, soothe. Hair ideally a few mm long.",
    ingredients: WAX_BASE,
    aftercare: "Loose tops help; avoid heavy deodorant right away if skin is pink.",
  },
  {
    name: "Half Arm",
    categoryId: "waxing",
    price: "$55",
    time: "20 min",
    summary: "Wax from wrist to elbow (or elbow to shoulder — tell us which half).",
    bestFor: "Sleeves-up smooth without a full-arm appointment.",
    whatHappens: "Sectioned hard wax, clean passes, soothe.",
    ingredients: WAX_BASE,
  },
  {
    name: "Full Arm",
    categoryId: "waxing",
    price: "$70",
    time: "30 min",
    summary: "Shoulder to wrist smooth in one visit.",
    bestFor: "Full-arm polish for summer or photos.",
    whatHappens: "Chocolate hard wax in sections along the arm.",
    ingredients: WAX_BASE,
  },
  {
    name: "Lower Leg",
    categoryId: "waxing",
    price: "$55",
    time: "30 min",
    summary: "Knee to ankle (including tops of feet if needed).",
    bestFor: "Smooth lower legs between full-leg visits.",
    whatHappens: "Hard wax in strips/sections, cool finish.",
    ingredients: WAX_BASE,
  },
  {
    name: "Upper Leg",
    categoryId: "waxing",
    price: "$70",
    time: "30 min",
    summary: "Above the knee toward the bikini line — not a full Brazilian.",
    bestFor: "Upper-leg smoothness with shorts or skirts.",
    whatHappens: "Chocolate hard wax, careful around soft skin.",
    ingredients: WAX_BASE,
  },
  {
    name: "Bikini",
    categoryId: "waxing",
    price: "$35+",
    time: "20 min",
    summary:
      "Bikini-line cleanup (women only). “+” means fuller styles are priced to the map we agree on.",
    bestFor: "Swimwear lines and everyday tidy edges.",
    whatHappens:
      "We confirm the shape first, then use hard wax on the bikini line only (or wider if you ask).",
    ingredients: WAX_BASE,
    aftercare: "Loose cotton, skip hot tubs same day, no hard scrubbing.",
  },

  // ── Brows ────────────────────────────────────────────────────────
  {
    name: "Brow Tint",
    categoryId: "brows",
    price: "$30",
    time: "15 min",
    summary: "Semi-permanent dye darkens brow hairs for fuller-looking definition.",
    bestFor: "Light, sparse, or gray brows that disappear without makeup.",
    whatHappens:
      "Tint is applied to dry brows, timed, then wiped clean for even color.",
    ingredients:
      "Professional brow tint (oxidative dye with a developer). Patch test available if you’ve never tinted before.",
    aftercare: "Avoid oil-heavy products on brows for 24 hours so color holds.",
  },
  {
    name: "Brow Lamination + Shaping",
    categoryId: "brows",
    price: "$100",
    time: "45 min",
    summary:
      "Soft-set that brushes brow hairs up and holds them fuller; finished with a clean shape.",
    bestFor: "Flat, uneven, or hard-to-style brows that need a lifted look.",
    whatHappens:
      "Lifting cream, setting lotion, then shape. Think “brow perm,” but softer and more natural.",
    ingredients:
      "Lamination system: lifting solution (thioglycolate-style), neutralizing/setting lotion, nourishing oil or keratin-style conditioner, plus wax or tweeze for shape.",
    aftercare: "Keep brows dry ~24 hours; no brow makeup or heavy steam that day.",
  },
  {
    name: "Brow Lamination + Shaping + Color Boost",
    categoryId: "brows",
    price: "$125",
    time: "60 min",
    summary: "Full package: laminate, shape, and tint for shape + color in one visit.",
    bestFor: "Brows that need lift and depth (best “done” look).",
    whatHappens: "Lamination first, then tint, then final shape check.",
    ingredients:
      "Same lamination system as above + professional brow tint/developer + finishing oil.",
    aftercare: "Dry for 24 hours; skip oils and harsh cleansers on the brow bone.",
  },
  {
    name: "Brow Center",
    categoryId: "brows",
    price: "$10",
    time: "5 min",
    summary: "Tiny cleanup only between the brows (the unibrow zone).",
    bestFor: "Quick tidy between full brow appointments.",
    whatHappens: "Wax or tweeze just the center line.",
    ingredients: "Chocolate hard wax or tweezers — your preference.",
  },

  // ── Lashes ───────────────────────────────────────────────────────
  {
    name: "Lash Lift + Tint",
    categoryId: "lashes",
    price: "$70",
    time: "60 min",
    summary:
      "Lifts your natural lashes from the base and tints them darker so eyes look more open without extensions.",
    bestFor: "Straight lashes, “tired eyes,” low-makeup days.",
    whatHappens:
      "Lashes are wrapped on a silicone shield, lifting cream lifts the curl, then tint deepens color.",
    ingredients:
      "Silicone shields, lash-lift cream (thioglycolate-style), setting lotion, professional lash tint + developer, nourishing serum/oil finish.",
    aftercare: "Keep lashes dry ~24 hours; no mascara that day if you can skip it.",
  },
  {
    name: "Lash Tint",
    categoryId: "lashes",
    price: "$45",
    time: "20 min",
    summary: "Darkens natural lashes only — no lift, no extensions.",
    bestFor: "Soft definition without mascara every morning.",
    whatHappens: "Tint on lashes, timed, wiped clean.",
    ingredients: "Professional lash tint and developer (patch test if first time).",
    aftercare: "Avoid oil cleansers on lashes for a day so color lasts longer.",
  },
  {
    name: "Classic Lash Extensions",
    categoryId: "lashes",
    price: "$150",
    time: "120 min",
    summary:
      "One synthetic extension glued to each natural lash for a full, custom set.",
    bestFor: "Vacation, events, or everyday glam without daily mascara.",
    whatHappens:
      "Isolation of each natural lash, then classic extension applied with medical-grade adhesive. Map can be natural or more dramatic.",
    ingredients:
      "Synthetic classic lash fibers (usually PBT), under-eye gel pads, medical-grade cyanoacrylate lash adhesive, primer, and optional sealant. We keep glue away from skin.",
    aftercare:
      "No water/steam/oil ~24 hours. Brush daily; no rubbing. Fills keep the set full as naturals shed.",
  },
  {
    name: "Lash Clusters",
    categoryId: "lashes",
    price: "Price varies",
    time: "30–45 min",
    summary:
      "Small pre-made clusters for a faster, softer full look than a classic full set.",
    bestFor: "Short-term glam or a lighter extension feel.",
    whatHappens:
      "Clusters are placed along the lash line; style (short/natural/fuller) sets the price.",
    ingredients:
      "Pre-made cluster fans + lash adhesive (same family as extension glue). Tell us if you have glue sensitivity.",
    aftercare: "Gentle cleansing; avoid oil-heavy products at the base.",
  },

  // ── Facials ──────────────────────────────────────────────────────
  {
    name: "Express Facial",
    categoryId: "facials",
    price: "$75",
    time: "30 min",
    summary: "A quick glass-skin reset when you don’t have a full hour.",
    bestFor: "Same-day events, lunch-break glow, first-timer intro.",
    whatHappens:
      "Cleanse → light exfoliation → hydrating toner → soothing mask → moisturizer + SPF.",
    ingredients:
      "Gentle cream or gel cleanser; mild chemical or enzyme exfoliant (lactic/PHA-style or fruit enzyme — not a harsh peel); hydrating toner (often glycerin/aloe); calming mask; light moisturizer; broad-spectrum SPF.",
    aftercare: "SPF matters. Skip strong retinoids the same night if skin feels tender.",
  },
  {
    name: "Classic Facial",
    categoryId: "facials",
    price: "$145",
    time: "60 min",
    summary: "Full-service facial — the balanced maintenance visit.",
    bestFor: "Monthly skin upkeep, dullness, general congestion.",
    whatHappens:
      "Cleanse, steam, exfoliation, optional extractions, face massage, treatment mask, serum, moisturizer, SPF.",
    ingredients:
      "Cleanser; steam to soften; exfoliant (enzyme or gentle AHA/BHA depending on skin); optional extraction with sterile tools; massage medium (light oil or cream); clay or cream mask; hydrating or balancing serum (hyaluronic acid, niacinamide, etc.); moisturizer; SPF.",
    aftercare: "Keep it simple 24 hours — gentle cleanse, moisture, SPF.",
  },
  {
    name: "Hydra Dew",
    categoryId: "facials",
    price: "$80",
    time: "50 min",
    summary: "Hydration-first facial for dry, tight, or dull dehydrated skin.",
    bestFor: "Flaky makeup, tight cheeks, winter skin, dewy finish goals.",
    whatHappens:
      "Creamy cleanse → water-based exfoliation → moisture layers → plumping mask → light cream.",
    ingredients:
      "Creamy cleanser; gentle hydrating exfoliant; hyaluronic-acid style humectants; glycerin and/or aloe; plumping hydrogel or cream mask; lightweight moisturizer. No harsh stripping surfactants.",
    aftercare: "Layer a simple hydrating serum at home; drink water — it helps the dewy look stick.",
  },
  {
    name: "Hydra Medic",
    categoryId: "facials",
    price: "$95",
    time: "50 min",
    summary: "Clarifying facial for breakouts and oil without wrecking the barrier.",
    bestFor: "Congestion, blackheads, oily T-zone, mild acne-prone skin.",
    whatHappens:
      "Gentle cleanse → clarifying exfoliation → balancing serum → calm mask → light barrier cream.",
    ingredients:
      "Gentle cleanser; enzyme or salicylic-acid (BHA) style exfoliation; niacinamide and/or zinc serum; calming mask (often centella/aloe style); light non-comedogenic moisturizer. We avoid over-drying alcohol-heavy products.",
    aftercare: "No picking. SPF. Ease up on strong actives that night if skin stings.",
  },
  {
    name: "Gold / Deep Clean",
    categoryId: "facials",
    price: "$65",
    time: "45 min",
    summary: "Deeper clean for dull, congested, or makeup-heavy buildup.",
    bestFor: "City grime, clogged pores, “my skin looks tired” days.",
    whatHappens:
      "Cleanse, steam, exfoliation, extraction if needed, brightening serum, rich mask.",
    ingredients:
      "Cleanser; steam; exfoliant; sterile extraction tools if needed; brightening serum (vitamin C or gentle brighteners); richer cream or clay-to-cream mask depending on skin type.",
    aftercare: "Moisturize well after extractions; SPF the next morning.",
  },
  {
    name: "Seaweed",
    categoryId: "facials",
    price: "$80",
    time: "50 min",
    summary: "Algae-and-mineral facial for stressed, reactive, or depleted skin.",
    bestFor: "Redness-prone, travel-stressed, or “skin feels off” days.",
    whatHappens:
      "Cleanse → seaweed/algae mask → soothing toner → calm serum → moisturizer.",
    ingredients:
      "Gentle cleanser; seaweed or algae mask (minerals, polysaccharides, often iodine-rich marine extracts); soothing toner; calming serum (centella, panthenol, or similar); barrier moisturizer. Tell us about shellfish/marine allergies.",
    aftercare: "Keep products simple and fragrance-light for a day.",
  },
  {
    name: "Herbal Facial",
    categoryId: "facials",
    price: "$45",
    time: "30 min",
    summary: "Soft botanical facial — gentle, fresh, budget-friendly.",
    bestFor: "Sensitive-feeling skin, teens, first facials, calm glow.",
    whatHappens:
      "Plant-based cleanse → calming care (chamomile/aloe style) → herbal mask → light moisture.",
    ingredients:
      "Botanical cleanser; chamomile, aloe, or green-tea style calmers; herbal cream or gel mask; light moisturizer. Low on strong acids.",
    aftercare: "Great everyday-friendly — just SPF if you go outside.",
  },
  {
    name: "Eye Optimum",
    categoryId: "facials",
    price: "$35",
    time: "30 min",
    summary: "Targeted eye-area treatment for tired, puffy, or dull under-eyes.",
    bestFor: "Screens, late nights, makeup creasing under eyes.",
    whatHappens:
      "Soft cleanse around eyes → eye serum → cooling mask → light moisture.",
    ingredients:
      "Gentle eye-safe cleanser; caffeine and/or peptide-style eye serum; cooling gel or hydrogel eye mask; light eye cream. No harsh acids near the lash line.",
    aftercare: "Pat, don’t rub. Sunglasses + SPF on the orbital bone help long-term.",
  },
  {
    name: "Four Layer",
    categoryId: "facials",
    price: "$80",
    time: "50 min",
    summary:
      "Layered full reset: cleanse, exfoliate, massage, mask, hydrate, finish.",
    bestFor: "Dull, dry, or tired skin that needs more than a quick wipe.",
    whatHappens:
      "Multiple product layers so skin is cleaned, smoothed, massaged, masked, and sealed.",
    ingredients:
      "Cleanser; exfoliant; massage medium; treatment mask; hydrating serum (often HA/glycerin); finishing moisturizer. Customized to how your skin looks that day.",
    aftercare: "Keep the glow — gentle cleanse tonight, SPF tomorrow.",
  },
  {
    name: "Biolight Anti-Aging",
    categoryId: "facials",
    price: "$100",
    time: "50 min",
    summary:
      "Brightening and firming-focused facial for more even, refreshed-looking skin.",
    bestFor: "Dull tone, early fine lines, “I look tired” texture.",
    whatHappens:
      "Cleanse → gentle exfoliation → brightening/firming serum → hydrating mask → firming cream.",
    ingredients:
      "Cleanser; mild exfoliant; vitamin C and/or peptide-style serum; hydrating mask; firming moisturizer. Not a medical laser — it’s professional topical care.",
    aftercare: "SPF is non-negotiable after brightening work. No harsh peels that night.",
  },
];

const byName = new Map(
  SERVICE_EXPERTS.map((e) => [e.name.toLowerCase(), e]),
);

export function getExpertByName(name: string): ServiceExpert | undefined {
  return byName.get(name.toLowerCase().trim());
}

export function formatExpertReply(e: ServiceExpert): string {
  const parts = [
    `${e.name} — ${e.price}, about ${e.time}`,
    "",
    e.summary,
    "",
    `Best for: ${e.bestFor}`,
    "",
    `What we do: ${e.whatHappens}`,
  ];
  if (e.ingredients) {
    parts.push("", `Ingredients / products: ${e.ingredients}`);
  }
  if (e.aftercare) {
    parts.push("", `Aftercare: ${e.aftercare}`);
  }
  parts.push("", "Want me to book it, or explain another service?");
  return parts.join("\n");
}

/** Category-level expert blurbs */
export const CATEGORY_EXPERTS: Record<
  string,
  { title: string; blurb: string; ingredientsNote: string }
> = {
  waxing: {
    title: "Waxing",
    blurb:
      "We remove hair with warm chocolate hard wax — it grips hair more than skin, so it usually feels smoother than old-school strip wax. Face, body, and bikini options.",
    ingredientsNote:
      "Chocolate hard wax (rosin/resin-based warm wax with a cocoa-style finish), prep powder or oil as needed, soothing gel after. Threading uses cotton thread only.",
  },
  brows: {
    title: "Brows",
    blurb:
      "Shape, tint, and lamination so brows look fuller and cleaner without daily pencil work.",
    ingredientsNote:
      "Tint = professional dye + developer. Lamination = lift cream, set lotion, conditioning oil. Shaping = wax and/or tweezers.",
  },
  lashes: {
    title: "Lashes",
    blurb:
      "From a natural tint to a full classic extension set — open the eyes without heavy mascara if you don’t want it.",
    ingredientsNote:
      "Lifts use silicone shields + lift/set lotions + optional tint. Extensions use synthetic fibers + medical-grade adhesive. Always tell us about glue or dye allergies.",
  },
  facials: {
    title: "Facials",
    blurb:
      "Glass-skin style facials matched to your goal: hydrate, clarify, calm, brighten, or a quick express reset. Ingredients change by facial — ask me about any one by name.",
    ingredientsNote:
      "Common building blocks: gentle cleansers, enzymes or mild AHA/BHA, hyaluronic acid, glycerin, aloe, niacinamide, zinc, vitamin C, peptides, caffeine for eyes, seaweed/herbal masks, and SPF to finish.",
  },
};

export function formatCategoryExpert(id: string): string | null {
  const c = CATEGORY_EXPERTS[id];
  if (!c) return null;
  return [
    `${c.title} — expert overview`,
    "",
    c.blurb,
    "",
    `Ingredients & products: ${c.ingredientsNote}`,
    "",
    "Ask me about a specific service (e.g. “What’s in Hydra Medic?” or “Explain brow lamination”) and I’ll go deep — or say book + a time.",
  ].join("\n");
}
