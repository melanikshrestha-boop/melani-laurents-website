"use client";

import Image from "next/image";
import { useCallback, useRef, type PointerEvent } from "react";

type DesignPeekProps = {
  src: string;
  title: string;
};

/** Pointer pans a larger still so the card is a window, not a frozen shot. */
export function DesignPeek({ src, title }: DesignPeekProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame) return;
    const box = frame.getBoundingClientRect();
    if (box.width < 8 || box.height < 8) return;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const px = (0.5 - Math.min(1, Math.max(0, x))) * 18;
    const py = (0.5 - Math.min(1, Math.max(0, y))) * 14;
    frame.style.setProperty("--peek-x", `${px}%`);
    frame.style.setProperty("--peek-y", `${py}%`);
  }, []);

  const onLeave = useCallback(() => {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--peek-x", "0%");
    frame.style.setProperty("--peek-y", "0%");
  }, []);

  return (
    <div
      ref={frameRef}
      className="bs-scholar__peek"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Image
        src={src}
        alt=""
        width={1440}
        height={900}
        sizes="(max-width: 560px) calc(100vw - 2rem), (max-width: 1120px) 46vw, 23vw"
        loading="eager"
        unoptimized
        className="bs-scholar__preview bs-scholar__preview--peek"
      />
      <span className="bs-scholar__reveal">
        <strong className="bs-scholar__reveal-title">
          {title} <span aria-hidden>↗</span>
        </strong>
      </span>
    </div>
  );
}
