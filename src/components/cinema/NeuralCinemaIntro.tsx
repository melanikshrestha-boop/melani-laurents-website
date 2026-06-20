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

/** Interstellar cinema intro — brain formation → brief hold → dissolve → hub. */
export const INTRO_TIMELINE = {
  /** Cortical mass + sulci formation (0→2.8s). */
  brainFormMs: 2800,
  /** Hold complete brain + name — kept short to avoid dead pause. */
  holdMs: 1100,
  /** Handoff begins while quote is still settling — overlap, not a hard cut. */
  durationMs: 4100,
  /** Long crossfade into static hub underneath. */
  handoffFadeMs: 1200,
  /** Quote enters during hold tail, not after a long freeze. */
  quoteFlashMs: 3300,
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
    const tickHandoff = (now: number) => {
      const raw = Math.min(1, (now - handoffStart) / INTRO_TIMELINE.handoffFadeMs);
      setHandoffProgress(easeInOutCubic(raw));
      if (raw < 1) {
        requestAnimationFrame(tickHandoff);
      } else {
        setVisible(false);
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
        (0.38 + holdPhase * 0.32 + Math.sin(t * 1.4) * 0.04);
      const intensity = 0.68 + Math.sin(t * 1.5) * 0.04;

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
      drawBrainGlow(ctx, cx, cy, w, h, breathe, 0.06 + brainForm * 0.18, brainForm, true);
      drawDetailedBrain(ctx, cx, cy, w, h, t, brainForm, true);

      if (synapseAlpha > 0.04) {
        ctx.save();
        clipBrainSilhouette(ctx, cx, cy, w, h, breathe);
        drawConnectedSynapseNetwork(ctx, nodes, edges, w, h, {
          alpha: synapseAlpha,
          lineWidth: 0.48,
          t,
          showPotentials: false,
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
              <span className="intro-name__lastname-text">LAURENT </span>
              <span className="intro-name__gold">S.</span>
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
