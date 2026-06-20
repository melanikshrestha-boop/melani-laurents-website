"use client";

import { useCinema } from "./CinemaProvider";

export function SoundtrackToggle({ className = "" }: { className?: string }) {
  const { soundtrackOn, toggleSoundtrack } = useCinema();

  return (
    <button
      type="button"
      onClick={() => void toggleSoundtrack()}
      className={`font-mono-label group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase transition-colors ${className}`}
      aria-pressed={soundtrackOn}
      aria-label={soundtrackOn ? "Mute soundtrack" : "Enable soundtrack"}
    >
      <span
        className={`relative flex h-4 w-7 rounded-full border transition-colors ${
          soundtrackOn
            ? "border-amber/50 bg-amber/15"
            : "border-white/20 bg-white/5"
        }`}
      >
        <span
          className={`absolute top-0.5 h-2.5 w-2.5 rounded-full transition-all ${
            soundtrackOn
              ? "left-3.5 bg-amber"
              : "left-0.5 bg-white/40 group-hover:bg-white/60"
          }`}
        />
      </span>
      <span className={soundtrackOn ? "text-amber/90" : "text-white/45"}>
        {soundtrackOn ? "Sound on" : "Sound off"}
      </span>
    </button>
  );
}

export function SoundtrackPrompt() {
  const { promptVisible, enableSoundtrack, dismissPrompt } = useCinema();

  if (!promptVisible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-[60] -translate-x-1/2 px-4">
      <div className="cinema-hud-panel flex flex-col items-center gap-4 px-8 py-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-mono-label text-[10px] tracking-[0.35em] text-amber/80">
            PEAK HOURS
          </p>
          <p className="mt-1 text-sm text-white/70">
            Focus beats · 126 BPM · scroll to open the filter
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => void enableSoundtrack()}
            className="font-mono-label rounded-sm border border-amber/40 bg-amber/10 px-5 py-2 text-[10px] tracking-[0.3em] text-amber uppercase transition-colors hover:bg-amber/20"
          >
            Turn on
          </button>
          <button
            type="button"
            onClick={dismissPrompt}
            className="font-mono-label px-4 py-2 text-[10px] tracking-[0.25em] text-white/35 uppercase hover:text-white/60"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
