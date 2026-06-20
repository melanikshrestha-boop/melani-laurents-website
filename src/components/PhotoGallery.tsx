"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Photo } from "@/data/photography-meta";
import { PhotoLightbox } from "./PhotoLightbox";

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.id}
            type="button"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.3) }}
            onClick={() => setLightboxIndex(i)}
            className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <div className="relative w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={1600}
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-accent/0 transition-colors group-hover:bg-accent/10" />
            </div>
          </motion.button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
