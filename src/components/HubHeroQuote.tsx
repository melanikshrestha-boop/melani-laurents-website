"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import {
  INTRO_COMPLETE_EVENT,
  INTRO_HANDOFF_START_EVENT,
  INTRO_KEY,
} from "@/components/cinema/NeuralCinemaIntro";

type QuotePhase = "hidden" | "handoff" | "visible";

/** Pull quote on hub — crossfades in as intro quote dissolves. */
export function HubHeroQuote() {
  const [phase, setPhase] = useState<QuotePhase>("hidden");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced || sessionStorage.getItem(INTRO_KEY) === "1") {
      setPhase("visible");
      return;
    }

    const onHandoff = () => setPhase("handoff");
    const onComplete = () => setPhase("visible");

    window.addEventListener(INTRO_HANDOFF_START_EVENT, onHandoff);
    window.addEventListener(INTRO_COMPLETE_EVENT, onComplete);

    return () => {
      window.removeEventListener(INTRO_HANDOFF_START_EVENT, onHandoff);
      window.removeEventListener(INTRO_COMPLETE_EVENT, onComplete);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <blockquote className="hub-page__quote">
      <p>&ldquo;{siteConfig.heroQuote}&rdquo;</p>
    </blockquote>
  );
}
