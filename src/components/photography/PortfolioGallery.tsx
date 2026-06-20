"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Photo } from "@/data/photography-meta";

interface PortfolioGalleryProps {
  photos: Photo[];
}

export function PortfolioGallery({ photos }: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i > 0 ? i - 1 : photos.length - 1) : null,
    );
  }, [photos.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i < photos.length - 1 ? i + 1 : 0) : null,
    );
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, goPrev, goNext]);

  return (
    <>
      <div className="portfolio-gallery">
        <div className="portfolio-gallery-grid">
          {photos.map((photo, i) => (
            <figure key={photo.id} className="portfolio-gallery-item">
              <button
                type="button"
                onClick={() => setLightboxIndex(i)}
                className="portfolio-gallery-trigger"
                aria-label="View fullsize"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={1200}
                  height={1800}
                  className="portfolio-gallery-image"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="portfolio-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Full size image"
          onClick={close}
        >
          <button
            type="button"
            className="portfolio-lightbox-close"
            onClick={close}
          >
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[lightboxIndex].src}
            alt={photos[lightboxIndex].alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
