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
 * Photo home: full-screen crossfade only — still fades out, cream screen fades in.
 * No bottom gradient wipe on the photo. Ever.
 * Non-photo: legacy void → cream morph.
 */
export function HomeSectionsShell({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const photoHub = root.querySelector<HTMLElement>(".hub-page--photo");

    if (photoHub) {
      root.classList.add("home-sections--photo");
      root.style.setProperty("--scroll-p", "1");
      root.style.setProperty("--hero-leave", "0");
      document.documentElement.style.setProperty("--scroll-p", "1");
      root.dataset.left = "0";

      let raf = 0;
      const update = () => {
        const y = Math.max(0, window.scrollY || 0);
        const vh = Math.max(window.innerHeight, 1);
        /*
         * Full-screen leave over exactly one viewport of scroll.
         * Archive is under the fixed layers until leave completes —
         * so it can never paint a cream bar over the still.
         */
        const leave = smoothstep(clamp(y / vh, 0, 1));
        const v = leave.toFixed(4);
        root.style.setProperty("--hero-leave", v);
        /* Only hand off when still is fully gone */
        root.dataset.left = leave >= 0.98 ? "1" : "0";
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
        root.classList.remove("home-sections--photo");
        root.style.removeProperty("--hero-leave");
        root.style.removeProperty("--scroll-p");
        root.removeAttribute("data-left");
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
      {/* Solid cream screen for crossfade — not a gradient on the photo */}
      <div className="home-leave-cream" aria-hidden />
      {children}
    </div>
  );
}
