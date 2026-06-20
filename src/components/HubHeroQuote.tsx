"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { INTRO_KEY } from "@/components/cinema/NeuralCinemaIntro";

/** Pull quote on hub — hidden while intro plays, shown after first visit. */
export function HubHeroQuote() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const check = () => {
      setVisible(reduced || sessionStorage.getItem(INTRO_KEY) === "1");
    };

    check();
    window.addEventListener("mls-intro-complete", check);
    return () => window.removeEventListener("mls-intro-complete", check);
  }, []);

  if (!visible) return null;

  return (
    <blockquote className="hub-page__quote">
      <p>&ldquo;{siteConfig.heroQuote}&rdquo;</p>
    </blockquote>
  );
}
