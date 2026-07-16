"use client";

import { useCallback, useRef } from "react";

/**
 * Soft magical page-turn sounds using the Web Audio API.
 * No audio files needed — works offline and loads instantly.
 */
export function useStorySounds() {
  const ctxRef = useRef<AudioContext | null>(null); // shared audio engine

  // Create (or resume) the browser audio context on first use
  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!ctxRef.current) ctxRef.current = new AC();
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume(); // browsers block audio until a user gesture
    }
    return ctxRef.current;
  }, []);

  // Soft “whoosh + chime” when a page turns
  const playPageTurn = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Low whoosh noise-ish tone
    const whoosh = ctx.createOscillator();
    const whooshGain = ctx.createGain();
    whoosh.type = "triangle";
    whoosh.frequency.setValueAtTime(180, now);
    whoosh.frequency.exponentialRampToValueAtTime(90, now + 0.22);
    whooshGain.gain.setValueAtTime(0.0001, now);
    whooshGain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    whooshGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    whoosh.connect(whooshGain);
    whooshGain.connect(ctx.destination);
    whoosh.start(now);
    whoosh.stop(now + 0.3);

    // Bright spark chime
    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(880, now + 0.04);
    chime.frequency.exponentialRampToValueAtTime(1320, now + 0.18);
    chimeGain.gain.setValueAtTime(0.0001, now + 0.04);
    chimeGain.gain.exponentialRampToValueAtTime(0.07, now + 0.06);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.04);
    chime.stop(now + 0.38);
  }, [ensureCtx]);

  // Tiny pop for line reveals
  const playLinePop = useCallback(() => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(660, now);
    o.frequency.exponentialRampToValueAtTime(990, now + 0.08);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.04, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(now);
    o.stop(now + 0.14);
  }, [ensureCtx]);

  return { playPageTurn, playLinePop };
}
