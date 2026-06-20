"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
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

/** Interstellar cinema intro — 5s brain formation → hold → dissolve → hub. */
export const INTRO_TIMELINE = {
  /** Cortical mass + sulci formation (0→3s). */
  brainFormMs: 3000,
  /** Hold complete brain + name (3→5s). */
  holdMs: 2000,
  /** Total intro before handoff begins. */
  durationMs: 5000,
  /** Canvas + overlay crossfade into static hub underneath. */
  handoffFadeMs: 700,
  /** Brief quote flash — hub quote takes over after fade. */
  quoteFlashMs: 4200,
  quoteFadeMs: 380,
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
    text: "Don't let the noise of others' opinions drown out your own inner voice.",
    attribution: "Steve Jobs · Stanford, 2005",
    variant: "teaser",
  },
];

const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;

/** Map brainForm 0→1 to visible letter count — name pops as tissue forms. */
function lettersFromBrainForm(brainForm: number): number {
  const p = Math.min(1, Math.max(0, (brainForm - 0.06) / 0.78));
  return Math.min(FIRST_NAME.length, Math.floor(p * (FIRST_NAME.length + 0.5)));
}

function secondLineFromBrainForm(brainForm: number): boolean {
  return brainForm >= 0.74;
}

/** Anatomical brain forms center-outward; name syncs to brainForm; synapses clip inside tissue. */
export function NeuralCinemaIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [handoff, setHandoff] = useState(false);
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
    window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(INTRO_KEY, "1");
      window.dispatchEvent(new Event(INTRO_COMPLETE_EVENT));
    }, INTRO_TIMELINE.handoffFadeMs);
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
    const nodes = createBrainNodes(180);
    let edges = buildNeuralMesh(nodes, window.innerWidth, window.innerHeight, {
      maxDistNorm: 0.11,
      extraNeighbors: 2,
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

      const brainForm = easeOutCubic(
        Math.min(1, elapsed / INTRO_TIMELINE.brainFormMs),
      );
      const holdPhase = Math.min(
        1,
        Math.max(0, (elapsed - INTRO_TIMELINE.brainFormMs) / INTRO_TIMELINE.holdMs),
      );
      const synapseAlpha =
        Math.min(1, Math.max(0, (brainForm - 0.22) / 0.55)) *
        (0.42 + holdPhase * 0.38 + Math.sin(t * 1.4) * 0.06);
      const intensity = 0.72 + Math.sin(t * 1.5) * 0.06;

      const letters = lettersFromBrainForm(brainForm);
      const showSecond = secondLineFromBrainForm(brainForm);
      if (letters !== lastLettersRef.current) {
        lastLettersRef.current = letters;
        setVisibleLetters(letters);
      }
      if (showSecond !== lastSecondLineRef.current) {
        lastSecondLineRef.current = showSecond;
        setSecondLineVisible(showSecond);
      }

      const drift = (1 - brainForm) * w * 0.012;
      const cx = w * 0.5 + Math.sin(t * 0.28) * drift;
      const cy = h * 0.46 + Math.cos(t * 0.24) * drift * 0.4;
      const breathe = 0.96 + Math.sin(t * 0.85) * 0.03;

      drawCreamBackground(ctx, w, h);
      drawBrainGlow(ctx, cx, cy, w, h, breathe, 0.08 + brainForm * 0.28, brainForm, true);
      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm, true);

      if (synapseAlpha > 0.04) {
        ctx.save();
        clipBrainSilhouette(ctx, cx, cy, w, h, breathe);
        drawConnectedSynapseNetwork(ctx, nodes, edges, w, h, {
          alpha: synapseAlpha,
          lineWidth: 0.65,
          t,
          showPotentials: brainForm > 0.48,
          lightMode: true,
          embedded: true,
        });
        ctx.restore();
      }

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
      className={`intro-shell${handoff ? " intro-shell--handoff" : ""}${
        handoff ? " pointer-events-none" : ""
      }`}
      aria-hidden={handoff}
    >
      <canvas
        ref={canvasRef}
        className={`intro-shell__canvas absolute inset-0 z-0 h-full w-full${
          handoff ? " intro-shell__canvas--handoff" : ""
        }`}
        aria-hidden
      />

      <div
        className={`intro-shell__vignette pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(3,5,8,0.35)] via-transparent to-[rgba(126,184,218,0.08)] ${
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
              contact
            </span>
          </nav>
        </footer>
      </div>

      <button
        type="button"
        onClick={finish}
        className={`intro-shell__skip absolute right-6 top-6 z-10 rounded-sm border border-white/16 bg-white/10 px-4 py-1.5 font-mono-label text-[10px] tracking-[0.25em] text-white/55 uppercase backdrop-blur-sm transition-colors hover:border-[rgba(239,68,35,0.35)] hover:text-[var(--hub-accent)]${
          handoff ? " opacity-0" : ""
        }`}
      >
        Skip →
      </button>
    </div>
  );
}
