"use client";

import { useCinema } from "./cinema/CinemaProvider";

/** Small round audio control — Carlo-scale, bottom-right on hub. */
export function HubSoundToggle() {
  const { soundtrackOn, toggleSoundtrack } = useCinema();

  return (
    <button
      type="button"
      onClick={() => void toggleSoundtrack()}
      className={`hub-sound ${soundtrackOn ? "hub-sound--on" : ""}`}
      aria-pressed={soundtrackOn}
      aria-label={soundtrackOn ? "Mute audio" : "Turn on audio"}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
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
  );
}
