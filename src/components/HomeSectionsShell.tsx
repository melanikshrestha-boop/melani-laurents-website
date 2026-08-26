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
       * LINEAR in scroll, deliberately. The seam can't open regardless of
       * depth — the plate's bottom stop is opaque cream at any height — so
       * depth only controls how soft the transition looks, and growing it in
       * fixed proportion to scroll keeps that softness constant the whole way
       * down. An ease-out here front-loads the whole dissolve into the first
       * ~160px and reads as the photo lunging at you.
       *
       * SEAM_RATIO is depth per pixel scrolled. Scroll y exposes exactly y
       * pixels of cream below the still, so >1 keeps the veil taller than the
       * strip it covers. Full depth (40vh) lands around 300px of scroll.
       * Raise the ratio to dissolve sooner, lower it to hold the photo longer.
       */
      const SEAM_RATIO = 1.2;
      const SEAM_MAX_VH = 0.4;
      let heroSeam = 0;
      if (y >= 1) {
        heroSeam = clamp((y * SEAM_RATIO) / (vh * SEAM_MAX_VH), 0, 1);
      }

      /*
       * The nav lives at the bottom of the still, so the dissolve washes over
       * it first. Two staged handoffs, both keyed to dissolve depth:
       *   ink — white to near-black while the cream comes in behind it, so it
       *         stays readable through the whole wash instead of vanishing.
       *   out — then it leaves, timed to be gone by the time the archive
       *         content below has arrived.
       */
      const navInk = clamp((heroSeam - 0.12) / 0.3, 0, 1);
      const navOut = 1 - clamp((heroSeam - 0.72) / 0.28, 0, 1);

      const hubBottom = hubRect.bottom;
      const rawLeave = clamp((vh - hubBottom) / (vh * 0.85), 0, 1);
      const scrollP = y < 4 ? 0 : smoothstep(rawLeave);

      const fadeV = heroFade.toFixed(4);
      const scrollV = scrollP.toFixed(4);
      const seamV = heroSeam.toFixed(4);

      root.style.setProperty("--hero-fade", fadeV);
      root.style.setProperty("--hero-seam", seamV);
      root.style.setProperty("--nav-ink", navInk.toFixed(4));
      root.style.setProperty("--nav-out", navOut.toFixed(4));
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
    root.style.setProperty("--nav-ink", "0");
    root.style.setProperty("--nav-out", "1");
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
      root.style.removeProperty("--nav-ink");
      root.style.removeProperty("--nav-out");
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
