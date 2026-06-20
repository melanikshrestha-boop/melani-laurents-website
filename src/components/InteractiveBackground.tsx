"use client";

import { useEffect, useRef } from "react";
import { STATIC_BACKGROUND_COLOR } from "@/lib/background-animation";

type AuroraBand = {
  y: number;
  amp: number;
  freq: number;
  speed: number;
  color: string;
};

const BG_COMMENTS = [
  "// curious.soft.fierce",
  "// build in public",
  "// med-tech + golden hour",
  "// signal > noise",
  "// prototype.validate.ship",
  "// research notes below",
] as const;

type InteractiveBackgroundProps = {
  enabled?: boolean;
};

/** Twilight gradient + static code comments + cursor glow. No floating particles. */
export function InteractiveBackground({ enabled = true }: InteractiveBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -9999, y: -9999, active: 0 });
  const smooth = useRef({ x: -9999, y: -9999 });
  const ripples = useRef<{ x: number; y: number; r: number; life: number }[]>([]);
  const aurora = useRef<AuroraBand[]>([]);
  const time = useRef(0);

  useEffect(() => {
    if (!enabled) return;

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

      aurora.current = [
        { y: 0.25, amp: 0.08, freq: 0.003, speed: 0.0004, color: "221, 184, 150" },
        { y: 0.45, amp: 0.1, freq: 0.0025, speed: 0.0003, color: "180, 140, 200" },
        { y: 0.6, amp: 0.07, freq: 0.0035, speed: 0.00035, color: "120, 170, 210" },
      ];
    };

    const drawSky = (t: number) => {
      const { width, height } = canvas;

      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, "#121a3a");
      g.addColorStop(0.3, "#1e1638");
      g.addColorStop(0.55, "#2a1c3c");
      g.addColorStop(0.78, "#3d2840");
      g.addColorStop(1, "#4a2f38");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.00025) * 60,
        height * 0.2 + Math.cos(t * 0.0002) * 40,
        0,
        width * 0.5,
        height * 0.35,
        width * 0.75,
      );
      glow.addColorStop(0, "rgba(255, 200, 160, 0.12)");
      glow.addColorStop(0.5, "rgba(160, 120, 200, 0.08)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (const band of aurora.current) {
        ctx.beginPath();
        for (let x = 0; x <= width; x += 6) {
          const y =
            height * band.y +
            Math.sin(x * band.freq + t * band.speed) * height * band.amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(${band.color}, 0.06)`;
        ctx.fill();
      }

      ctx.textAlign = "left";
      BG_COMMENTS.forEach((line, i) => {
        const cx = width * (0.04 + (i % 2) * 0.48);
        const cy = height * (0.08 + i * 0.14);
        ctx.font = "11px ui-monospace, monospace";
        ctx.fillStyle = `rgba(221, 184, 150, ${0.07 + (i % 3) * 0.03})`;
        ctx.fillText(line, cx, cy);
      });
    };

    if (reduced) {
      resize();
      drawSky(0);
      return;
    }

    let raf = 0;

    const draw = () => {
      time.current += 16;
      pointer.current.active *= 0.96;
      smooth.current.x += (pointer.current.x - smooth.current.x) * 0.06;
      smooth.current.y += (pointer.current.y - smooth.current.y) * 0.06;

      drawSky(time.current);

      const { width, height } = canvas;
      const mx = smooth.current.x;
      const my = smooth.current.y;
      const energy = pointer.current.active;

      if (energy > 0.02 && mx > 0) {
        const radius = 240 + energy * 90;
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, radius);
        aura.addColorStop(0, `rgba(255, 200, 150, ${0.14 * energy})`);
        aura.addColorStop(0.4, `rgba(180, 140, 220, ${0.08 * energy})`);
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);

        ctx.beginPath();
        ctx.arc(mx, my, 36 + energy * 14, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(221, 184, 150, ${0.15 * energy})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ripples.current = ripples.current.filter((ripple) => {
        ripple.r += 2.4;
        ripple.life -= 0.016;
        if (ripple.life <= 0) return false;

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200, 170, 220, ${ripple.life * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        return true;
      });

      raf = requestAnimationFrame(draw);
    };

    const wake = (x: number, y: number, strength = 1) => {
      pointer.current = {
        x,
        y,
        active: Math.min(1, pointer.current.active + strength),
      };
    };

    const onMove = (e: MouseEvent) => wake(e.clientX, e.clientY, 0.35);
    const onClick = (e: MouseEvent) => {
      wake(e.clientX, e.clientY, 1);
      ripples.current.push({ x: e.clientX, y: e.clientY, r: 6, life: 1 });
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
  }, [enabled]);

  if (!enabled) {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{ backgroundColor: STATIC_BACKGROUND_COLOR }}
        aria-hidden
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden
    />
  );
}
