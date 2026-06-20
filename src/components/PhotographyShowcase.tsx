"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { PhotoCollection } from "@/data/photography-meta";

interface CollectionCardProps {
  collection: PhotoCollection;
  index: number;
}

function CollectionCard({ collection, index }: CollectionCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-2xl glow-border"
    >
      <Link href={`/photography/${collection.slug}`} className="block">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={collection.cover}
            alt={collection.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <p className="font-mono-label text-[10px] text-accent-secondary">
            {collection.tagline}
          </p>
          <h3 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            {collection.title}
          </h3>
          <span className="mt-3 inline-flex items-center gap-2 text-sm text-accent opacity-80 transition-opacity group-hover:opacity-100">
            {collection.photos.length} photos →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

interface PhotographyShowcaseProps {
  collections: PhotoCollection[];
  compact?: boolean;
}

export function PhotographyShowcase({
  collections,
  compact = false,
}: PhotographyShowcaseProps) {
  return (
    <div
      className={
        compact
          ? "grid gap-6 sm:grid-cols-3"
          : "grid gap-8 md:grid-cols-3"
      }
    >
      {collections.map((collection, i) => (
        <CollectionCard key={collection.id} collection={collection} index={i} />
      ))}
    </div>
  );
}

export function PhotographyCTA() {
  return (
    <div className="glow-border glass-panel rounded-2xl p-8 sm:p-12">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono-label text-accent-secondary">book a shoot</p>
          <h3 className="font-display mt-2 text-2xl font-bold text-foreground sm:text-3xl">
            Let&apos;s make something beautiful
          </h3>
          <p className="mt-2 max-w-md text-sm text-muted">
            Portraits, editorial, events — reach out and we&apos;ll plan your
            session.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 rounded-full bg-accent px-8 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
        >
          Get in touch ✦
        </Link>
      </div>
    </div>
  );
}
