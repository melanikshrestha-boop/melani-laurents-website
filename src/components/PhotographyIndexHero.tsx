"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { PhotoCollection } from "@/data/photography-meta";

interface PhotographyIndexHeroProps {
  collections: PhotoCollection[];
}

export function PhotographyIndexHero({ collections }: PhotographyIndexHeroProps) {
  const reduced = useReducedMotion();

  return (
    <div className="-mx-6 -mt-14">
      {collections.map((collection, i) => (
        <motion.section
          key={collection.id}
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex min-h-screen items-center justify-center overflow-hidden"
        >
          <Image
            src={collection.cover}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="100vw"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-background/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

          <Link
            href={`/photography/${collection.slug}`}
            className="group relative z-10 px-6 text-center"
          >
            <p className="font-mono-label text-accent-secondary opacity-0 transition-opacity group-hover:opacity-100">
              {collection.tagline}
            </p>
            <h2 className="font-display mt-2 text-5xl font-bold text-foreground transition-transform group-hover:scale-105 sm:text-7xl md:text-8xl">
              {collection.title}
            </h2>
            <p className="mt-4 text-sm text-muted opacity-0 transition-opacity group-hover:opacity-100">
              {collection.photos.length} photos →
            </p>
          </Link>
        </motion.section>
      ))}
    </div>
  );
}
