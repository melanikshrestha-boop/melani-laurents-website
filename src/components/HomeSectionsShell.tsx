"use client";

import { useEffect, useRef, type ReactNode } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Home hub + archive — same model as the old pitch-black hub:
 * normal document scroll. Photo is one screen in the flow.
 * Background morphs void → cream as you leave the hero (no fixed overlays).
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

      /*
       * Pitch-black leave: stay VOID BLACK while any of the still is on screen.
       * Only morph to cream after the photo has fully left the viewport —
       * so cream never peeks under the still as a hard bar.
       */
      const hubBottom = hubRect.bottom;
      let scrollP = 0;
      if (hubBottom <= 0) {
        /* Photo fully above the fold — ramp cream over the next ~0.5 viewport */
        scrollP = smoothstep(clamp((-hubBottom) / (vh * 0.5), 0, 1));
      }

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
