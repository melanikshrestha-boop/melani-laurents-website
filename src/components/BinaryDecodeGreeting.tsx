"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotionPreference } from "@/hooks/useReducedMotionPreference";

const TARGET = "I'm Melani Laurent";

const WORDMARK_CLASSES =
  "font-display text-lg font-normal tracking-tight";

const TOTAL_MS = 1000;
const DROP_MS = 56;

function charBits(ch: string): string {
  return ch.charCodeAt(0).toString(2).padStart(8, "0");
}

/** Matches settled greeting — all foreground. */
function letterColorClass(): string {
  return "text-foreground";
}

function CyclingBit({ ch }: { ch: string }) {
  const bits = charBits(ch);
  const [bitIdx, setBitIdx] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setBitIdx((i) => (i + 1) % bits.length);
    }, 14);
    return () => window.clearInterval(id);
  }, [bits]);

  const digit = bits[bitIdx];
  const isOne = digit === "1";

  return (
    <span
      className={`binary-decode-bit font-sci-fi-mono ${isOne ? "binary-decode-bit--one" : ""}`}
      aria-hidden
    >
      {digit}
    </span>
  );
}

function DecodeSlot({
  ch,
  index,
  phase,
}: {
  ch: string;
  index: number;
  phase: "binary" | "drop" | "letter";
}) {
  const slotClass = `binary-decode-slot${phase === "drop" ? " binary-decode-slot--drop" : ""}`;

  if (phase === "binary") {
    return (
      <span className={slotClass}>
        <CyclingBit ch={ch} />
      </span>
    );
  }

  return (
    <span
      className={`${slotClass} ${WORDMARK_CLASSES} ${letterColorClass()}`}
    >
      {ch === " " ? "\u00a0" : ch}
    </span>
  );
}

interface BinaryDecodeGreetingProps {
  className?: string;
}

/** Sci-fi binary decode — letters drop down into place over exactly 1s. */
export function BinaryDecodeGreeting({ className = "" }: BinaryDecodeGreetingProps) {
  const reduced = useReducedMotionPreference();
  const [locked, setLocked] = useState(0);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const dropTimer = useRef<number | null>(null);

  const total = TARGET.length;

  useEffect(() => {
    if (reduced) return;

    const start = performance.now();
    const lockedRef = { current: 0 };
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = Math.min(now - start, TOTAL_MS);
      const nextLocked = Math.min(
        total,
        Math.floor((elapsed / TOTAL_MS) * total),
      );

      if (nextLocked > lockedRef.current) {
        lockedRef.current = nextLocked;
        setLocked(nextLocked);
        setDropIndex(nextLocked - 1);
        if (dropTimer.current) window.clearTimeout(dropTimer.current);
        dropTimer.current = window.setTimeout(() => {
          setDropIndex(null);
        }, DROP_MS);
      }

      if (elapsed >= TOTAL_MS) {
        lockedRef.current = total;
        setLocked(total);
        setFinished(true);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (dropTimer.current) window.clearTimeout(dropTimer.current);
    };
  }, [reduced, total]);

  if (finished || reduced) {
    return (
      <div className={`text-center ${className}`}>
        <span className={`${WORDMARK_CLASSES} text-foreground`}>{TARGET}</span>
      </div>
    );
  }

  function slotPhase(index: number): "binary" | "drop" | "letter" {
    if (index >= locked) return "binary";
    if (index === dropIndex) return "drop";
    return "letter";
  }

  return (
    <div className={`text-center ${className}`}>
      <p
        className={`binary-decode text-lg tracking-tight ${WORDMARK_CLASSES}`}
        aria-label={TARGET}
        aria-live="polite"
      >
        {TARGET.split("").map((ch, i) => (
          <DecodeSlot key={i} ch={ch} index={i} phase={slotPhase(i)} />
        ))}
      </p>
    </div>
  );
}
