"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  buildNeuronEdges,
  createBrainNodes,
  drawBrainGlow,
  drawCinemaNeurons,
  drawCreamBackground,
  drawDetailedBrain,
} from "@/lib/neurotech-brain";

export const INTRO_KEY = "mls-intro-seen";

/** Cinematic pan timeline (ms) — neuron close-up → brain → name → quick fizzle → hub. */
export const INTRO_TIMELINE = {
  /** Neuron close-up pulls back to full brain. */
  zoomMs: 4200,
  /** First letter (M) lands while brain still resolving. */
  nameStartMs: 2400,
  /** Stagger per letter in "MELANI". */
  letterStaggerMs: 120,
  /** "LAURENT S." after first name complete. */
  secondLineStartMs: 2400 + 6 * 120 + 60,
  /** Brief quote flash — lands, breathes once, then fizzle. */
  quoteStartMs: 3900,
  /** Total intro before fizzle begins. */
  durationMs: 4800,
  /** Fizzle/dissolve into static hub underneath. */
  handoffFadeMs: 580,
} as const;

const FIRST_NAME = "MELANI";
const SECOND_LINE = "LAURENT S.";

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
    text: "Don't let the noise of others' opinions drown out your own inner voice. And most important, have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.",
    attribution: "Steve Jobs · Stanford, 2005",
    variant: "teaser",
  },
];

const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Neuron close-up → anatomical brain → kinetic name → hub. */
export function NeuralCinemaIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [handoff, setHandoff] = useState(false);
  const [visibleLetters, setVisibleLetters] = useState(0);
  const [secondLineVisible, setSecondLineVisible] = useState(false);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(-1);
  const finishedRef = useRef(false);

  const showQuote = activeQuoteIndex >= 0;

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setHandoff(true);
    setFading(true);
    window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(INTRO_KEY, "1");
      window.dispatchEvent(new Event("mls-intro-complete"));
    }, INTRO_TIMELINE.handoffFadeMs);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || sessionStorage.getItem(INTRO_KEY) === "1") return;

    setVisible(true);
    const letterTimers: number[] = [];

    for (let i = 0; i < FIRST_NAME.length; i++) {
      letterTimers.push(
        window.setTimeout(
          () => setVisibleLetters(i + 1),
          INTRO_TIMELINE.nameStartMs + i * INTRO_TIMELINE.letterStaggerMs,
        ),
      );
    }

    const secondLineTimer = window.setTimeout(
      () => setSecondLineVisible(true),
      INTRO_TIMELINE.secondLineStartMs,
    );
    const quoteTimer = window.setTimeout(
      () => setActiveQuoteIndex(0),
      INTRO_TIMELINE.quoteStartMs,
    );
    const endTimer = window.setTimeout(finish, INTRO_TIMELINE.durationMs);

    return () => {
      for (const id of letterTimers) window.clearTimeout(id);
      window.clearTimeout(secondLineTimer);
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
    const nodes = createBrainNodes(220);
    const edges = buildNeuronEdges(nodes, 0.14);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const frame = (now: number) => {
      const elapsed = now - start;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const t = elapsed * 0.001;

      const zoomP = easeOutCubic(Math.min(1, elapsed / INTRO_TIMELINE.zoomMs));
      // Open inside tissue (scale 3.4) → pull back to full brain (1.0).
      const scale = 1 + (1 - zoomP) * 2.4;
      const brainForm = smoothstep(0.18, 0.72, zoomP);
      const intensity = 0.88 + Math.sin(t * 1.7) * 0.08;

      const drift = (1 - zoomP) * w * 0.035;
      const cx = w * 0.5 + Math.sin(t * 0.38) * drift;
      const cy = h * 0.46 + Math.cos(t * 0.32) * drift * 0.5;
      const breathe = 0.94 + Math.sin(t * 0.85) * 0.04;

      drawCreamBackground(ctx, w, h);
      drawBrainGlow(ctx, cx, cy, w, h, breathe, 0.12 + brainForm * 0.38, brainForm, true);
      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm * 0.9, true);
      drawCinemaNeurons(ctx, nodes, edges, w, h, {
        cx,
        cy,
        scale,
        t,
        intensity,
        brainForm,
        lightMode: true,
      });
      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm, true);

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
      className={`intro-shell${fading ? " intro-shell--fizzle" : ""}${
        fading ? " pointer-events-none" : ""
      }`}
      aria-hidden={fading}
    >
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-0 h-full w-full${
          handoff ? " intro-shell__canvas--fizzle" : ""
        }`}
        aria-hidden
      />

      <div
        className={`pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(3,5,8,0.35)] via-transparent to-[rgba(126,184,218,0.08)] transition-opacity duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          showQuote && !handoff ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Title stage — mirrors hub-page__center for seamless handoff */}
      <div className="intro-shell__stage">
        <div
          className={`intro-shell__center ${handoff ? "intro-shell__center--handoff" : ""}`}
        >
          <h1
            className="hub-page__title intro-name"
            aria-label="Melani Laurent S."
          >
            <span className="hub-page__title-line intro-name__line">
              {FIRST_NAME.split("").map((char, i) => (
                <span
                  key={`${char}-${i}`}
                  className={`intro-name__char${
                    i < visibleLetters ? " intro-name__char--in" : ""
                  }`}
                  style={{ "--char-i": i } as CSSProperties}
                  aria-hidden={i >= visibleLetters}
                >
                  {char}
                </span>
              ))}
            </span>
            <span
              className={`hub-page__title-line intro-name__line intro-name__lastname${
                secondLineVisible ? " intro-name__lastname--in" : ""
              }`}
              aria-hidden={!secondLineVisible}
            >
              {SECOND_LINE}
            </span>
          </h1>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-[16%] z-[2] mx-auto min-h-[9rem] max-w-2xl px-8 sm:min-h-[10rem]">
        {INTRO_QUOTES.map((quote, index) => {
          const isActive = activeQuoteIndex === index;

          return (
            <blockquote
              key={quote.id}
              className={`absolute inset-x-0 text-center transition-all duration-[420ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isActive && !handoff
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-3 opacity-0"
              }`}
              aria-hidden={!isActive || handoff}
            >
              <p className="font-serif text-base leading-relaxed text-white/72 sm:text-lg">
                &ldquo;{quote.text}&rdquo;
              </p>
              <p className="font-mono-label mt-3 text-[9px] tracking-[0.3em] text-white/45 uppercase">
                {quote.attribution}
              </p>
            </blockquote>
          );
        })}
      </div>

      <button
        type="button"
        onClick={finish}
        className="absolute right-6 top-6 z-10 rounded-sm border border-white/16 bg-white/10 px-4 py-1.5 font-mono-label text-[10px] tracking-[0.25em] text-white/55 uppercase backdrop-blur-sm transition-colors hover:border-[rgba(239,68,35,0.35)] hover:text-[var(--hub-accent)]"
      >
        Skip →
      </button>
    </div>
  );
}
