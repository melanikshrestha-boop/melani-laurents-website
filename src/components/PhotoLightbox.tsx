"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/data/photography-meta";

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: PhotoLightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const goNext = useCallback(() => {
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, goPrev, goNext]);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        Close ✕
      </button>

      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 z-10 hidden rounded-full border border-border px-4 py-3 text-muted transition-colors hover:text-foreground sm:block"
        aria-label="Previous photo"
      >
        ←
      </button>

      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 z-10 hidden rounded-full border border-border px-4 py-3 text-muted transition-colors hover:text-foreground sm:block"
        aria-label="Next photo"
      >
        →
      </button>

      <div className="relative flex h-full w-full max-w-6xl flex-col items-center justify-center px-4 py-16">
        <div className="relative max-h-[85vh] w-full flex-1">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
        <p className="font-mono-label mt-4 text-muted-foreground">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
