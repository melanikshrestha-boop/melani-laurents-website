"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BinaryDecodeGreeting } from "./BinaryDecodeGreeting";

gsap.registerPlugin(ScrollTrigger);

const HERO_BEATS = ["SIGNAL", "STORY", "FRONTIER"] as const;

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
      gsap.set(words, { opacity: 0, y: -56, filter: "blur(10px)" });
      gsap.set(".hero-resolve", { opacity: 0, y: -28, filter: "blur(8px)" });
      gsap.set(".hero-mission-line", { opacity: 0, letterSpacing: "0.5em" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=220%",
          pin: pinRef.current,
          scrub: 1,
        },
      });

      tl.to(".hero-mission-line", {
        opacity: 1,
        letterSpacing: "0.35em",
        duration: 0.25,
      })
        .to(words[0], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.28,
        })
        .to(
          words[1],
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 },
          0.18,
        )
        .to(
          words[2],
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.28 },
          0.36,
        )
        .to(
          words,
          {
            opacity: 0.18,
            scale: 0.96,
            filter: "blur(6px)",
            duration: 0.35,
          },
          0.62,
        )
        .to(
          ".hero-resolve",
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.4 },
          0.78,
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative h-[320vh]">
      <div
        ref={pinRef}
        className="flex h-screen flex-col items-center justify-center px-6 text-center"
      >
        <p className="hero-mission-line font-mono-label mb-6 text-[10px] text-amber/60">
          ENDURANCE · MISSION BRIEF
        </p>

        <div className="mb-10 min-h-[3rem]">
          <BinaryDecodeGreeting />
        </div>

        <div className="mb-8 flex flex-col gap-2">
          {HERO_BEATS.map((word, i) => (
            <span
              key={word}
              ref={(el) => {
                wordsRef.current[i] = el;
              }}
              className="hero-cinema-beat text-5xl font-bold text-white/20 sm:text-7xl md:text-8xl"
            >
              {word}
            </span>
          ))}
        </div>

        <div className="hero-resolve max-w-2xl opacity-0 -translate-y-6 blur-sm">
          <h1 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl md:text-[2.75rem]">
            I read the brain like a screenplay —
            <br />
            <span className="text-hologram">every spike a cut,</span>
            <br />
            every pattern a scene.
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base text-muted sm:text-lg">
            Neurotech builder, photographer, cinema obsessive. Lab coat in the
            morning, golden hour at dusk, wormhole curiosity always on.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="font-mono-label rounded-sm border border-amber/35 bg-amber/10 px-6 py-2.5 text-[10px] tracking-[0.28em] text-amber uppercase transition-colors hover:bg-amber/20"
            >
              Enter the archive
            </Link>
            <Link
              href="/photography"
              className="font-mono-label rounded-sm border border-white/15 px-6 py-2.5 text-[10px] tracking-[0.28em] text-white/50 uppercase transition-colors hover:border-white/30 hover:text-white/80"
            >
              Frame gallery →
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
      <p className="font-mono-label mb-6 text-[10px] tracking-[0.35em] text-amber/60">
        ENDURANCE · MISSION BRIEF
      </p>
      <div className="mb-8 min-h-[3rem]">
        <BinaryDecodeGreeting />
      </div>
      <h1 className="font-serif max-w-3xl text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
        I read the brain like a screenplay —
        <br />
        <span className="text-hologram">every spike a cut,</span>
        <br />
        every pattern a scene.
      </h1>
      <p className="mx-auto mt-6 max-w-lg text-base text-muted sm:text-lg">
        Neurotech builder, photographer, cinema obsessive. Lab coat in the
        morning, golden hour at dusk, wormhole curiosity always on.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/about"
          className="font-mono-label rounded-sm border border-amber/35 bg-amber/10 px-6 py-2.5 text-[10px] tracking-[0.28em] text-amber uppercase"
        >
          Enter the archive
        </Link>
        <Link
          href="/photography"
          className="font-mono-label rounded-sm border border-white/15 px-6 py-2.5 text-[10px] tracking-[0.28em] text-white/50 uppercase"
        >
          Frame gallery →
        </Link>
      </div>
    </section>
  );
}
