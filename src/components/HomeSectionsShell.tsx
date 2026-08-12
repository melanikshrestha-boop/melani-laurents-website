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
 * Home hub + archive stack.
 * Photo hero: cream under the still + --hero-blend deepens the soft dissolve on scroll.
 * Non-photo: scroll-driven void → cream morph.
 */
export function HomeSectionsShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const photoHub = root.querySelector<HTMLElement>(".hub-page--photo");

    /* Photo home: cream locked; dissolve only after user scrolls (0 at rest) */
    if (photoHub) {
      root.style.setProperty("--scroll-p", "1");
      root.style.setProperty("--hero-blend", "0");
      photoHub.style.setProperty("--hero-blend", "0");
      document.documentElement.style.setProperty("--scroll-p", "1");

      let raf = 0;
      const updateBlend = () => {
        const y = window.scrollY || 0;
        const vh = Math.max(window.innerHeight, 1);
        /* Stay fully off until real scroll — no first-paint fog */
        if (y < 2) {
          photoHub.style.setProperty("--hero-blend", "0");
          root.style.setProperty("--hero-blend", "0");
          return;
        }
        /* 0 just after scroll starts → 1 over ~0.6 viewport of travel */
        const raw = clamp(y / (vh * 0.6), 0, 1);
        const blend = smoothstep(raw);
        const v = blend.toFixed(4);
        photoHub.style.setProperty("--hero-blend", v);
        root.style.setProperty("--hero-blend", v);
      };
      const schedule = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(updateBlend);
      };
      schedule();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        photoHub.style.removeProperty("--hero-blend");
        root.style.removeProperty("--hero-blend");
        root.style.removeProperty("--scroll-p");
        document.documentElement.style.removeProperty("--scroll-p");
      };
    }

    let raf = 0;

    const update = () => {
      const hub = root.querySelector<HTMLElement>(".hub-page");
      if (!hub) return;

      const hubRect = hub.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);

      const hubBottomDoc = window.scrollY + hubRect.bottom;
      const transitionStart = hubBottomDoc - vh * 0.85;
      const transitionEnd = hubBottomDoc + vh * 0.2;
      const span = Math.max(transitionEnd - transitionStart, 1);
      const scrollP = smoothstep(
        clamp((window.scrollY - transitionStart) / span, 0, 1)
      );

      const value = scrollP.toFixed(4);
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
