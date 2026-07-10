export const lunara = {
  name: "Lunara Glow Beauty Salon",
  shortName: "Lunara Glow",
  slogan: "Elegance, made for your Glow.",
  bookingSlogan: "Book at the speed of light.",
  experience: "20+ years of experience",
  intro: "Clear prices. Simple booking.",
  offer: "First-time customers · 20% off",
  loyalty: "Ten visits earn one reward.",
  address: "38-02 Broadway, Astoria, NY 11103",
  phone: "(347) 242-2127",
  phoneDial: "3472422127",
  email: "lunaraglow@gmail.com",
  instagram: "@lunaraglow_astoria",
  yelp: "https://www.yelp.com/biz/queens-beauty-parlor-astoria",
  hours: "Monday to Sunday · 8 a.m. to 9 p.m.",
  services: [
    {
      title: "Waxing",
      id: "waxing",
      eyebrow: "Face, body, bikini — all clean and simple.",
      items: [
        { name: "Brow Wax", price: "$40", time: "15 min" },
        { name: "Brow Tweeze", price: "$50", time: "20 min" },
        { name: "Brow Threading", price: "$25", time: "15 min" },
        { name: "Lip", price: "$15", time: "5 min" },
        { name: "Chin", price: "$15", time: "10 min" },
        { name: "Underarms", price: "$25", time: "15 min" },
        { name: "Half Arm", price: "$55", time: "20 min" },
        { name: "Full Arm", price: "$70", time: "30 min" },
        { name: "Lower Leg", price: "$55", time: "30 min" },
        { name: "Upper Leg", price: "$70", time: "30 min" },
        { name: "Bikini", price: "$35+", time: "20 min" },
      ],
    },
    {
      title: "Brows",
      id: "brows",
      eyebrow: "Soft shape, clean finish, no guesswork.",
      items: [
        { name: "Brow Tint", price: "$30", time: "15 min" },
        { name: "Brow Lamination + Shaping", price: "$100", time: "45 min" },
        {
          name: "Brow Lamination + Shaping + Color Boost",
          price: "$125",
          time: "60 min",
        },
        { name: "Brow Center", price: "$10", time: "5 min" },
      ],
    },
    {
      title: "Lashes",
      id: "lashes",
      eyebrow: "Natural or fuller — we’ll keep it polished.",
      items: [
        { name: "Lash Lift + Tint", price: "$70", time: "60 min" },
        { name: "Lash Tint", price: "$45", time: "20 min" },
        { name: "Classic Lash Extensions", price: "$150", time: "120 min" },
        { name: "Lash Clusters", price: "Price varies", time: "30–45 min" },
      ],
    },
    {
      title: "Facials",
      id: "facials",
      eyebrow: "Glass-skin glow, gentle care, honest results.",
      items: [
        {
          name: "Express Facial",
          price: "$75",
          time: "30 min",
          description:
            "A quick reset with gentle cleanser, light exfoliation, hydrating toner, soothing mask, moisturizer, and SPF. Best when you want a clean, fresh finish without a long appointment.",
        },
        {
          name: "Classic Facial",
          price: "$145",
          time: "60 min",
          description:
            "A full facial with cleanser, steam, exfoliation, optional extractions, massage, treatment mask, serum, moisturizer, and SPF. The balanced all-around option for regular maintenance.",
        },
        {
          name: "Hydra Dew",
          price: "$80",
          time: "50 min",
          description:
            "Built around hydration: creamy cleanser, water-based exfoliation, hyaluronic-acid style moisture, glycerin or aloe support, plumping mask, and a lightweight moisturizer for a dewy finish.",
        },
        {
          name: "Hydra Medic",
          price: "$95",
          time: "50 min",
          description:
            "A clarifying facial with gentle cleanser, enzyme or salicylic-style exfoliation, balancing serum such as niacinamide or zinc, calming mask, and a light barrier moisturizer to keep skin clear without feeling stripped.",
        },
        {
          name: "Gold / Deep Clean",
          price: "$65",
          time: "45 min",
          description:
            "A deeper cleanse with cleanser, steam, exfoliation, extraction if needed, brightening serum, and a rich mask. This is the reset facial for buildup, congestion, and dull skin.",
        },
        {
          name: "Seaweed",
          price: "$80",
          time: "50 min",
          description:
            "An algae-and-mineral focused treatment with cleanser, seaweed or algae mask, soothing toner, calming serum, and moisturizer. Great when skin feels stressed and needs a softer, more balanced finish.",
        },
        {
          name: "Herbal Facial",
          price: "$45",
          time: "30 min",
          description:
            "A botanical facial with plant-based cleansing, chamomile or aloe-style calming care, herbal mask, and a light moisturizer. Gentle, fresh, and easy on sensitive-feeling skin.",
        },
        {
          name: "Eye Optimum",
          price: "$35",
          time: "30 min",
          description:
            "Focused eye-area care with a soft cleanse, caffeine or peptide-style eye serum, cooling mask, and light moisturizer around the eyes. Best for tired-looking eyes that need a quick refresh.",
        },
        {
          name: "Four Layer",
          price: "$80",
          time: "50 min",
          description:
            "Click here to know more: a layered facial built from cleanse, exfoliation, massage, mask, hydration, and finishing care. This is the full reset for skin that feels dull, dry, or tired.",
        },
        {
          name: "Biolight Anti-Aging",
          price: "$100",
          time: "50 min",
          description:
            "A brightening and smoothing facial with cleanser, gentle exfoliation, vitamin C or peptide-style serum, hydrating mask, and a firming moisturizer. Designed to support a more even, refreshed look.",
        },
      ],
    },
  ],
  reviews: [
    {
      quote: "Bima did an amazing job and very kind.",
      author: "Estefanie Z. · Yelp",
    },
    {
      quote: "Bima was wonderful. I am so happy and satisfied.",
      author: "Shraddha S. · Yelp",
    },
    {
      quote: "The service was quick, gentle, and exactly what I wanted.",
      author: "Client review · Yelp",
    },
  ],
  bookingTimes: Array.from({ length: 27 }, (_, index) => {
    const totalMinutes = 8 * 60 + index * 30;
    const hour24 = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const hour12 = ((hour24 + 11) % 12) + 1;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${hour24 < 12 ? "a.m." : "p.m."}`;
  }),
} as const;

export type SalonServiceGroup = (typeof lunara.services)[number];
