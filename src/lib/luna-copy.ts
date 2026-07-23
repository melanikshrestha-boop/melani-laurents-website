/**
 * Luna chat copy — EN / ES / HI
 * Clean text only (no emojis). Full language switch replaces the chat.
 */

import type { Lang } from "@/lib/i18n";

export type LunaCopy = {
  tag: string;
  online: string;
  open: string;
  openHint: string;
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
  switched: string;
  thinking: string;
  locked: string;
  confirmOn: string;
  funWave: string[];
  loyaltyRules: string;
  helpChoose: string;
  /** Related chip labels used in booking flow */
  chipBookThreading: string;
  chipBookWax: string;
  chipBookSomething: string;
  chipExplainLoyalty: string;
  chipBrows: string;
  chipWaxing: string;
  chipBody: string;
  chipFace: string;
  chipLegs: string;
  chipArms: string;
  chipLip: string;
  chipCheckPoints: string;
  chipAddAnother: string;
};

const en: LunaCopy = {
  tag: "Speed of light",
  online: "online",
  open:
    "Hey — I’m Luna, your booking buddy.\n\nNew here? No stress. Tap a pink button below or type what you want (brows, wax, lashes, facial).\n\nI’ll walk you through every step in plain words.",
  openHint: "Total beginner? Tap a pink button. That’s it.",
  chipLoyalty: "How free points work",
  chipWax: "Book a chocolate wax",
  chipBrowse: "Just looking around",
  chipHelp: "Help me choose",
  eg: "Try one",
  placeholder: 'Try: "brows" or "3pm facial"',
  send: "Send",
  stepService: "1 · Pick",
  stepTime: "2 · Time",
  stepPhone: "3 · Phone",
  stepDone: "4 · Done",
  place: "Place",
  size: "Size",
  reset: "Reset",
  close: "Close",
  langLabel: "Language",
  switched:
    "Language set to English. I’ll keep it simple. What do you want to book?",
  thinking: "thinking…",
  locked: "You’re locked in",
  confirmOn: "We’ll confirm on",
  funWave: ["Got it", "Love that", "On it", "Sounds good", "Okay"],
  loyaltyRules: [
    "Loyalty card (super simple)",
    "",
    "• You start at 1",
    "• Every finished visit = +1 point",
    "• When you hit 10 → free brow threading",
    "• Then it resets to 1 and you start again",
    "",
    "No app. No stress. Just keep coming.",
    "Want your first point? Let’s book something.",
  ].join("\n"),
  helpChoose:
    "No idea what to get? Totally fine.\n\nMost people start with:\n• Brows (quick tidy)\n• Chocolate wax (smooth + lasts)\n• A facial (skin reset)\n\nPick a vibe and I’ll show exact options.",
  chipBookThreading: "Book brow threading",
  chipBookWax: "Book chocolate wax",
  chipBookSomething: "Book something",
  chipExplainLoyalty: "Explain loyalty",
  chipBrows: "Brows",
  chipWaxing: "Waxing",
  chipBody: "Body",
  chipFace: "Face",
  chipLegs: "Legs",
  chipArms: "Arms",
  chipLip: "Lip",
  chipCheckPoints: "Check my points",
  chipAddAnother: "Add another booking",
};

const es: LunaCopy = {
  tag: "Velocidad de la luz",
  online: "en línea",
  open:
    "Hola — soy Luna, tu amiga para reservar.\n\n¿Primera vez? Sin estrés. Toca un botón rosa o escribe lo que quieres (cejas, cera, pestañas, facial).\n\nTe guío paso a paso, con palabras fáciles.",
  openHint: "¿No sabes nada? Toca un botón rosa. Listo.",
  chipLoyalty: "Cómo funcionan los puntos",
  chipWax: "Reservar cera de chocolate",
  chipBrowse: "Solo estoy mirando",
  chipHelp: "Ayúdame a elegir",
  eg: "Prueba uno",
  placeholder: 'Prueba: "cejas" o "facial a las 3"',
  send: "Enviar",
  stepService: "1 · Elige",
  stepTime: "2 · Hora",
  stepPhone: "3 · Tel",
  stepDone: "4 · Listo",
  place: "Lugar",
  size: "Tamaño",
  reset: "Reiniciar",
  close: "Cerrar",
  langLabel: "Idioma",
  switched:
    "Idioma en español. Te lo haré súper simple. ¿Qué quieres reservar?",
  thinking: "pensando…",
  locked: "Listo",
  confirmOn: "Confirmamos al",
  funWave: ["Listo", "Me encanta", "Vamos", "Perfecto", "Hecho"],
  loyaltyRules: [
    "Tarjeta de lealtad (fácil)",
    "",
    "• Empiezas en 1",
    "• Cada visita terminada = +1 punto",
    "• Llegas a 10 → threading de cejas gratis",
    "• Luego vuelve a 1 y empiezas de nuevo",
    "",
    "Sin app. Sin estrés. Solo ven.",
    "¿Primera visita? Reservemos algo.",
  ].join("\n"),
  helpChoose:
    "¿No sabes qué elegir? Todo bien.\n\nLa mayoría empieza con:\n• Cejas (rápido)\n• Cera de chocolate (suave y dura más)\n• Facial (piel renovada)\n\nElige un estilo y te muestro las opciones exactas.",
  chipBookThreading: "Reservar threading de cejas",
  chipBookWax: "Reservar cera de chocolate",
  chipBookSomething: "Reservar algo",
  chipExplainLoyalty: "Explicar lealtad",
  chipBrows: "Cejas",
  chipWaxing: "Cera",
  chipBody: "Cuerpo",
  chipFace: "Cara",
  chipLegs: "Piernas",
  chipArms: "Brazos",
  chipLip: "Labio",
  chipCheckPoints: "Ver mis puntos",
  chipAddAnother: "Otra reserva",
};

