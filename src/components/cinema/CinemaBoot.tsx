"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  "GRAVITY WELL · CALIBRATED",
  "NEURAL LINK · STANDBY",
  "SIGNAL INTEGRITY · NOMINAL",
  "MISSION ARCHIVE · MOUNTED",
  "CINEMATIC MODE · ENGAGED",
] as const;

const BOOT_MS = 3200;

interface CinemaBootProps {
  onComplete: () => void;
}

export function CinemaBoot({ onComplete }: CinemaBootProps) {
  const [progress, setProgress] = useState(0);
  const [kb, setKb] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = Math.min(now - start, BOOT_MS);
      const t = elapsed / BOOT_MS;
      setProgress(t);
      setKb(Math.floor(t * 4096));
      setLineIndex(Math.min(BOOT_LINES.length - 1, Math.floor(t * BOOT_LINES.length)));

      if (elapsed >= BOOT_MS) {
        onComplete();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <div className="cinema-boot intro-shell" aria-hidden>
      <div className="cinema-boot__scanlines" />
      <div className="cinema-boot__vignette" />

      <header className="cinema-boot__header">
        <span className="font-mono-label text-[10px] tracking-[0.35em] text-white/50">
          MELANI LAURENT S.
        </span>
        <span className="font-mono-label text-[10px] tracking-[0.2em] text-white/35">
          {String(lineIndex + 1).padStart(2, "0")} / {String(BOOT_LINES.length).padStart(2, "0")}
        </span>
      </header>

      <div className="cinema-boot__center">
        <p className="font-mono-label text-[10px] tracking-[0.45em] text-amber/70 mb-8">
          ENDURANCE · SYSTEM BOOT
        </p>
        <div className="cinema-boot__counter">
          <span className="font-sci-fi-mono text-6xl sm:text-8xl text-white tabular-nums">
            {String(kb).padStart(4, "0")}
          </span>
          <span className="font-mono-label text-sm tracking-[0.3em] text-white/40 mt-2">
            / KB · ASSETS TRANSFERRING
          </span>
        </div>
        <div className="cinema-boot__bar mt-10">
          <div
            className="cinema-boot__bar-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="font-mono-label text-[10px] tracking-[0.25em] text-white/45 mt-6 h-4">
          {BOOT_LINES[lineIndex]}
        </p>
      </div>

      <footer className="cinema-boot__footer">
        <span className="font-mono-label text-[10px] tracking-[0.4em] text-white/35">
          {progress < 1 ? "BOOTING" : "ONLINE"}
        </span>
        <span className="font-mono-label text-[10px] tracking-[0.2em] text-white/25">
          T+ {Math.floor(progress * BOOT_MS)}ms
        </span>
      </footer>
    </div>
  );
}
