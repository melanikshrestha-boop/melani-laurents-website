"use client";

import { useEffect, useRef, type ReactNode } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Home hub + archive.
 * At rest: clean photo, --hero-fade = 0 (NO gradient).
 * After scroll: fade opens and void→cream morphs.
 */
export function HomeSectionsShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const photoHub = root.querySelector<HTMLElement>(".hub-page--photo");

    let raf = 0;

    const update = () => {
      const hub =
        photoHub ?? root.querySelector<HTMLElement>(".hub-page");
      if (!hub) return;

      const y = Math.max(0, window.scrollY || 0);
      const hubRect = hub.getBoundingClientRect();
      const vh = Math.max(window.innerHeight, 1);

      /* CRITICAL: zero fade until real scroll — no first-paint gradient */
      let heroFade = 0;
      if (y >= 4) {
        heroFade = smoothstep(clamp(y / (vh * 0.75), 0, 1));
      }

      /*
       * Seam dissolve depth (drives the plate's HEIGHT, so its cream bottom
       * stop is always flush with the archive — see .hub-page__dissolve).
       *
       * Scroll y exposes exactly y pixels of cream below the still, so the
       * dissolve is grown at ~2.6x that: the veil always runs well past the
       * strip it has to cover, and the transition reads as one soft gradient
       * rather than a band. Ease-out opens quickly, then settles.
       * Full depth (46vh) lands around 160px of scroll.
       */
      let heroSeam = 0;
      if (y >= 1) {
        const t = clamp((y * 2.6) / (vh * 0.46), 0, 1);
        heroSeam = 1 - (1 - t) * (1 - t);
      }

      const hubBottom = hubRect.bottom;
      const rawLeave = clamp((vh - hubBottom) / (vh * 0.85), 0, 1);
      const scrollP = y < 4 ? 0 : smoothstep(rawLeave);

      const fadeV = heroFade.toFixed(4);
      const scrollV = scrollP.toFixed(4);
      const seamV = heroSeam.toFixed(4);

      root.style.setProperty("--hero-fade", fadeV);
      root.style.setProperty("--hero-seam", seamV);
      root.style.setProperty("--scroll-p", scrollV);
      document.documentElement.style.setProperty("--scroll-p", scrollV);
      if (photoHub) {
        photoHub.style.setProperty("--hero-fade", fadeV);
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    /* Force clean first paint before any scroll listener runs */
    root.style.setProperty("--hero-fade", "0");
    root.style.setProperty("--hero-seam", "0");
    root.style.setProperty("--scroll-p", "0");
    if (photoHub) photoHub.style.setProperty("--hero-fade", "0");

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.removeProperty("--hero-fade");
      root.style.removeProperty("--hero-seam");
      root.style.removeProperty("--scroll-p");
      document.documentElement.style.removeProperty("--scroll-p");
      if (photoHub) photoHub.style.removeProperty("--hero-fade");
    };
  }, []);

  return (
    <div ref={rootRef} className="home-sections">
      {children}
    </div>
  );
}
