"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type FocusEvent } from "react";
import type { PhotoCollection } from "@/data/photography-meta";
import {
  getIndexHeroImage,
  INDEX_HERO_AUTO_CYCLE_MS,
  INDEX_HERO_AUTO_CYCLE_SLUGS,
  INDEX_HERO_DEFAULT_SLUG,
} from "@/lib/photography";

interface PortfolioIndexFieldProps {
  collections: PhotoCollection[];
  mode?: "art" | "photography";
}

const ART_CATEGORIES = [
  {
    label: "Photography",
    href: "/photography/photography",
    heroSlug: null,
  },
  {
    label: "Cinematography",
    href: "/photography/film",
    heroSlug: "film",
  },
  {
    label: "Writing / Poetry",
    href: "/photography/poem",
    heroSlug: "poem",
  },
  {
    label: "Sketches",
    href: "/photography/sketches",
    heroSlug: "sketches",
  },
] as const;

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

export function PortfolioIndexField({
  collections,
  mode = "art",
}: PortfolioIndexFieldProps) {
  const [autoCycleIndex, setAutoCycleIndex] = useState(() =>
    resolveAutoCycleStartIndex(collections),
  );
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const autoSlug = INDEX_HERO_AUTO_CYCLE_SLUGS[autoCycleIndex];
  const activeSlug = hoverSlug ?? autoSlug;
  const activeIndex = resolveCollectionIndex(collections, activeSlug);
  const defaultHeroIndex = resolveCollectionIndex(
    collections,
    INDEX_HERO_DEFAULT_SLUG,
  );

  const pauseForCollection = useCallback((slug: string) => {
    setIsAutoPaused(true);
    setHoverSlug(slug);
  }, []);

  const pauseForPhotography = useCallback(() => {
    setIsAutoPaused(true);
    setHoverSlug(autoSlug);
  }, [autoSlug]);

  const resumeAutoCycle = useCallback(() => {
    setHoverSlug(null);
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

  const resumeWhenFocusLeaves = useCallback(
    (event: FocusEvent<HTMLUListElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        resumeAutoCycle();
      }
    },
    [resumeAutoCycle],
  );

  return (
    <section
      className={`portfolio-index-field portfolio-index-field--${mode}`}
      aria-label={mode === "photography" ? "Photography collections" : "Art"}
    >
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
                    `portfolio-hover-bg--${collection.slug}`,
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
            className="portfolio-hover-items-list"
            onMouseLeave={resumeAutoCycle}
            onBlur={resumeWhenFocusLeaves}
          >
            {mode === "photography" ? (
              <>
                <li className="portfolio-hover-parent-title">Photography</li>
                {collections.map((collection) => (
                  <li
                    key={collection.slug}
                    onMouseEnter={() => pauseForCollection(collection.slug)}
                    onFocus={() => pauseForCollection(collection.slug)}
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
              </>
            ) : (
              ART_CATEGORIES.map((category) => {
                const heroSlug = category.heroSlug ?? autoSlug;
                return (
                  <li
                    key={category.href}
                    onMouseEnter={
                      category.heroSlug
                        ? () => pauseForCollection(heroSlug)
                        : pauseForPhotography
                    }
                    onFocus={
                      category.heroSlug
                        ? () => pauseForCollection(heroSlug)
                        : pauseForPhotography
                    }
                  >
                    <Link href={category.href} className="portfolio-hover-item">
                      <h1 className="portfolio-hover-item-title">
                        <span className="portfolio-hover-item-content">
                          {category.label}
                        </span>
                      </h1>
                    </Link>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
