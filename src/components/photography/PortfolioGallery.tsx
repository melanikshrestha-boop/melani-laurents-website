"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Photo } from "@/data/photography-meta";

interface PortfolioGalleryProps {
  photos: Photo[];
  layout?: "grid" | "scenery";
  showStatement?: boolean;
}

export function PortfolioGallery({
  photos,
  layout = "grid",
  showStatement = false,
}: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const root = galleryRef.current;
    if (!root) return;

    const targets = Array.from(
      root.querySelectorAll<HTMLElement>("[data-photo-reveal]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    root.classList.add("is-reveal-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -30% 0px", threshold: 0.15 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [photos.length, showStatement]);

  if (photos.length === 0) {
    return (
      <div className="portfolio-gallery portfolio-gallery--empty">
        <p className="portfolio-gallery-empty">Coming soon</p>
      </div>
    );
  }

  return (
    <>
      <div
        ref={galleryRef}
        className={`portfolio-gallery${
          layout === "scenery" ? " portfolio-gallery--scenery" : ""
        }`}
      >
        <div className="portfolio-gallery-grid">
          {photos.map((photo, i) => (
            <figure
              key={photo.id}
              className="portfolio-gallery-item"
              data-photo-reveal
              style={
                {
                  "--pg-delay": `${(i % 3) * 70}ms`,
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

        {showStatement ? (
          <aside
            className="portfolio-wall-text"
            aria-label="John Lennon quote"
            data-photo-reveal
          >
            <blockquote>
              <p className="portfolio-wall-text__statement">
                “I made the decision at sixteen or seventeen that what I did,
                I wanted everybody to see.”
              </p>
              <cite className="portfolio-wall-text__signature">
                John Lennon, 1980
              </cite>
            </blockquote>
          </aside>
        ) : null}
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
