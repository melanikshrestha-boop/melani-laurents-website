"use client";

import { HeroPin, HeroStatic } from "./HeroPin";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function Hero() {
  const reducedMotion = useReducedMotionPreference();

  if (reducedMotion) return <HeroStatic />;
  return <HeroPin />;
}
