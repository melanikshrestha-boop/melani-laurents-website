"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { PhotoCollection } from "@/data/photography-meta";
import { getIndexHeroImage } from "@/lib/photography";

interface PortfolioIndexProps {
  collections: PhotoCollection[];
}

export function PortfolioIndex({ collections }: PortfolioIndexProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activate = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return (
    <section className="portfolio-hover" aria-label="Portfolio">
      <div className="portfolio-hover-backgrounds" aria-hidden>
        {collections.map((collection, index) => (
          <div
            key={collection.slug}
            className={`portfolio-hover-bg${index === activeIndex ? " is-active" : ""}`}
          >
            <Image
              src={getIndexHeroImage(collection.slug, collection.cover)}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="portfolio-hover-bg-image"
            />
          </div>
        ))}
      </div>

      <ul className="portfolio-hover-items-list">
        {collections.map((collection, index) => (
          <li
            key={collection.slug}
            onMouseEnter={() => activate(index)}
            onFocus={() => activate(index)}
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
    </section>
  );
}
