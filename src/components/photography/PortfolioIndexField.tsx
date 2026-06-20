"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PhotoCollection } from "@/data/photography-meta";
import {
  getIndexHeroImage,
  INDEX_HERO_AUTO_CYCLE_MS,
  INDEX_HERO_AUTO_CYCLE_SLUGS,
  INDEX_HERO_DEFAULT_SLUG,
} from "@/lib/photography";

interface PortfolioIndexFieldProps {
  collections: PhotoCollection[];
}

function resolveCollectionIndex(
  collections: PhotoCollection[],
  slug: string,
): number {
  const index = collections.findIndex((collection) => collection.slug === slug);
  if (index !== -1) return index;

  const fallbackIndex = collections.findIndex(
    (collection) => collection.slug === INDEX_HERO_DEFAULT_SLUG,
  );
  return fallbackIndex === -1 ? 0 : fallbackIndex;
}

function resolveAutoCycleStartIndex(collections: PhotoCollection[]): number {
  const defaultIndex = INDEX_HERO_AUTO_CYCLE_SLUGS.indexOf(INDEX_HERO_DEFAULT_SLUG);
  if (defaultIndex === -1) return 0;

  const slug = INDEX_HERO_AUTO_CYCLE_SLUGS[defaultIndex];
  if (collections.some((collection) => collection.slug === slug)) {
    return defaultIndex;
  }

  return 0;
}

export function PortfolioIndexField({ collections }: PortfolioIndexFieldProps) {
  const [autoCycleIndex, setAutoCycleIndex] = useState(() =>
    resolveAutoCycleStartIndex(collections),
  );
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [isAutoPaused, setIsAutoPaused] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);

  const autoSlug = INDEX_HERO_AUTO_CYCLE_SLUGS[autoCycleIndex];
  const autoCollectionIndex = resolveCollectionIndex(collections, autoSlug);
  const activeIndex = hoverIndex ?? autoCollectionIndex;

  const defaultHeroIndex = resolveCollectionIndex(
    collections,
    INDEX_HERO_DEFAULT_SLUG,
  );

  const pauseForHover = useCallback((index: number) => {
    setIsAutoPaused(true);
    setHoverIndex(index);
  }, []);

  const resumeAutoCycle = useCallback(() => {
    setHoverIndex(null);
    setIsAutoPaused(false);
  }, []);

  useEffect(() => {
    if (isAutoPaused) return;

    const interval = window.setInterval(() => {
      setAutoCycleIndex(
        (current) => (current + 1) % INDEX_HERO_AUTO_CYCLE_SLUGS.length,
      );
    }, INDEX_HERO_AUTO_CYCLE_MS);

    return () => window.clearInterval(interval);
  }, [isAutoPaused]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!listRef.current?.contains(document.activeElement)) return;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setIsAutoPaused(true);
        setHoverIndex((current) => {
          const next = Math.min((current ?? activeIndex) + 1, collections.length - 1);
          return next;
        });
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setIsAutoPaused(true);
        setHoverIndex((current) => {
          const next = Math.max((current ?? activeIndex) - 1, 0);
          return next;
        });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, collections.length]);

  return (
    <section className="portfolio-index-field" aria-label="Portfolio">
      <div className="portfolio-index-field-sticky">
        <div className="portfolio-hover">
          <div className="portfolio-hover-backgrounds" aria-hidden>
            {collections.map((collection, index) => {
              const isActive = index === activeIndex;

              return (
                <div
                  key={collection.slug}
                  className={[
                    "portfolio-hover-bg",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Image
                    src={getIndexHeroImage(collection.slug, collection.cover)}
                    alt=""
                    fill
                    priority={index === defaultHeroIndex}
                    sizes="100vw"
                    className="portfolio-hover-bg-image"
                  />
                  <div className="portfolio-hover-bg-overlay" />
                </div>
              );
            })}
          </div>

          <ul
            ref={listRef}
            className="portfolio-hover-items-list"
            onMouseLeave={resumeAutoCycle}
          >
            {collections.map((collection, index) => (
              <li
                key={collection.slug}
                onMouseEnter={() => pauseForHover(index)}
                onFocus={() => pauseForHover(index)}
              >
                <Link
                  href={`/photography/${collection.slug}`}
                  className="portfolio-hover-item"
                >
                  <h1 className="portfolio-hover-item-title">
                    <span className="portfolio-hover-item-content">
                      {collection.title}
                    </span>
                  </h1>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
