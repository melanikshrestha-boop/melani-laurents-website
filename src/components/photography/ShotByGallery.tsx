"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ShotByChrome, ShotByFooter } from "@/components/photography/ShotByChrome";
import {
  SHOTBY_GALLERIES,
  type ShotByGalleryId,
} from "@/data/shotby-catalog";

export function ShotByGallery({ id }: { id: ShotByGalleryId }) {
  const index = SHOTBY_GALLERIES.findIndex((g) => g.id === id);
  const gallery = SHOTBY_GALLERIES[index];
  const prev = SHOTBY_GALLERIES[index - 1];
  const next = SHOTBY_GALLERIES[index + 1];
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const goPrev = useCallback(() => {
    setOpen((i) =>
      i === null ? i : i > 0 ? i - 1 : gallery.photos.length - 1,
    );
  }, [gallery.photos.length]);
  const goNext = useCallback(() => {
    setOpen((i) =>
      i === null ? i : i < gallery.photos.length - 1 ? i + 1 : 0,
    );
  }, [gallery.photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, goPrev, goNext]);

  return (
    <div className="shotby-page">
      <ShotByChrome />
      <nav className="shotby-pager" aria-label="Galleries">
        {prev ? (
          <Link href={prev.href} className="shotby-pager__peer">
            <span aria-hidden>←</span> {prev.label}
          </Link>
        ) : (
          <span className="shotby-pager__here">
            <span aria-hidden>←</span> {gallery.label}
          </span>
        )}
        {next ? (
          <Link href={next.href} className="shotby-pager__peer">
            {next.label} <span aria-hidden>→</span>
          </Link>
        ) : (
          <span className="shotby-pager__here">
            {gallery.label} <span aria-hidden>→</span>
          </span>
        )}
      </nav>
      <div className="shotby-grid">
        {gallery.photos.map((src, i) => (
          <button
            key={src}
            type="button"
            className="shotby-grid__cell"
            aria-label="View fullsize"
            onClick={() => setOpen(i)}
          >
            <Image
              src={src}
              alt=""
              width={900}
              height={1350}
              sizes="33vw"
              className="shotby-grid__img"
              loading={i < 6 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>
      {open !== null ? (
        <div className="shotby-lite" role="dialog" aria-modal>
          <button type="button" className="shotby-lite__close" onClick={close}>
            Close
          </button>
          <button type="button" className="shotby-lite__nav is-prev" onClick={goPrev}>
            Previous
          </button>
          {/* Native img — next/image wraps a span that collapsed the full-size still. */}
          <img
            src={gallery.photos[open]}
            alt=""
            className="shotby-lite__img"
          />
          <button type="button" className="shotby-lite__nav is-next" onClick={goNext}>
            Next
          </button>
        </div>
      ) : null}
      <ShotByFooter />
    </div>
  );
}
