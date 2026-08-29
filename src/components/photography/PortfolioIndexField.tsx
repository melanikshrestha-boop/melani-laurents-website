"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PhotoCollection } from "@/data/photography-meta";
import { getIndexHeroImage } from "@/lib/photography";

interface PortfolioIndexFieldProps {
  collections: PhotoCollection[];
}

const ART_CATEGORIES = [
  {
    label: "Photo",
    href: "/photography/scenery",
    heroSlug: "scenery",
  },
  {
    label: "Film",
    href: "/photography/film",
    heroSlug: "film",
  },
  {
    label: "Writing",
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
  return index === -1 ? 0 : index;
}

export function PortfolioIndexField({ collections }: PortfolioIndexFieldProps) {
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const activeSlug = hoverSlug ?? "scenery";
  const activeIndex = resolveCollectionIndex(collections, activeSlug);
  const defaultHeroIndex = resolveCollectionIndex(collections, "scenery");

  return (
    <section className="portfolio-index-field" aria-label="Art">
      <div className="portfolio-index-field-sticky">
        <div className="portfolio-hover">
          <div className="portfolio-hover-backgrounds" aria-hidden>
            {collections.map((collection, index) => (
              <div
                key={collection.slug}
                className={[
                  "portfolio-hover-bg",
                  `portfolio-hover-bg--${collection.slug}`,
                  index === activeIndex ? "is-active" : "",
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
            ))}
          </div>

          <ul
            className="portfolio-hover-items-list"
            onMouseLeave={() => setHoverSlug(null)}
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget as Node | null)
              ) {
                setHoverSlug(null);
              }
            }}
          >
            {ART_CATEGORIES.map((category) => (
              <li
                key={category.href}
                onMouseEnter={() => setHoverSlug(category.heroSlug)}
                onFocus={() => setHoverSlug(category.heroSlug)}
              >
                <Link href={category.href} className="portfolio-hover-item">
                  <h1 className="portfolio-hover-item-title">
                    <span className="portfolio-hover-item-content">
                      {category.label}
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
