"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HeroPin() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion || !containerRef.current || !pinRef.current) return;

    const words = wordsRef.current.filter(Boolean) as HTMLSpanElement[];
    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0, y: 60, filter: "blur(8px)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: pinRef.current,
          scrub: 1,
        },
      });

      tl.to(words[0], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.3,
      })
        .to(
          words[1],
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 },
          0.15,
        )
        .to(
          words[2],
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3 },
          0.3,
        )
        .to(
          words,
          {
            opacity: 0.3,
            scale: 0.95,
            filter: "blur(4px)",
            duration: 0.4,
          },
          0.6,
        )
        .to(
          ".hero-resolve",
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 },
          0.75,
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div
        ref={pinRef}
        className="flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
          {(["research", "build", "create"] as const).map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="font-sans text-5xl font-semibold text-foreground/30 sm:text-7xl md:text-8xl"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="hero-resolve max-w-2xl opacity-0 translate-y-8 blur-sm">
          <h1 className="font-sans text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl">
            Med-tech builder.
            <br />
            <span className="text-accent">Researcher.</span> Creator.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted sm:text-lg">
            I build systems, write field notes, and make content — elegant on
            the surface, rigorous underneath.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
            >
              Who I am
            </Link>
            <Link
              href="/research"
              className="rounded-full border border-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
            >
              Read research
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HeroStatic() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="font-sans max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl md:text-6xl">
        Med-tech builder.
        <br />
        <span className="text-accent">Researcher.</span> Creator.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-base text-muted sm:text-lg">
        I build systems, write field notes, and make content at the intersection
        of med-tech and entrepreneurship.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/about"
          className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
        >
          Who I am
        </Link>
        <Link
          href="/research"
          className="rounded-full border border-border px-6 py-2.5 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          Read research
        </Link>
      </div>
    </section>
  );
}
