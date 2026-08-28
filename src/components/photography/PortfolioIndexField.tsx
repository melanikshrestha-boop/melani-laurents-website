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
}

const PHOTOGRAPHY_SLUGS = ["portraits", "scenery"] as const;
const PRIMARY_COLLECTION_SLUGS = ["sketches", "film", "poem"] as const;

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
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const [isAutoPaused, setIsAutoPaused] = useState(false);

  const autoSlug = INDEX_HERO_AUTO_CYCLE_SLUGS[autoCycleIndex];
  const activeSlug = hoverSlug ?? autoSlug;
  const activeIndex = resolveCollectionIndex(collections, activeSlug);
  const collectionBySlug = new Map(
    collections.map((collection) => [collection.slug, collection]),
  );
  const photographyCollections = PHOTOGRAPHY_SLUGS.flatMap((slug) => {
    const collection = collectionBySlug.get(slug);
    return collection ? [collection] : [];
  });
  const primaryCollections = PRIMARY_COLLECTION_SLUGS.flatMap((slug) => {
    const collection = collectionBySlug.get(slug);
    return collection ? [collection] : [];
  });

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
    setHoverSlug((current) =>
      current && PHOTOGRAPHY_SLUGS.some((slug) => slug === current)
        ? current
        : autoSlug,
    );
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
            <li
              className="portfolio-hover-item-group"
              onMouseEnter={pauseForPhotography}
            >
              <div className="portfolio-hover-item portfolio-hover-item--group">
                <h1 className="portfolio-hover-item-title">
                  <span className="portfolio-hover-item-content">Photography</span>
                </h1>
                <nav
                  className="portfolio-hover-subcategories"
                  aria-label="Photography collections"
                >
                  {photographyCollections.map((collection) => (
                    <Link
                      key={collection.slug}
                      href={`/photography/${collection.slug}`}
                      className={
                        collection.slug === activeSlug ? "is-active" : undefined
                      }
                      onMouseEnter={() => pauseForCollection(collection.slug)}
                      onFocus={() => pauseForCollection(collection.slug)}
                    >
                      {collection.title}
                    </Link>
                  ))}
                </nav>
              </div>
            </li>

            {primaryCollections.map((collection) => (
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
          </ul>
        </div>
      </div>
    </section>
  );
}
