"use client";

import { useCallback, useRef, useState, type PointerEvent } from "react";

type TitleVariant = "hub" | "cream";

type Segment = { text: string; gold?: boolean };

const TITLE_LINES: Segment[][] = [
  [{ text: "MELANI" }],
  [{ text: "LAURENT ", gold: false }, { text: "S.", gold: true }],
];

interface InteractiveTitleLettersProps {
  variant?: TitleVariant;
  className?: string;
  lineClassName?: string;
  charClassName?: string;
  ariaLabel?: string;
}

/** Per-letter shimmer on hover/touch — gold→white gradient follows pointer. */
export function InteractiveTitleLetters({
  variant = "hub",
  className = "",
  lineClassName = "",
  charClassName = "",
  ariaLabel = "Melani Laurent S.",
}: InteractiveTitleLettersProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const touchTimerRef = useRef<number | null>(null);

  const chars = TITLE_LINES.flatMap((segments, lineIndex) =>
    segments.flatMap((segment) =>
      segment.text.split("").map((char) => ({
        char,
        lineIndex,
        isGold: !!segment.gold,
      })),
    ),
  ).map((item, globalIndex) => ({ ...item, globalIndex }));

  const clearTouch = useCallback(() => {
    if (touchTimerRef.current !== null) {
      window.clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLSpanElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setActiveIndex(index);
  };

  const handlePointerLeave = () => {
    setActiveIndex(null);
  };

  const handlePointerDown = (e: PointerEvent<HTMLSpanElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointer({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
    setActiveIndex(index);
    clearTouch();
    touchTimerRef.current = window.setTimeout(() => setActiveIndex(null), 900);
  };

  return (
    <h1
      className={className}
      aria-label={ariaLabel}
      style={
        {
          "--title-mx": `${pointer.x}%`,
          "--title-my": `${pointer.y}%`,
        } as React.CSSProperties
      }
    >
      {TITLE_LINES.map((segments, lineIndex) => (
        <span key={lineIndex} className={lineClassName}>
          {chars
            .filter((c) => c.lineIndex === lineIndex)
            .map(({ char, globalIndex, isGold }) => (
              <span
                key={globalIndex}
                className={[
                  "title-char",
                  `title-char--${variant}`,
                  isGold ? "title-char--gold" : "",
                  activeIndex === globalIndex ? "title-char--active" : "",
                  charClassName,
                ]
                  .filter(Boolean)
                  .join(" ")}
                onPointerMove={(e) => handlePointerMove(e, globalIndex)}
                onPointerLeave={handlePointerLeave}
                onPointerDown={(e) => handlePointerDown(e, globalIndex)}
                aria-hidden={char === " "}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
        </span>
      ))}
    </h1>
  );
}
