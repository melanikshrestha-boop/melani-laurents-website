"use client";

import { useMotionScroll } from "@/hooks/useMotionScroll";

/** Opt-in camera / tilt gesture scroll — Carlo-scale, bottom-left. */
export function MotionScrollToggle() {
  const { enabled, mode, cameraLive, error, reducedMotion, toggle, videoRef, canvasRef } =
    useMotionScroll();

  if (reducedMotion) return null;

  const label =
    enabled && mode === "camera"
      ? "Motion scroll on (camera)"
      : enabled && mode === "tilt"
        ? "Motion scroll on (tilt)"
        : "Turn on motion scroll";

  return (
    <div className={`motion-scroll${enabled ? " motion-scroll--on" : ""}`} aria-live="polite">
      <video
        ref={videoRef}
        className="sr-only"
        playsInline
        muted
        aria-hidden
      />
      <canvas ref={canvasRef} className="sr-only" aria-hidden />

      <button
        type="button"
        onClick={toggle}
        className={`motion-scroll__toggle${enabled ? " motion-scroll__toggle--on" : ""}`}
        aria-pressed={enabled}
        aria-label={label}
        title={error ?? label}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
          <path d="M12 2a4 4 0 014 4v1a4 4 0 01-8 0V6a4 4 0 014-4z" />
          <path d="M8 14h8M10 18h4" />
          <path d="M7 10c0-2.8 2.2-5 5-5s5 2.2 5 5" />
        </svg>
        {cameraLive ? (
          <span className="motion-scroll__live" aria-hidden />
        ) : null}
        <span className="sr-only">{label}</span>
      </button>
      {error ? <p className="motion-scroll__error">{error}</p> : null}
    </div>
  );
}
