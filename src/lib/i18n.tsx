"use client";

/**
 * Language system for Lunara Glow (EN / ES / HI).
 * Why: everyone in NYC should feel welcome — English, Spanish, Hindi.
 * How: simple dictionary + React context. No heavy i18n library.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "es" | "hi";

const LANG_KEY = "lunara-lang"; // localStorage key so choice sticks

/** All UI strings. Service process text stays expert-accurate in EN; labels translate. */
const dict = {
  en: {
    promoOffer: "First visit 20% off",
    promoHours: "Monday to Sunday · 9 a.m. to 9 p.m.",
    promoFull:
      "First visit 20% off · Monday to Sunday · 9 a.m. to 9 p.m.",
    navServices: "Services",
    navNew: "New clients",
    navVisit: "Visit",
    navBook: "Book",
    navMenu: "Menu",
    navCall: "Call",
    langLabel: "Language",
    heroEyebrow: "Astoria · 20+ years",
    heroLine2: "Studio",
    heroLead:
      "Expertly done brows, lashes, waxing, and facials — a menu you can read, a room you can feel. The most accessible beauty studio in New York City.",
    bookNow: "Book now",
    viewMenu: "View menu",
    metaAddress: "Address",
    metaHours: "Hours",
    metaOffer: "Offer",
    menuEyebrow: "Menu",
    menuTitle: "Services",
    menuSub:
      "Name · price · time. Tap a service for the exact process. Add with + then book, or walk in.",
    moreInfo: "More info",
    clickMore: "Click for more info",
    loyalty: "Loyalty",
    newClientNotes: "New client notes",
    clientsEyebrow: "Yelp",
    clientsTitle: "Clients",
    seeYelp: "See all on Yelp",
    expectEyebrow: "Expect",
    expectTitle: "What it looks like",
    expectSub:
      "Real photos of the energy you walk into — polished, calm, no guesswork.",
    videoEyebrow: "Studio film",
    videoTitle: "See the room",
    videoSub:
      "A short look at the studio feel. Hit play — this is the standard we hold.",
    visitEyebrow: "Visit",
    visitTitle: "Book or walk in",
    bookOnline: "Book online",
    call: "Call",
    faqEyebrow: "FAQ",
    faqTitle: "Before you come",
    faq1q: "How long is an appointment?",
    faq1a:
      "Each service lists time on the menu. Combos take longer — we confirm when you book.",
    faq2q: "Do I need to book ahead?",
    faq2a:
      "Booking online is best. Walk-ins welcome when the chair is free — call same day if you can.",
    faq3q: "First visit discount?",
    faq3a: "First visit · 20% off. Mention it when you check in.",
    faq4q: "Loyalty points?",
    faq4a:
      "Each visit +1 point (1→10). At 10: free brow threading, then reset.",
    drawerClose: "Close",
    drawerProcess: "How it works",
    drawerBestFor: "Best for",
    drawerWhatHappens: "Exact process",
    drawerIngredients: "What we use",
    drawerAftercare: "Aftercare",
    drawerAdd: "Add to bag",
    drawerBook: "Book this",
    drawerInBag: "In bag",
    stickyBook: "Book",
    footerNote:
      "Accessible beauty powerhouse. Clear menu. Astoria, NYC.",
    footerVisit: "Visit",
    footerNav: "Navigate",
    yelpReviews: "Yelp reviews",
    hoursDisplay: "Monday to Sunday · 9 a.m. to 9 p.m.",
    offerDisplay: "First visit · 20% off",
  },
  es: {
    promoOffer: "Primera visita 20% de descuento",
    promoHours: "Lunes a domingo · 9 a.m. a 9 p.m.",
    promoFull:
      "Primera visita 20% de descuento · Lunes a domingo · 9 a.m. a 9 p.m.",
    navServices: "Servicios",
    navNew: "Clientes nuevos",
    navVisit: "Visítanos",
    navBook: "Reservar",
    navMenu: "Menú",
    navCall: "Llamar",
    langLabel: "Idioma",
    heroEyebrow: "Astoria · 20+ años",
    heroLine2: "Estudio",
    heroLead:
      "Cejas, pestañas, depilación y faciales con maestría — un menú claro y un espacio que se siente bien. El estudio de belleza más accesible de Nueva York.",
    bookNow: "Reservar ahora",
    viewMenu: "Ver menú",
    metaAddress: "Dirección",
    metaHours: "Horario",
    metaOffer: "Oferta",
    menuEyebrow: "Menú",
    menuTitle: "Servicios",
    menuSub:
      "Nombre · precio · tiempo. Toca un servicio para ver el proceso exacto. Suma con + y reserva, o ven sin cita.",
    moreInfo: "Más info",
    clickMore: "Clic para más info",
    loyalty: "Lealtad",
    newClientNotes: "Notas para clientes nuevos",
    clientsEyebrow: "Yelp",
    clientsTitle: "Clientes",
    seeYelp: "Ver todo en Yelp",
    expectEyebrow: "Espera",
    expectTitle: "Así se ve",
    expectSub:
      "Fotos reales de la energía del estudio — pulido, tranquilo, sin sorpresas.",
    videoEyebrow: "Film del estudio",
    videoTitle: "Mira el espacio",
    videoSub:
      "Un vistazo corto al estudio. Dale play — este es nuestro estándar.",
    visitEyebrow: "Visítanos",
    visitTitle: "Reserva o ven sin cita",
    bookOnline: "Reservar en línea",
    call: "Llamar",
    faqEyebrow: "Preguntas",
    faqTitle: "Antes de venir",
    faq1q: "¿Cuánto dura una cita?",
    faq1a:
      "Cada servicio muestra el tiempo en el menú. Los combos tardan más — lo confirmamos al reservar.",
    faq2q: "¿Debo reservar con anticipación?",
    faq2a:
      "Mejor en línea. Walk-ins bienvenidos si hay silla libre — llama el mismo día si puedes.",
    faq3q: "¿Descuento de primera visita?",
    faq3a:
      "Primera visita · 20% de descuento. Menciónalo al llegar.",
    faq4q: "¿Puntos de lealtad?",
    faq4a:
      "Cada visita +1 punto (1→10). Al 10: threading de cejas gratis, luego reinicia.",
    drawerClose: "Cerrar",
    drawerProcess: "Cómo funciona",
    drawerBestFor: "Ideal para",
    drawerWhatHappens: "Proceso exacto",
    drawerIngredients: "Qué usamos",
    drawerAftercare: "Cuidados después",
    drawerAdd: "Agregar a la bolsa",
    drawerBook: "Reservar esto",
    drawerInBag: "En la bolsa",
    stickyBook: "Reservar",
    footerNote:
      "Belleza accesible de primer nivel. Menú claro. Astoria, NYC.",
    footerVisit: "Visítanos",
    footerNav: "Navegar",
    yelpReviews: "Reseñas Yelp",
    hoursDisplay: "Lunes a domingo · 9 a.m. a 9 p.m.",
    offerDisplay: "Primera visita · 20% de descuento",
  },
  hi: {
    promoOffer: "पहली विज़िट 20% छूट",
    promoHours: "सोमवार से रविवार · सुबह 9 से रात 9",
    promoFull:
      "पहली विज़िट 20% छूट · सोमवार से रविवार · सुबह 9 से रात 9",
    navServices: "सेवाएँ",
    navNew: "नए क्लाइंट",
    navVisit: "आएँ",
    navBook: "बुक करें",
    navMenu: "मेनू",
    navCall: "कॉल",
    langLabel: "भाषा",
    heroEyebrow: "एस्टोरिया · 20+ वर्ष",
    heroLine2: "स्टूडियो",
    heroLead:
      "भ्रू, लैश, वैक्सिंग और फेशियल — साफ मेनू, शांत जगह। न्यूयॉर्क सिटी का सबसे accessible ब्यूटी स्टूडियो।",
    bookNow: "अभी बुक करें",
    viewMenu: "मेनू देखें",
    metaAddress: "पता",
    metaHours: "समय",
    metaOffer: "ऑफर",
    menuEyebrow: "मेनू",
    menuTitle: "सेवाएँ",
    menuSub:
      "नाम · कीमत · समय। प्रक्रिया जानने के लिए सेवा पर टैप करें। + से जोड़ें, बुक करें, या वॉक-इन करें।",
    moreInfo: "और जानकारी",
    clickMore: "और जानकारी के लिए क्लिक करें",
    loyalty: "लॉयल्टी",
    newClientNotes: "नए क्लाइंट नोट्स",
    clientsEyebrow: "Yelp",
    clientsTitle: "क्लाइंट",
    seeYelp: "Yelp पर सब देखें",
    expectEyebrow: "उम्मीद",
    expectTitle: "ऐसा दिखता है",
    expectSub:
      "असली फ़ोटो — पॉलिश्ड, शांत, बिना अटकल।",
    videoEyebrow: "स्टूडियो फ़िल्म",
    videoTitle: "कमरा देखें",
    videoSub:
      "स्टूडियो का छोटा नज़रिया। प्ले दबाएँ — यही हमारा स्तर है।",
    visitEyebrow: "आएँ",
    visitTitle: "बुक करें या वॉक-इन",
    bookOnline: "ऑनलाइन बुक",
    call: "कॉल",
    faqEyebrow: "सवाल",
    faqTitle: "आने से पहले",
    faq1q: "अपॉइंटमेंट कितनी देर की?",
    faq1a:
      "हर सेवा के साथ समय लिखा है। कॉम्बो ज़्यादा लेते हैं — बुक करते समय पुष्टि।",
    faq2q: "पहले से बुक करना ज़रूरी?",
    faq2a:
      "ऑनलाइन बेहतर। कुर्सी खाली हो तो वॉक-इन ठीक — उसी दिन कॉल करें।",
    faq3q: "पहली विज़िट छूट?",
    faq3a: "पहली विज़िट · 20% छूट। चेक-इन पर बताएँ।",
    faq4q: "लॉयल्टी पॉइंट?",
    faq4a:
      "हर विज़िट +1 (1→10)। 10 पर: मुफ़्त ब्रो थ्रेडिंग, फिर रीसेट।",
    drawerClose: "बंद करें",
    drawerProcess: "कैसे काम करता है",
    drawerBestFor: "किसके लिए",
    drawerWhatHappens: "सटीक प्रक्रिया",
    drawerIngredients: "क्या इस्तेमाल",
    drawerAftercare: "बाद की देखभाल",
    drawerAdd: "बैग में डालें",
    drawerBook: "इसे बुक करें",
    drawerInBag: "बैग में",
    stickyBook: "बुक",
    footerNote:
      "सुलभ ब्यूटी पावरहाउस। साफ मेनू। एस्टोरिया, NYC।",
    footerVisit: "आएँ",
    footerNav: "नेविगेट",
    yelpReviews: "Yelp रिव्यू",
    hoursDisplay: "सोमवार से रविवार · सुबह 9 से रात 9",
    offerDisplay: "पहली विज़िट · 20% छूट",
  },
} as const;

export type DictKey = keyof (typeof dict)["en"];

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: DictKey) => string;
  dict: (typeof dict)["en"];
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Restore saved language on first load (client only)
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_KEY) as Lang | null;
      if (saved === "en" || saved === "es" || saved === "hi") {
        setLangState(saved);
        document.documentElement.lang = saved === "hi" ? "hi" : saved;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(LANG_KEY, l);
      document.documentElement.lang = l === "hi" ? "hi" : l;
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nValue>(() => {
    const d = dict[lang];
    return {
      lang,
      setLang,
      t: (key: DictKey) => d[key] ?? dict.en[key] ?? key,
      dict: d,
    };
  }, [lang, setLang]);

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Safe fallback if used outside provider
    return {
      lang: "en" as Lang,
      setLang: () => {},
      t: (key: DictKey) => dict.en[key],
      dict: dict.en,
    };
  }
  return ctx;
}

export const LANG_OPTIONS: { id: Lang; label: string; native: string }[] = [
  { id: "en", label: "English", native: "EN" },
  { id: "es", label: "Español", native: "ES" },
  { id: "hi", label: "हिन्दी", native: "HI" },
];
