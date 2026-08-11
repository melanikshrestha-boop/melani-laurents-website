"use client";

import { useEffect, useRef, type ReactNode } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Smoothstep — avoids muddy mid-tones during void → cream morph. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Scroll-driven backdrop + hero exit fade.
 * --scroll-p: void → cream for archive
 * --hero-exit-p: 0 until late in photo scroll, then ramps for brief dissolve only
 */
export function HomeSectionsShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let raf = 0;

    const update = () => {
      const hub = root.querySelector<HTMLElement>(".hub-page");
      if (!hub) return;

      const hubRect = hub.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);
      const hubH = hub.offsetHeight;

      /*
       * How far we've scrolled through the hero (0 at top, 1 when hero
       * bottom hits viewport bottom → leaving for archive).
       */
      const scrolledThrough = clamp(-hubRect.top / Math.max(hubH - vh, 1), 0, 1);

      /*
       * Exit dissolve only in the last ~22% of the photo scroll —
       * invisible on first paint and most of the pan.
       */
      const exitStart = 0.78;
      const exitRaw = clamp((scrolledThrough - exitStart) / (1 - exitStart), 0, 1);
      const heroExit = smoothstep(exitRaw);

      /*
       * Page paper morph: starts as hero finishes, into archive.
       */
      const hubBottomDoc = window.scrollY + hubRect.bottom;
      const transitionStart = hubBottomDoc - vh * 0.85;
      const transitionEnd = hubBottomDoc + vh * 0.2;
      const span = Math.max(transitionEnd - transitionStart, 1);
      const scrollP = smoothstep(
        clamp((window.scrollY - transitionStart) / span, 0, 1)
      );

      root.style.setProperty("--scroll-p", scrollP.toFixed(4));
      root.style.setProperty("--hero-exit-p", heroExit.toFixed(4));
      root.style.setProperty("--hero-pan-p", scrolledThrough.toFixed(4));
      document.documentElement.style.setProperty(
        "--scroll-p",
        scrollP.toFixed(4)
      );
      document.documentElement.style.setProperty(
        "--hero-exit-p",
        heroExit.toFixed(4)
      );
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--scroll-p");
      root.style.removeProperty("--hero-exit-p");
      root.style.removeProperty("--hero-pan-p");
      document.documentElement.style.removeProperty("--scroll-p");
      document.documentElement.style.removeProperty("--hero-exit-p");
    };
  }, []);

  return (
    <div ref={rootRef} className="home-sections">
      {children}
    </div>
  );
}
