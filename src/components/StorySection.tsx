"use client";

import { StoryChapters, StoryChaptersStatic } from "./StoryChapters";
import type { StoryChapter } from "@/data/story";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

export function StorySection({ chapters }: { chapters: StoryChapter[] }) {
  const reducedMotion = useReducedMotionPreference();

  if (reducedMotion) return <StoryChaptersStatic chapters={chapters} />;
  return <StoryChapters chapters={chapters} />;
}