const hi: LunaCopy = {
  tag: "लाइट स्पीड",
  online: "ऑनलाइन",
  open:
    "नमस्ते — मैं Luna हूँ, आपकी बुकिंग दोस्त।\n\nपहली बार? कोई टेंशन नहीं। गुलाबी बटन दबाओ या लिखो क्या चाहिए (brows, wax, lashes, facial)।\n\nहर स्टेप आसान भाषा में बताऊँगी।",
  openHint: "कुछ नहीं पता? गुलाबी बटन दबाओ। बस।",
  chipLoyalty: "पॉइंट्स कैसे काम करते हैं",
  chipWax: "चॉकलेट वैक्स बुक करें",
  chipBrowse: "बस देख रही हूँ",
  chipHelp: "चुनने में मदद करें",
  eg: "एक ट्राई करें",
  placeholder: 'ट्राई: "brows" या "3pm facial"',
  send: "भेजें",
  stepService: "1 · चुनें",
  stepTime: "2 · समय",
  stepPhone: "3 · फ़ोन",
  stepDone: "4 · हो गया",
  place: "जगह",
  size: "साइज़",
  reset: "रीसेट",
  close: "बंद",
  langLabel: "भाषा",
  switched:
    "भाषा हिंदी है। अब आसान रखूँगी। क्या बुक करना है?",
  thinking: "सोच रही…",
  locked: "लॉक हो गया",
  confirmOn: "कन्फ़र्म करेंगे",
  funWave: ["ठीक है", "अच्छा", "चलो", "हो गया", "बेस्ट"],
  loyaltyRules: [
    "लॉयल्टी कार्ड (बहुत आसान)",
    "",
    "• शुरू 1 से",
    "• हर पूरी विज़िट = +1 पॉइंट",
    "• 10 पर → मुफ़्त ब्रो थ्रेडिंग",
    "• फिर 1 पर रीसेट",
    "",
    "ऐप नहीं। टेंशन नहीं।",
    "पहला पॉइंट? कुछ बुक करते हैं।",
  ].join("\n"),
  helpChoose:
    "पता नहीं क्या लेना? बिल्कुल ठीक।\n\nज़्यादातर शुरू करते हैं:\n• Brows (जल्दी)\n• Chocolate wax (स्मूद)\n• Facial (स्किन रीसेट)\n\nएक विकल्प चुनो — बाकी मैं दिखाऊँगी।",
  chipBookThreading: "ब्रो थ्रेडिंग बुक",
  chipBookWax: "चॉकलेट वैक्स बुक",
  chipBookSomething: "कुछ बुक करें",
  chipExplainLoyalty: "लॉयल्टी समझाएँ",
  chipBrows: "Brows",
  chipWaxing: "वैक्सिंग",
  chipBody: "बॉडी",
  chipFace: "फेस",
  chipLegs: "पैर",
  chipArms: "बाँहें",
  chipLip: "होंठ",
  chipCheckPoints: "मेरे पॉइंट्स",
  chipAddAnother: "एक और बुकिंग",
};

export const LUNA_COPY: Record<Lang, LunaCopy> = { en, es, hi };

export function lunaCopy(lang: Lang): LunaCopy {
  return LUNA_COPY[lang] ?? en;
}

/** Starter chips — beginner first, no emoji */
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
