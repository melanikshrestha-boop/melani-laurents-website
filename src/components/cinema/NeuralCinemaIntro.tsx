"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { InteractiveTitleLetters } from "@/components/InteractiveTitleLetters";
import {
  buildNeuralMesh,
  clipBrainSilhouette,
  createBrainNodes,
  drawBrainGlow,
  drawConnectedSynapseNetwork,
  drawCreamBackground,
  drawDetailedBrain,
} from "@/lib/neurotech-brain";

export const INTRO_KEY = "mls-intro-seen";
export const INTRO_HANDOFF_START_EVENT = "mls-intro-handoff-start";
export const INTRO_COMPLETE_EVENT = "mls-intro-complete";

/** Cinematic neuron zoom → brain emergence → name drop → static hero fade. */
export const INTRO_TIMELINE = {
  /** Deep neuron zoom with electrical synapses (0→2s). */
  neuronZoomMs: 2000,
  /** Zoom out + brain tissue formation (2s→3.8s). */
  brainEmergenceMs: 1800,
  /** Hold complete brain + name visible — brief pause before fade. */
  holdMs: 200,
  /** Total intro animation duration. */
  durationMs: 4000,
  /** Long crossfade into static hub underneath. */
  handoffFadeMs: 1200,
  /** Quote disabled during neuron intro */
  quoteFlashMs: 99999,
  quoteFadeMs: 520,
} as const;

const FIRST_NAME = "MELANI";

type IntroQuoteVariant = "teaser";

interface IntroQuote {
  id: string;
  text: string;
  attribution: string;
  variant: IntroQuoteVariant;
}

export const INTRO_QUOTES: IntroQuote[] = [
  {
    id: "jobs-stanford",
    text: "Don't let the noise of others' opinions drown out your own inner voice.",
    attribution: "Steve Jobs · Stanford, 2005",
    variant: "teaser",
  },
];

const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;

const easeInOutCubic = (x: number) =>
  x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;

/** Map elapsed time to visible letter count — MELANI drops during zoom-out phase. */
function lettersFromElapsed(elapsed: number): number {
  // Letters start appearing at 2s (neuron zoom ends) and finish by 3.2s
  const letterStartMs = INTRO_TIMELINE.neuronZoomMs;
  const letterEndMs = letterStartMs + 1200;
  const p = Math.min(1, Math.max(0, (elapsed - letterStartMs) / (letterEndMs - letterStartMs)));
  return Math.min(FIRST_NAME.length, Math.floor(p * (FIRST_NAME.length + 0.5)));
}

function secondLineFromElapsed(elapsed: number): boolean {
  // LAURENT S. appears all at once at 3.2s
  return elapsed >= INTRO_TIMELINE.neuronZoomMs + 1200;
}

