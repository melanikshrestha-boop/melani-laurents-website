"use client";

import { useEffect, useRef } from "react";
import {
  createBrainNodes,
  drawBrainGlow,
  drawBrainSilhouette,
  drawEEGTraces,
  drawElectrodeGrid,
  drawPeripheralElectrodeGrids,
  drawSynapseNetwork,
  drawSynapseNodes,
  drawVoidBackground,
  NEURO,
  updateBrainNodes,
} from "@/lib/neurotech-brain";

interface NeurotechBrainFieldProps {
  /** Full strength on archive; faint on hub and inner pages */
  variant?: "archive" | "hub" | "ambient";
  active?: boolean;
}

/** Anatomical brain topology — synapse field, EEG traces, electrode grid. */
export function NeurotechBrainField({
  variant = "archive",
  active = true,
}: NeurotechBrainFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const mouseRef = useRef({ x: 0.5, y: 0.5, down: false });
  const scrollVelRef = useRef(0);
  const pulsesRef = useRef<{ x: number; y: number; t: number }[]>([]);

  activeRef.current = active;
  const isHub = variant === "hub";
  const isAmbient = variant === "ambient";
  const isArchive = variant === "archive";
  const intensity = isAmbient ? 0.35 : isHub ? 0.14 : 0.85;
  const hubCenterFade = isHub
    ? { cx: 0.5, cy: 0.46, rx: 0.22, ry: 0.15 }
    : undefined;

  useEffect(() => {
    const canvas = canvasRef.current;

    const onMove = (e: MouseEvent) => {
      if (isArchive && canvas) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      } else {
        mouseRef.current.x = e.clientX / window.innerWidth;
        mouseRef.current.y = e.clientY / window.innerHeight;
      }
    };
    const onDown = (e: MouseEvent) => {
      mouseRef.current.down = true;
      if ((isArchive) && canvas) {
        const rect = canvas.getBoundingClientRect();
        pulsesRef.current.push({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          t: 0,
        });
        if (pulsesRef.current.length > 6) pulsesRef.current.shift();
      }
    };
    const onUp = () => {
      mouseRef.current.down = false;
    };
    const onWheel = (e: WheelEvent) => {
      scrollVelRef.current = Math.min(
        1,
        scrollVelRef.current * 0.7 + Math.abs(e.deltaY) / 1200,
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("wheel", onWheel, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("wheel", onWheel);
    };
  }, [isArchive, isHub]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const nodeCount = reduced ? 40 : isAmbient ? 48 : isHub ? 18 : 72;
    const nodes = createBrainNodes(nodeCount);

    let raf = 0;
    let t = 0;

    const getSize = () => {
      if (isArchive) {
        const parent = canvas.parentElement;
        if (parent) {
          return {
            w: parent.clientWidth,
            h: parent.clientHeight,
          };
        }
      }
      return {
        w: window.innerWidth,
        h: window.innerHeight,
      };
    };

    const resize = () => {
      const { w, h } = getSize();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const resizeObserver =
      isArchive && canvas.parentElement
        ? new ResizeObserver(() => resize())
        : null;
    resizeObserver?.observe(canvas.parentElement!);

    const getScrollP = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(
        "--scroll-p",
      );
      const parsed = parseFloat(raw);
      return Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0;
    };

    const draw = () => {
      if (!activeRef.current && !isHub && !isAmbient) {
        raf = requestAnimationFrame(draw);
        return;
      }

      const scrollP = isHub ? getScrollP() : 0;
      const hubLightMode = scrollP > 0.38;

      const { w, h } = getSize();
      t += reduced ? 0.004 : 0.008;
      scrollVelRef.current *= 0.94;

      const mx = (mouseRef.current.x - 0.5) * (isHub ? 0.09 : 0.05);
      const my = (mouseRef.current.y - 0.5) * (isHub ? 0.08 : 0.05);
      const cx = w * (0.5 + mx);
      const cy = h * (0.46 + my);
      const breathe = 0.9 + Math.sin(t * 0.85) * 0.06 + scrollVelRef.current * 0.06;

      if (isHub || isAmbient) {
        ctx.clearRect(0, 0, w, h);
      } else {
        drawVoidBackground(ctx, w, h);
      }

      if (!isHub) {
        drawBrainGlow(ctx, cx, cy, w, h, breathe, intensity);
        drawBrainSilhouette(ctx, cx, cy, w, h, t, intensity);
      }

      if (isArchive && !reduced) {
        drawElectrodeGrid(ctx, cx, cy, w, h, t, intensity * 0.45);
      }

      if (isHub && !reduced) {
        drawPeripheralElectrodeGrids(ctx, w, h, t, intensity * 0.2, hubLightMode);
      }

      if (!isHub) {
        updateBrainNodes(
          nodes,
          w,
          h,
          cx,
          cy,
          mouseRef.current,
          scrollVelRef.current,
          isHub,
        );
        drawSynapseNetwork(ctx, nodes, w, h, {
          alpha: intensity,
          maxDist: 110,
          lineWidth: 0.8,
          lineRgb: NEURO.iceRgb,
          t,
          lightMode: false,
        });
        drawSynapseNodes(ctx, nodes, w, h, intensity, {});
      }

      if (isHub && !reduced) {
        updateBrainNodes(
          nodes,
          w,
          h,
          cx,
          cy,
          mouseRef.current,
          scrollVelRef.current,
          isHub,
        );
        drawSynapseNetwork(ctx, nodes, w, h, {
          alpha: intensity * 0.35,
          maxDist: 72,
          lineWidth: 0.5,
          lineRgb: hubLightMode ? NEURO.synapseRgb : NEURO.iceRgb,
          t,
          centerFade: hubCenterFade,
          lightMode: hubLightMode,
        });
      }

      if (isArchive && !reduced) {
        drawEEGTraces(ctx, w, h, t, intensity * 0.28, 2, 0.14);
      }

      if (isArchive) {
        pulsesRef.current = pulsesRef.current
          .map((pulse) => ({ ...pulse, t: pulse.t + 1 }))
          .filter((pulse) => pulse.t < 48);

        for (const pulse of pulsesRef.current) {
          const radius = pulse.t * (isHub ? 3.2 : 4);
          const alpha = 1 - pulse.t / 48;
          ctx.strokeStyle = `rgba(${NEURO.accentRgb}, ${alpha * (isHub ? 0.42 : 0.45)})`;
          ctx.lineWidth = isHub ? 1 : 1.2;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [intensity, isAmbient, isArchive, isHub]);

  return (
    <canvas
      ref={canvasRef}
      className={
        isHub
          ? "hub-page__brain-field"
          : isAmbient
            ? "neurotech-ambient-field"
            : "hub-scroll-exp__neural"
      }
      aria-hidden
    />
  );
}
