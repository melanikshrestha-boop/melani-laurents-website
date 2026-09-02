"use client";

import Image from "next/image";
import { ArrowUpRight, ShoppingBagOpen } from "@phosphor-icons/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { Photo } from "@/data/photography-meta";
import { PrintOrderDialog } from "@/components/photography/PrintOrderDialog";

interface PortfolioGalleryProps {
  photos: Photo[];
  layout?: "grid" | "scenery" | "sketches" | "portraits";
  story?: string;
}

/** Single tap vs double tap on touch. Same window as the public bookshelf. */
const TAP_MS = 280;

export function PortfolioGallery({
  photos,
  layout = "grid",
  story,
}: PortfolioGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [printPhoto, setPrintPhoto] = useState<Photo | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const tapTimerRef = useRef<number | null>(null);
  const tapIndexRef = useRef<number | null>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const coarseRef = useRef(false);
  const [coarse, setCoarse] = useState(false);

  const close = useCallback(() => setLightboxIndex(null), []);

  const clearTapTimer = useCallback(() => {
    if (tapTimerRef.current == null) return;
    window.clearTimeout(tapTimerRef.current);
    tapTimerRef.current = null;
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none)");
    const sync = () => {
      coarseRef.current = mq.matches;
      setCoarse(mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      clearTapTimer();
    };
  }, [clearTapTimer]);

  const openLightbox = useCallback(
    (index: number) => {
      clearTapTimer();
      setStoryOpen(false);
      setLightboxIndex(index);
    },
    [clearTapTimer],
  );

  const onSketchTouchTap = useCallback(
    (index: number) => {
      // Second tap in the window → full still. First tap waits, then story.
      if (tapTimerRef.current != null && tapIndexRef.current === index) {
        clearTapTimer();
        tapIndexRef.current = index;
        openLightbox(index);
        return;
      }
      clearTapTimer();
      tapIndexRef.current = index;
      if (!story) {
        openLightbox(index);
        return;
      }
      tapTimerRef.current = window.setTimeout(() => {
        tapTimerRef.current = null;
        setStoryOpen(true);
      }, TAP_MS);
    },
    [clearTapTimer, openLightbox, story],
  );

  const onStorySurface = useCallback(() => {
    clearTapTimer();
    setStoryOpen(false);
  }, [clearTapTimer]);

  const onPhotoActivate = useCallback(
    (index: number) => {
      const touch =
        pointerTypeRef.current === "touch" || coarseRef.current;
      if (layout === "sketches" && touch) {
        onSketchTouchTap(index);
        return;
      }
      openLightbox(index);
    },
    [layout, onSketchTouchTap, openLightbox],
  );

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
    if (lightboxIndex === null && !storyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIndex !== null) close();
        else setStoryOpen(false);
      }
      if (lightboxIndex === null) return;
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    if (lightboxIndex !== null) document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, storyOpen, close, goPrev, goNext]);

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
  }, [photos.length]);

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
        className={`portfolio-gallery portfolio-gallery--${layout}${coarse ? " is-coarse" : ""}`}
      >
        <div
          id={layout === "scenery" ? "prints" : undefined}
          className={[
            "portfolio-gallery-grid",
            layout === "sketches" && photos.length <= 3
              ? "portfolio-gallery-grid--pack"
              : "",
            storyOpen ? "is-story-open" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={
            layout === "sketches"
              ? ({
                  "--pg-sketch-columns": String(
                    Math.max(1, Math.min(photos.length, 3)),
                  ),
                } as CSSProperties)
              : undefined
          }
        >
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
              <div className="portfolio-gallery-frame">
                {photo.href ? (
                  <a
                    href={photo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-gallery-trigger"
                    aria-label={photo.alt}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1200}
                      height={1800}
                      className={
                        photo.href
                          ? "portfolio-gallery-image portfolio-gallery-image--essay"
                          : "portfolio-gallery-image"
                      }
                      sizes={
                        layout === "sketches"
                          ? photos.length === 1
                            ? "100vw"
                            : photos.length === 2
                              ? "50vw"
                              : "33vw"
                          : layout === "portraits" || layout === "scenery"
                            ? "33vw"
                            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  </a>
                ) : (
                <button
                  type="button"
                  onPointerDown={(event) => {
                    pointerTypeRef.current = event.pointerType;
                  }}
                  onClick={(event) => {
                    event.currentTarget.blur();
                    onPhotoActivate(i);
                  }}
                  className="portfolio-gallery-trigger"
                  aria-label="View fullsize"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1200}
                    height={1800}
                    className="portfolio-gallery-image"
                    sizes={
                      layout === "sketches"
                        ? photos.length === 1
                          ? "100vw"
                          : photos.length === 2
                            ? "50vw"
                            : "33vw"
                        : layout === "portraits" || layout === "scenery"
                          ? "33vw"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    }
                    loading={
                      i < (layout === "scenery" || layout === "sketches" ? 3 : 2)
                        ? "eager"
                        : "lazy"
                    }
                  />
                </button>
                )}
                <span className="portfolio-gallery-wash" aria-hidden />
                {photo.place || photo.note || photo.print ? (
                  <figcaption className="portfolio-gallery-caption">
                    {photo.place || photo.print ? (
                      <span
                        className={
                          photo.href
                            ? "portfolio-gallery-place portfolio-gallery-place--essay"
                            : "portfolio-gallery-place"
                        }
                      >
                        {photo.place ?? photo.print?.title}
                      </span>
                    ) : null}
                    {photo.note ? (
                      <span className="portfolio-gallery-note">{photo.note}</span>
                    ) : null}
                    {photo.print ? (
                      <button
                        type="button"
                        className="portfolio-gallery-print-order"
                        onClick={() => setPrintPhoto(photo)}
                        aria-label={`Order a print of ${photo.print.title} for $45`}
                      >
                        <span className="portfolio-gallery-print-label">
                          Order Print
                        </span>
                        <span className="portfolio-gallery-print-price">$45</span>
                        <ArrowUpRight size={15} weight="bold" aria-hidden />
                        <span className="portfolio-gallery-print-meta">
                          {photo.print.catalogId} ·{" "}
                          {photo.print.sizes
                            .map((size) => size.label)
                            .join(" / ")}
                        </span>
                      </button>
                    ) : null}
                  </figcaption>
                ) : null}
              </div>
            </figure>
          ))}
          {layout === "sketches" && story ? (
            <aside
              className="portfolio-sketch-story"
              aria-label="Story behind the sketches"
              onClick={(event) => {
                event.stopPropagation();
                onStorySurface();
              }}
            >
              <p>{story}</p>
            </aside>
          ) : null}
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
          {photos[lightboxIndex].print ? (
            <button
              type="button"
              className="portfolio-lightbox-print"
              onClick={(event) => {
                event.stopPropagation();
                const photo = photos[lightboxIndex];
                setLightboxIndex(null);
                setPrintPhoto(photo);
              }}
            >
              <ShoppingBagOpen size={17} weight="bold" aria-hidden />
              Order Print
            </button>
          ) : null}
        </div>
      )}

      {printPhoto ? (
        <PrintOrderDialog photo={printPhoto} onClose={() => setPrintPhoto(null)} />
      ) : null}
    </>
  );
}
