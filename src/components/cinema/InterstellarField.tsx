"use client";

import { useEffect, useRef } from "react";
import {
  createBrainNodes,
  drawBrainGlow,
  drawBrainSilhouette,
  drawEEGTraces,
  drawElectrodeGrid,
  drawSynapseNetwork,
  drawSynapseNodes,
  drawVoidBackground,
  NEURO,
} from "@/lib/neurotech-brain";

export function InterstellarField({ enabled = true }: { enabled?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const scrollRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onScroll = () => {
      scrollRef.current = window.scrollY;
    };
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nodes = createBrainNodes(reduced ? 36 : 56);
    let raf = 0;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      t += reduced ? 0.002 : 0.006;

      const warp = Math.min(1, scrollRef.current / (h * 1.2));
      const mx = (mouseRef.current.x - 0.5) * 0.06;
      const my = (mouseRef.current.y - 0.5) * 0.06;
      const cx = w * (0.5 + mx);
      const cy = h * (0.48 + my);
      const breathe = 0.9 + Math.sin(t * 0.85) * 0.05;

      drawVoidBackground(ctx, w, h);
      drawBrainGlow(ctx, cx, cy, w, h, breathe, 0.45 + warp * 0.2);
      drawBrainSilhouette(ctx, cx, cy, w, h, t, 0.5);
      drawElectrodeGrid(ctx, cx, cy, w, h, t, 0.35);

      for (const node of nodes) {
        node.pulse += 0.03;
        const pull = 0.00004 * (1 + warp);
        const ax = node.anchorX;
        const ay = node.anchorY;
        node.vx += (ax - node.x) * pull;
        node.vy += (ay - node.y) * pull;
        node.x += node.vx;
        node.y += node.vy;
        node.vx *= 0.99;
        node.vy *= 0.99;
      }

      drawSynapseNetwork(ctx, nodes, w, h, { alpha: 0.35, maxDist: 90 });
      drawSynapseNodes(ctx, nodes, w, h, 0.4);
      drawEEGTraces(ctx, w, h, t, 0.3, 3);

      ctx.fillStyle = `rgba(${NEURO.iceRgb}, 0.02)`;
      for (let i = 0; i < 40; i++) {
        const sx = (Math.sin(t * 0.3 + i * 1.7) * 0.5 + 0.5) * w;
        const sy = (Math.cos(t * 0.2 + i * 2.3) * 0.5 + 0.5) * h;
        ctx.fillRect(sx, sy, 1, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      aria-hidden
    />
  );
}
