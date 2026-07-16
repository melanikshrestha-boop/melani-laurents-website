"use client";

import { useEffect, useRef } from "react";

type NeuralAmbientProps = {
  accent: string; // spark color for this page
  ink: string; // secondary soft color
};

/**
 * Soft animated neural network behind the whole book.
 * Draws little nodes and links that pulse like thinking.
 */
export function NeuralAmbient({ accent, ink }: NeuralAmbientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null); // drawing surface
  const accentRef = useRef(accent); // latest colors without restarting the loop
  const inkRef = useRef(ink);

  useEffect(() => {
    accentRef.current = accent; // update when page color changes
    inkRef.current = ink;
  }, [accent, ink]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0; // animation frame id
    let w = 0;
    let h = 0;

    // Floating brain-cell dots
    type Node = { x: number; y: number; vx: number; vy: number; r: number; p: number };
    let nodes: Node[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild nodes for this screen size
      const count = Math.floor((w * h) / 28000);
      nodes = Array.from({ length: Math.max(24, Math.min(count, 70)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.5 + Math.random() * 2.5,
        p: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const a = accentRef.current;
      const soft = inkRef.current;

      // Move + draw links
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        n.p += 0.02;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d = Math.hypot(dx, dy);
          if (d > 130) continue;
          ctx.strokeStyle = a;
          ctx.globalAlpha = (1 - d / 130) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(m.x, m.y);
          ctx.stroke();
        }
      }

      // Draw glowing nodes
      for (const n of nodes) {
        const pulse = 0.45 + Math.sin(n.p) * 0.25;
        ctx.globalAlpha = pulse;
        ctx.fillStyle = a;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + Math.sin(n.p) * 0.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = pulse * 0.35;
        ctx.fillStyle = soft;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="kids-book__neural" aria-hidden />;
}
