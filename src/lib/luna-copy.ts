/**
 * Luna chat copy — EN / ES / HI
 * Why: playful + beginner-friendly. No beauty-speak. Anyone can use it.
 * How: plain words, short steps, fun energy.
 */

import type { Lang } from "@/lib/i18n";

export type LunaCopy = {
  tag: string;
  open: string;
  openHint: string; // tiny line under open for first-timers
  chipLoyalty: string;
  chipWax: string;
  chipBrowse: string;
  chipHelp: string;
  eg: string;
  placeholder: string;
  send: string;
  stepService: string;
  stepTime: string;
  stepPhone: string;
  stepDone: string;
  place: string;
  size: string;
  reset: string;
  close: string;
  langLabel: string;
  switched: string; // after language change
  thinking: string;
  locked: string;
  confirmOn: string;
  funWave: string[];
  loyaltyRules: string;
  helpChoose: string;
};

const en: LunaCopy = {
  tag: "Speed of light ⚡",
  open:
    "Heyyy 🌙 I’m Luna — your booking buddy.\n\nNew here? No stress. Just tap a pink button below or type what you want (brows, wax, lashes, facial).\n\nI’ll walk you through every step like a friend who actually knows the menu.",
  openHint: "Total beginner? Tap a pink button. That’s it.",
  chipLoyalty: "🎁 How free points work",
  chipWax: "✨ Book a chocolate wax",
  chipBrowse: "👀 Just looking around",
  chipHelp: "🆘 Help me choose",
  eg: "Try one →",
  placeholder: 'Try: "brows" or "3pm facial"',
  send: "Send 🚀",
  stepService: "1·Pick",
  stepTime: "2·Time",
  stepPhone: "3·Phone",
  stepDone: "4·Done",
  place: "Place",
  size: "Size",
  reset: "Reset",
  close: "Close",
  langLabel: "Language",
  switched:
    "Language switched ✨ I’ll keep it simple from here. What do you want to book?",
  thinking: "thinking…",
  locked: "You’re locked in 🎉",
  confirmOn: "We’ll confirm on",
  funWave: ["Yesss 💫", "Love that ✨", "Okay bestie 🌙", "On it ⚡", "Say less 💅"],
  loyaltyRules: [
    "Loyalty card 💳 (super simple)",
    "",
    "• You start at 1",
    "• Every finished visit = +1 point ✨",
    "• When you hit 10 → free brow threading 🧵",
    "• Then it resets to 1 and you play again 🔄",
    "",
    "No app. No stress. Just keep coming 💫",
    "Want your first point? Let’s book something →",
  ].join("\n"),
  helpChoose:
    "No idea what to get? Totally fine 🌙\n\nMost people start with:\n• Brows (quick tidy)\n• Chocolate wax (smooth + lasts)\n• A facial (skin reset)\n\nPick a vibe and I’ll show exact options ✨",
};

const es: LunaCopy = {
  tag: "Velocidad luz ⚡",
  open:
    "¡Holaaa 🌙! Soy Luna — tu amiga para reservar.\n\n¿Primera vez? Cero estrés. Toca un botón rosa o escribe lo que quieres (cejas, cera, pestañas, facial).\n\nTe guío paso a paso, fácil y claro.",
  openHint: "¿No sabes nada? Toca un botón rosa. Listo.",
  chipLoyalty: "🎁 Cómo funcionan los puntos",
  chipWax: "✨ Reservar cera de chocolate",
  chipBrowse: "👀 Solo estoy mirando",
  chipHelp: "🆘 Ayúdame a elegir",
  eg: "Prueba uno →",
  placeholder: 'Prueba: "cejas" o "facial a las 3"',
  send: "Enviar 🚀",
  stepService: "1·Elige",
  stepTime: "2·Hora",
  stepPhone: "3·Tel",
  stepDone: "4·Listo",
  place: "Lugar",
  size: "Tamaño",
  reset: "Reset",
  close: "Cerrar",
  langLabel: "Idioma",
  switched:
    "Idioma cambiado ✨ Te lo haré súper simple. ¿Qué quieres reservar?",
  thinking: "pensando…",
  locked: "¡Listo 🎉",
  confirmOn: "Confirmamos al",
  funWave: ["¡Yesss 💫", "Me encanta ✨", "Vamos 🌙", "En eso ⚡", "Hecho 💅"],
  loyaltyRules: [
    "Tarjeta de lealtad 💳 (fácil)",
    "",
    "• Empiezas en 1",
    "• Cada visita terminada = +1 ✨",
    "• Llegas a 10 → threading de cejas gratis 🧵",
    "• Luego vuelve a 1 🔄",
    "",
    "Sin app. Sin estrés 💫",
    "¿Primera visita? Reservemos algo →",
  ].join("\n"),
  helpChoose:
    "¿No sabes qué elegir? Todo bien 🌙\n\nLa mayoría empieza con:\n• Cejas (rápido)\n• Cera de chocolate (suave y dura)\n• Facial (piel nueva)\n\nElige un vibe y te muestro opciones ✨",
};

