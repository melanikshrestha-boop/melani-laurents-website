"use client";

import { useEffect, useRef, type ReactNode } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Smoothstep — avoids muddy mid-tones during void → cream morph. */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/** Scroll-driven void → cream backdrop for the home hub + archive stack. */
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
      const hubBottom = window.scrollY + hubRect.bottom;
      const vh = window.innerHeight;

      const transitionStart = hubBottom - vh * 0.58;
      const transitionEnd = hubBottom + vh * 0.14;
      const span = Math.max(transitionEnd - transitionStart, 1);
      const raw = clamp((window.scrollY - transitionStart) / span, 0, 1);
      const p = smoothstep(raw);

      const value = p.toFixed(4);
      root.style.setProperty("--scroll-p", value);
      document.documentElement.style.setProperty("--scroll-p", value);
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
      document.documentElement.style.removeProperty("--scroll-p");
    };
  }, []);

  return (
    <div ref={rootRef} className="home-sections">
      {children}
    </div>
  );
}
