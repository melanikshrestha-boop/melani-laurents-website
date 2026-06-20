"use client";

import { DisplayNameHero, DisplayNameHeroStatic } from "./DisplayNameHero";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function Hero() {
  const reducedMotion = useReducedMotionPreference();

  if (reducedMotion) return <DisplayNameHeroStatic />;
  return <DisplayNameHero />;
}
