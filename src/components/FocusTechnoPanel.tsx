"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCinema } from "./cinema/CinemaProvider";
import { focusTechnoAudio, FOCUS_BPM } from "@/lib/focus-techno-audio";

/** Carlo-scale focus audio — toggle, BPM readout, scroll/pointer filter modulation. */
export function FocusTechnoPanel() {
  const { soundtrackOn, toggleSoundtrack } = useCinema();
  const rafRef = useRef<number | null>(null);
  const intensityRef = useRef(0);

  const tickModulation = useCallback(() => {
    if (!soundtrackOn) {
      focusTechnoAudio.setModulation(0);
      return;
    }

    intensityRef.current *= 0.92;
    focusTechnoAudio.setModulation(intensityRef.current);
    rafRef.current = requestAnimationFrame(tickModulation);
  }, [soundtrackOn]);

  useEffect(() => {
    if (!soundtrackOn) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      focusTechnoAudio.setModulation(0);
      return;
    }

    rafRef.current = requestAnimationFrame(tickModulation);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [soundtrackOn, tickModulation]);

  useEffect(() => {
    if (!soundtrackOn) return;

    const bump = (amount: number) => {
      intensityRef.current = Math.min(1, intensityRef.current + amount);
    };

    const onWheel = (e: WheelEvent) => {
      bump(Math.min(0.35, Math.abs(e.deltaY) / 900));
    };

    const onScroll = () => {
      bump(0.08);
    };

    const onMove = (e: MouseEvent) => {
      const y = e.clientY / window.innerHeight;
      intensityRef.current = Math.max(
        intensityRef.current * 0.96,
        y * 0.45,
      );
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMove);
    };
  }, [soundtrackOn]);

  return (
    <div className={`focus-techno ${soundtrackOn ? "focus-techno--on" : ""}`}>
      {soundtrackOn ? (
        <>
          <span className="focus-techno__label" aria-hidden>
            Peak Hours
          </span>
          <span className="focus-techno__bpm" aria-hidden>
            {FOCUS_BPM}
            <span className="focus-techno__bpm-unit">BPM</span>
          </span>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => void toggleSoundtrack()}
        className="focus-techno__toggle"
        aria-pressed={soundtrackOn}
        aria-label={
          soundtrackOn ? "Mute peak hours beats" : "Turn on peak hours beats"
        }
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          {soundtrackOn ? (
            <>
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a9 9 0 010 14.14" />
            </>
          ) : (
            <>
              <path d="M11 5L6 9H3v6h3l5 4V5z" />
              <line x1="17" y1="9" x2="21" y2="15" />
              <line x1="21" y1="9" x2="17" y2="15" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}