/** Anatomical brain forms center-outward; name syncs to brainForm; synapses clip inside tissue. */
export function NeuralCinemaIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [handoffProgress, setHandoffProgress] = useState(0);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [secondLineVisible, setSecondLineVisible] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(-1);
  const finishedRef = useRef(false);
  const lastLettersRef = useRef(0);
  const lastSecondLineRef = useRef(false);

  const showQuote = activeQuoteIndex >= 0;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setHandoff(true);
    window.dispatchEvent(new Event(INTRO_HANDOFF_START_EVENT));

    const handoffStart = performance.now();
    document.documentElement.style.setProperty("--intro-handoff-p", "0");

    const tickHandoff = (now: number) => {
      const raw = Math.min(1, (now - handoffStart) / INTRO_TIMELINE.handoffFadeMs);
      const p = easeInOutCubic(raw);
      setHandoffProgress(p);
      document.documentElement.style.setProperty("--intro-handoff-p", String(p));
      if (raw < 1) {
        requestAnimationFrame(tickHandoff);
      } else {
        setVisible(false);
        document.documentElement.style.removeProperty("--intro-handoff-p");
        sessionStorage.setItem(INTRO_KEY, "1");
        window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
      }
    };
    requestAnimationFrame(tickHandoff);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || sessionStorage.getItem(INTRO_KEY) === "1") return;

    setVisible(true);
    const quoteTimer = window.setTimeout(
      () => setActiveQuoteIndex(0),
      INTRO_TIMELINE.quoteFlashMs,
    );
    const endTimer = window.setTimeout(finish, INTRO_TIMELINE.durationMs);

    return () => {
      window.clearTimeout(quoteTimer);
      window.clearTimeout(endTimer);
    };
  }, [finish]);

  useEffect(() => {
    if (!visible) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();
    // Increased node count for richer neural complexity
    const nodes = createBrainNodes(320);
    let edges = buildNeuralMesh(nodes, window.innerWidth, window.innerHeight, {
      maxDistNorm: 0.14, // Slightly increased connection distance for denser mesh
      extraNeighbors: 4, // More neighbors per node for realistic complexity
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      edges = buildNeuralMesh(nodes, window.innerWidth, window.innerHeight, {
        maxDistNorm: 0.11,
        extraNeighbors: 2,
      });
    };
    resize();

    const frame = (now: number) => {
      const elapsed = now - start;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = elapsed * 0.001;

      // Phase 1 (0-2s): Deep zoom into neurons with electrical synapses
      const neuronPhase = Math.min(1, elapsed / INTRO_TIMELINE.neuronZoomMs);

      // Phase 2 (2-3.8s): Zoom out + brain formation
      const emergencePhase = Math.max(0, (elapsed - INTRO_TIMELINE.neuronZoomMs) / INTRO_TIMELINE.brainEmergenceMs);
      const brainForm = easeOutCubic(Math.min(1, emergencePhase));

      // Zoom level: starts at ~10x magnification, smoothly zooms out to 1x over 4s
      const normalizedElapsed = Math.min(1, elapsed / INTRO_TIMELINE.durationMs);
      const zoomLevel = 10 * (1 - easeInOutCubic(normalizedElapsed));
      const zoomMax = Math.max(1, zoomLevel);

      const holdPhase = Math.min(
        1,
        Math.max(0, (elapsed - INTRO_TIMELINE.neuronZoomMs - INTRO_TIMELINE.brainEmergenceMs) / INTRO_TIMELINE.holdMs),
      );

      // Synapse visibility: very prominent at start with strong electrical activity
      // During zoom phase (0-2s), synapses are the main visual
      const baseAlpha = Math.max(0.3, 1 - brainForm * 0.65); // Strong until brain fully forms
      const electricalVariation = 0.7 + Math.sin(t * 2.6) * 0.3; // Strong pulsing variation
      const synapseAlpha = baseAlpha * electricalVariation;

      const intensity = 0.72 + Math.sin(t * 1.4) * 0.08;

      const letters = lettersFromElapsed(elapsed);
      const showSecond = secondLineFromElapsed(elapsed);
      if (letters !== lastLettersRef.current) {
        lastLettersRef.current = letters;
        setVisibleLetters(letters);
      }
      if (showSecond !== lastSecondLineRef.current) {
        lastSecondLineRef.current = showSecond;
        setSecondLineVisible(showSecond);
      }

      // Minimal drift to keep brain centered for seamless transition
      // Text is centered at (0.5, 0.5), brain should match exactly
      const drift = (1 - brainForm) * w * 0.006;
      const cx = w * 0.5 + Math.sin(t * 0.15) * drift * 0.3;
      const cy = h * 0.5 + Math.cos(t * 0.12) * drift * 0.2; // Centered vertically
      const breathe = 0.98 + Math.sin(t * 0.55) * 0.015; // Subtle breathing

      drawCreamBackground(ctx, w, h);

      // Apply zoom transformation for deep neuron view
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoomMax, zoomMax);
      ctx.translate(-cx, -cy);

      // Enhanced brain glow for visual impact
      const glowIntensity = 0.12 + brainForm * 0.22; // Stronger glow as brain forms
      drawBrainGlow(ctx, cx, cy, w, h, breathe, intensity * glowIntensity, brainForm, true);
      // Draw detailed anatomical brain structure
      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm, true);

      // Draw synapses with detailed electrical activity
      if (synapseAlpha > 0.01) {
        ctx.save();
        // Clip only once tissue becomes visible (let synapses shine early)
        if (brainForm > 0.2) {
          clipBrainSilhouette(ctx, cx, cy, w, h, breathe);
        }

        // Two-pass synapse rendering for depth
        // First pass: subtle background synapses
        drawConnectedSynapseNetwork(ctx, nodes, edges, w, h, {
          alpha: synapseAlpha * 0.35,
          lineWidth: 0.95,
          t: t * 1.8,
          showPotentials: false,
          lightMode: true,
          embedded: false,
        });

        // Second pass: prominent action potentials with fast travel
        drawConnectedSynapseNetwork(ctx, nodes, edges, w, h, {
          alpha: synapseAlpha * 0.85, // Much brighter potentials
          lineWidth: 1.2 - brainForm * 0.4,
          t: t * 3.2, // Very fast pulse animation
          showPotentials: true,
          lightMode: true,
          embedded: brainForm > 0.6,
        });

        ctx.restore();
      }

      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm, true);

      ctx.restore();

      if (elapsed < INTRO_TIMELINE.durationMs + INTRO_TIMELINE.handoffFadeMs + 120) {
        raf = requestAnimationFrame(frame);
      }
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`intro-shell${handoff ? " intro-shell--handoff" : ""}${
        handoff ? " pointer-events-none" : ""
      }`}
      style={{ "--intro-handoff-p": handoffProgress } as CSSProperties}
      aria-hidden={handoff}
    >
      <canvas
        ref={canvasRef}
        className="intro-shell__canvas absolute inset-0 z-0 h-full w-full"
        style={
          handoff
            ? ({ opacity: 1 - handoffProgress } as CSSProperties)
            : undefined
        }
        aria-hidden
      />

      <div
        className={`intro-shell__vignette pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(240,237,229,0.5)] via-transparent to-[rgba(26,43,60,0.04)] ${
          showQuote && !handoff ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <div className="intro-shell__stage">
        <header className="intro-shell__mirror hub-page__header" aria-hidden>
          <div className="hub-page__brand">
            <div className="intro-shell__mirror-mark" />
            <div className="hub-page__brand-meta">
              <p className="hub-page__brand-tag">podcast · research · daily · art</p>
              <p className="hub-page__brand-loc">
                <span className="hub-page__dot-inline" aria-hidden />
                LA / SF / NYC
              </p>
            </div>
          </div>
          <div className="hub-page__socials">
            <div className="intro-shell__mirror-socials" />
          </div>
        </header>

        <div className="intro-shell__center hub-page__center">
          <div className="intro-shell__title-wrap">
            <InteractiveTitleLetters
              variant="cream"
              className="hub-page__title"
              lineClassName="hub-page__title-line"
              firstLineVisibleCount={visibleLetters}
              secondLineVisible={secondLineVisible}
              interactive={false}
            />
          </div>

          <div className="intro-shell__quote-slot hub-page__quote">
            {INTRO_QUOTES.map((quote, index) => {
              const isActive = activeQuoteIndex === index;

              return (
                <blockquote
                  key={quote.id}
                  className={`intro-shell__quote${
                    isActive ? " intro-shell__quote--active" : ""
                  }${handoff ? " intro-shell__quote--handoff" : ""}`}
                  aria-hidden={!isActive}
                >
                  <p>&ldquo;{quote.text}&rdquo;</p>
                  <p className="intro-shell__quote-attr">{quote.attribution}</p>
                </blockquote>
              );
            })}
          </div>
        </div>

        <footer className="intro-shell__mirror hub-page__footer" aria-hidden>
          <nav className="hub-page__nav">
            <span className="hub-page__nav-item">podcast</span>
            <span className="hub-page__nav-item">
              <span className="hub-page__sep"> · </span>
              research
            </span>
            <span className="hub-page__nav-item">
              <span className="hub-page__sep"> · </span>
              daily
            </span>
            <span className="hub-page__nav-item">
              <span className="hub-page__sep"> · </span>
              art
            </span>
            <span className="hub-page__nav-item hub-page__nav-item--contact">
              <span className="hub-page__sep"> · </span>
              <span className="hub-page__nav-contact">contact</span>
            </span>
          </nav>
        </footer>
      </div>

      <button
        type="button"
        onClick={finish}
        className="intro-shell__skip absolute right-6 top-6 z-10 rounded-sm border px-4 py-1.5 font-mono-label text-[10px] tracking-[0.25em] uppercase backdrop-blur-sm transition-colors"
      >
        Skip
      </button>
    </div>
  );
}
