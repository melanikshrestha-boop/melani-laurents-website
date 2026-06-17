"use client";

import { useEffect, useRef } from "react";

/** Quiet by default; a soft rose-gold aura appears only when you move or click. */
export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: 0 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const ripples = useRef<{ x: number; y: number; r: number; life: number }[]>([]);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawBase = () => {
      const { width, height } = canvas;
      const g = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.85,
      );
      g.addColorStop(0, "rgba(45, 32, 38, 0.5)");
      g.addColorStop(0.55, "rgba(18, 15, 17, 0.95)");
      g.addColorStop(1, "#0f0d0e");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    };

    if (reduced) {
      resize();
      drawBase();
      return;
    }

    let raf = 0;

    const draw = () => {
      pointer.current.active *= 0.965;
      smooth.current.x += (pointer.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (pointer.current.y - smooth.current.y) * 0.08;

      drawBase();

      const { width, height } = canvas;
      const mx = smooth.current.x;
      const my = smooth.current.y;
      const energy = pointer.current.active;

      if (energy > 0.02 && mx > 0) {
        const radius = 220 + energy * 80;
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
        aura.addColorStop(0, `rgba(212, 165, 155, ${0.14 * energy})`);
        aura.addColorStop(0.35, `rgba(184, 146, 122, ${0.07 * energy})`);
        aura.addColorStop(0.7, `rgba(140, 110, 120, ${0.03 * energy})`);
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(mx, my, 42 + energy * 12, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 180, 168, ${0.12 * energy})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      ripples.current = ripples.current.filter((ripple) => {
        ripple.r += 2.2;
        ripple.life -= 0.018;
        if (ripple.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 165, 155, ${ripple.life * 0.35})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(draw);
    };

    const wake = (x: number, y: number, strength = 1) => {
      pointer.current = { x, y, active: Math.min(1, pointer.current.active + strength) };
    };

    const onMove = (e: MouseEvent) => wake(e.clientX, e.clientY, 0.35);
    const onClick = (e: MouseEvent) => {
      wake(e.clientX, e.clientY, 1);
      ripples.current.push({ x: e.clientX, y: e.clientY, r: 8, life: 1 });
    };
    const onLeave = () => {
      pointer.current.x = -9999;
      pointer.current.y = -9999;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("mouseleave", onLeave);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
