"use client";

import { useEffect, useRef } from "react";
import {
  computeCometState,
  drawHalleyComet,
} from "@/lib/halley-comet-draw";

interface HalleyCometFieldProps {
  /** Full strength on archive; faint on cream hub */
  variant?: "archive" | "hub";
  active?: boolean;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
}

/** Halley's Comet streaking across a star field — scroll & pointer reactive. */
export function HalleyCometField({
  variant = "archive",
  active = true,
}: HalleyCometFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollVelRef = useRef(0);

  activeRef.current = active;
  const isHub = variant === "hub";
  const cometOpacity = isHub ? 0.14 : 1;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    let lastScrollY = window.scrollY;
    let lastScrollT = performance.now();

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(16, now - lastScrollT);
      const delta = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastScrollT = now;
      scrollVelRef.current = scrollVelRef.current * 0.7 + (delta / dt) * 40;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const starCount = isHub
      ? reduced
        ? 40
        : 80
      : reduced
        ? 120
        : 220;

    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
      z: Math.random(),
      size: Math.random() * 1.6 + 0.3,
    }));

    let raf = 0;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      if (!activeRef.current && !isHub) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const w = window.innerWidth;
      const h = window.innerHeight;
      const scrollBoost = Math.min(2.5, Math.abs(scrollVelRef.current));
      scrollVelRef.current *= 0.92;
      t += (reduced ? 0.003 : 0.006) * (1 + scrollBoost * 0.4);

      if (isHub) {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
      }

      const mx = (mouseRef.current.x - 0.5) * 0.06;
      const my = (mouseRef.current.y - 0.5) * 0.06;
      const cx = w * (0.5 + mx);
      const cy = h * (0.45 + my);

      const starSpeed =
        (reduced ? 0.0006 : 0.001) * (1 + scrollBoost * 0.5) * (isHub ? 0.5 : 1);

      for (const star of stars) {
        star.z -= starSpeed;
        if (star.z <= 0) {
          star.z = 1;
          star.x = Math.random() * 2 - 1;
          star.y = Math.random() * 2 - 1;
        }

        const perspective = 1 / star.z;
        const sx = cx + star.x * perspective * w * 0.42;
        const sy = cy + star.y * perspective * h * 0.42;
        const alpha = (1 - star.z) * (isHub ? 0.25 : 0.75);

        ctx.fillStyle = isHub
          ? `rgba(60, 55, 48, ${alpha * 0.35})`
          : `rgba(200, 210, 230, ${alpha})`;
        ctx.fillRect(sx, sy, star.size * 1.4, star.size);
      }

      const cometState = computeCometState(
        t,
        scrollBoost,
        mouseRef.current.x,
        mouseRef.current.y,
      );

      drawHalleyComet(ctx, cometState, {
        w,
        h,
        t,
        scrollBoost,
        mouseX: mouseRef.current.x,
        mouseY: mouseRef.current.y,
        opacity: cometOpacity,
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [isHub, cometOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className={
        isHub
          ? "hub-page__comet"
          : `hub-scroll-exp__comet${active ? " is-active" : ""}`
      }
      aria-hidden
    />
  );
}
