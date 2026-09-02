"use client";

import Image from "next/image";
import { useCallback, useRef, type PointerEvent } from "react";

type DesignPeekProps = {
  src: string;
  title: string;
  story?: string;
};

/** Pointer pans a larger still so the card is a window, not a frozen shot.
 *  --peek-mx/--peek-my (0–1) also drive the hover wash toward the cursor. */
export function DesignPeek({ src, title, story }: DesignPeekProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const box = frame.getBoundingClientRect();
    if (box.width < 8 || box.height < 8) return;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const px = (0.5 - Math.min(1, Math.max(0, x))) * 12;
    const py = (0.5 - Math.min(1, Math.max(0, y))) * 8;
    frame.style.setProperty("--peek-x", `${px}%`);
    frame.style.setProperty("--peek-y", `${py}%`);
    frame.style.setProperty("--peek-mx", `${Math.min(1, Math.max(0, x))}`);
    frame.style.setProperty("--peek-my", `${Math.min(1, Math.max(0, y))}`);
  }, []);

  const onLeave = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--peek-x", "0%");
    frame.style.setProperty("--peek-y", "0%");
    frame.style.setProperty("--peek-mx", "0.5");
    frame.style.setProperty("--peek-my", "0.5");
  }, []);

  return (
    <div
      ref={frameRef}
      className="bs-scholar__peek builds-designs__peek"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Image
        src={src}
        alt=""
        width={1440}
        height={900}
        sizes="(max-width: 40rem) calc(100vw - 1.5rem), (max-width: 64rem) 46vw, 32vw"
        loading="eager"
        unoptimized
        className="bs-scholar__preview bs-scholar__preview--peek"
      />
      <span className="bs-scholar__reveal">
        <strong className="bs-scholar__reveal-title">
          {title} <span aria-hidden>↗</span>
        </strong>
        {story ? <span className="bs-scholar__reveal-note">{story}</span> : null}
      </span>
    </div>
  );
}
