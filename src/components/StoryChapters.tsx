"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StoryChapter } from "@/data/story";

gsap.registerPlugin(ScrollTrigger);

interface StoryChaptersProps {
  chapters: StoryChapter[];
}

export function StoryChapters({ chapters }: StoryChaptersProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>(".story-chapter");

      sections.forEach((section) => {
        const lines = section.querySelectorAll(".story-line");

        gsap.from(lines, {
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 20,
          stagger: 0.12,
          duration: 0.6,
          ease: "power2.out",
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="space-y-24 md:space-y-32">
      {chapters.map((chapter) => (
        <article
          key={chapter.id}
          className="story-chapter min-h-[50vh] space-y-6"
        >
          <div className="story-title">
            <p className="font-mono-label text-accent mb-2">{chapter.title}</p>
            <h3 className="font-sans text-2xl font-semibold text-foreground md:text-3xl">
              {chapter.subtitle}
            </h3>
          </div>
          <div className="space-y-4">
            {chapter.body.map((paragraph, i) => (
              <p
                key={i}
                className="story-line text-base leading-relaxed text-muted md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

export function StoryChaptersStatic({ chapters }: StoryChaptersProps) {
  return (
    <div className="space-y-24">
      {chapters.map((chapter) => (
        <article key={chapter.id} className="space-y-6">
          <div>
            <p className="font-mono-label text-accent mb-2">{chapter.title}</p>
            <h3 className="font-sans text-2xl font-semibold text-foreground md:text-3xl">
              {chapter.subtitle}
            </h3>
          </div>
          <div className="space-y-4">
            {chapter.body.map((paragraph, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-muted md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