const hi: LunaCopy = {
  tag: "लाइट स्पीड ⚡",
  open:
    "हेलो 🌙 मैं Luna हूँ — बुकिंग दोस्त।\n\nपहली बार? टेंशन ज़ीरो। गुलाबी बटन दबाओ या लिखो क्या चाहिए (brows, wax, lashes, facial)।\n\nहर स्टेप आसान भाषा में।",
  openHint: "कुछ नहीं पता? गुलाबी बटन दबाओ। बस।",
  chipLoyalty: "🎁 पॉइंट्स कैसे काम करते हैं",
  chipWax: "✨ चॉकलेट वैक्स बुक",
  chipBrowse: "👀 बस देख रही हूँ",
  chipHelp: "🆘 चुनने में मदद",
  eg: "एक ट्राई करो →",
  placeholder: 'ट्राई: "brows" या "3pm facial"',
  send: "भेजो 🚀",
  stepService: "1·चुनो",
  stepTime: "2·समय",
  stepPhone: "3·फ़ोन",
  stepDone: "4·हो गया",
  place: "जगह",
  size: "साइज़",
  reset: "रीसेट",
  close: "बंद",
  langLabel: "भाषा",
  switched:
    "भाषा बदल गई ✨ अब आसान रखूँगी। क्या बुक करना है?",
  thinking: "सोच रही…",
  locked: "लॉक 🎉",
  confirmOn: "कन्फ़र्म",
  funWave: ["यस 💫", "पसंद ✨", "चलो 🌙", "हो गया ⚡", "बेस्ट 💅"],
  loyaltyRules: [
    "लॉयल्टी कार्ड 💳 (बहुत आसान)",
    "",
    "• शुरू 1 से",
    "• हर पूरी विज़िट = +1 ✨",
    "• 10 पर → मुफ़्त ब्रो थ्रेडिंग 🧵",
    "• फिर 1 पर रीसेट 🔄",
    "",
    "ऐप नहीं। टेंशन नहीं 💫",
    "पहला पॉइंट? कुछ बुक करते हैं →",
  ].join("\n"),
  helpChoose:
    "पता नहीं क्या लेना? बिल्कुल ठीक 🌙\n\nज़्यादातर शुरू करते हैं:\n• Brows (जल्दी)\n• Chocolate wax (स्मूद)\n• Facial (स्किन रीसेट)\n\nएक vibe चुनो — ऑप्शन दिखाऊँगी ✨",
};

export const LUNA_COPY: Record<Lang, LunaCopy> = { en, es, hi };

export function lunaCopy(lang: Lang): LunaCopy {
  return LUNA_COPY[lang] ?? en;
}

/** Starter chips — beginner first, playful */
export function starterChips(lang: Lang) {
  const c = lunaCopy(lang);
  return [
    { label: c.chipHelp, value: "help me choose" },
    { label: c.chipLoyalty, value: "Explain the loyalty program" },
    { label: c.chipWax, value: "I want a chocolate wax, schedule it." },
  ];
}

export function openMessage(lang: Lang) {
  const c = lunaCopy(lang);
  return {
    id: "open",
    role: "luna" as const,
    text: `${c.open}\n\n${c.openHint}`,
    chips: starterChips(lang),
    showEg: true,
  };
}
