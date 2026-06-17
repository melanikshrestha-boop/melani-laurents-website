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
        const title = section.querySelector(".story-title");
        const lines = section.querySelectorAll(".story-line");

        if (title) {
          ScrollTrigger.create({
            trigger: section,
            start: "top 20%",
            end: "bottom 60%",
            pin: title,
            pinSpacing: false,
          });
        }

        gsap.from(lines, {
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
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
    <div ref={containerRef} className="space-y-32 md:space-y-48">
      {chapters.map((chapter, index) => {
        const flip = index % 2 === 1;
        return (
          <article
            key={chapter.id}
            className="story-chapter relative min-h-[70vh] lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20"
          >
            <div
              className={`story-title mb-8 lg:mb-0 ${
                flip ? "lg:order-2 lg:text-right" : "lg:order-1"
              }`}
            >
              <p className="font-mono-label text-accent mb-2">{chapter.title}</p>
              <h3 className="font-sans text-2xl font-semibold text-foreground md:text-3xl">
                {chapter.subtitle}
              </h3>
            </div>
            <div
              className={`space-y-4 max-w-xl ${
                flip ? "lg:order-1 lg:mr-auto" : "lg:order-2 lg:ml-auto"
              }`}
            >
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
        );
      })}
    </div>
  );
}

export function StoryChaptersStatic({ chapters }: StoryChaptersProps) {
  return (
    <div className="space-y-24">
      {chapters.map((chapter, index) => {
        const flip = index % 2 === 1;
        return (
          <article
            key={chapter.id}
            className="lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20"
          >
            <div className={flip ? "lg:order-2 lg:text-right" : "lg:order-1"}>
              <p className="font-mono-label text-accent mb-2">{chapter.title}</p>
              <h3 className="font-sans text-2xl font-semibold text-foreground md:text-3xl mb-6">
                {chapter.subtitle}
              </h3>
            </div>
            <div
              className={`space-y-4 max-w-xl ${
                flip ? "lg:order-1" : "lg:order-2 lg:ml-auto"
              }`}
            >
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
        );
      })}
    </div>
  );
}
