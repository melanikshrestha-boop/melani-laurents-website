"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Photo } from "@/data/photography-meta";

/** Stable hue per photo so a piece always wears the same colour. */
function hueFor(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) % 360;
  }
  return hash;
}

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

  if (photos.length === 0) {
    return (
      <div className="portfolio-gallery portfolio-gallery--empty">
        <p className="portfolio-gallery-empty">Coming soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="portfolio-gallery">
        <div className="portfolio-gallery-grid">
          {photos.map((photo, i) => (
            <figure
              key={photo.id}
              className="portfolio-gallery-item"
              /* Hue per piece so no two neighbouring washes match — same
                 stable-hash idea as the bookshelf folder accents. */
              style={
                {
                  "--pg-hue": String(hueFor(photo.id || photo.src)),
                } as CSSProperties
              }
            >
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
                <span className="portfolio-gallery-wash" aria-hidden />
                <figcaption className="portfolio-gallery-caption">
                  <span className="portfolio-gallery-place">
                    {photo.place || photo.alt}
                  </span>
                  {photo.note ? (
                    <span className="portfolio-gallery-note">{photo.note}</span>
                  ) : null}
                </figcaption>
              </button>
            </figure>
          ))}
        </div>

        {/*
         * Closing wall text. Placed after the last photograph on purpose: the
         * quote is about wanting everyone to see the work, so it only lands
         * once they have. Set quiet and low-contrast — it resolves as you
         * reach it rather than announcing itself, so it reads as something
         * found rather than displayed.
         */}
        <aside className="portfolio-wall-text">
          <blockquote className="portfolio-wall-text__quote">
            <p>
              I made the decision at sixteen or seventeen that what I did, I
              wanted everybody to see. I wasn&rsquo;t going after the
              aestheticism or the monastery or the lone artist who supposedly
              doesn&rsquo;t care what people think about his work. I care a lot
              whether people hate it or love it, because it&rsquo;s part of me
              and it hurts me when they hate it, or hate me, and it&rsquo;s
              pleasing when they like it. But, as many public figures have said,
              &lsquo;The praise is never enough, and the criticism always bites
              deep.&rsquo;
            </p>
            <cite className="portfolio-wall-text__cite">
              John Lennon, 1980
            </cite>
          </blockquote>
        </aside>
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

          {/* Arrow keys already drove the lightbox, but nothing on screen said
              so. These make the same moves visible and give touch a way in. */}
          {photos.length > 1 ? (
            <>
              <button
                type="button"
                className="portfolio-lightbox-nav portfolio-lightbox-nav--prev"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                &#8249;
              </button>
              <button
                type="button"
                className="portfolio-lightbox-nav portfolio-lightbox-nav--next"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                &#8250;
              </button>
              <p className="portfolio-lightbox-counter" aria-live="polite">
                {lightboxIndex + 1} / {photos.length}
              </p>
            </>
          ) : null}
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
