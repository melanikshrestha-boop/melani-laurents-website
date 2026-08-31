import data from "@/data/photography.json";
import {
  type PhotoCollection,
  type PhotographyData,
} from "@/data/photography-meta";

const photographyData = data as PhotographyData;

const INDEX_COLLECTION_ORDER = [
  "scenery",
  "film",
  "poem",
  "sketches",
] as const;

export const INDEX_HERO_IMAGES: Record<string, string> = {
  portraits: "/photography/index/portraits-hero.jpeg",
  scenery: "/photography/index/scenery-hero.jpg",
  sketches: "/photography/index/sketches-hero.jpeg",
  film: "/photography/film/cover.jpeg",
  poem: "/photography/sketches/cover.jpeg",
};

export const PHOTOGRAPHY_BOOKING_PATH = "/contact";

export function getPhotoCollections(): PhotoCollection[] {
  return photographyData.collections;
}

export function getIndexCollections(): PhotoCollection[] {
  const bySlug = new Map(
    photographyData.collections.map((collection) => [collection.slug, collection]),
  );

  return INDEX_COLLECTION_ORDER.flatMap((slug) => {
    const collection = bySlug.get(slug);
    return collection ? [collection] : [];
  });
}

export function getPhotoCollection(slug: string): PhotoCollection | undefined {
  return photographyData.collections.find((c) => c.slug === slug);
}

export function getPhotoCollectionSlugs(): string[] {
  return photographyData.collections.map((c) => c.slug);
}

export function getIndexHeroImage(slug: string, fallback: string): string {
  return INDEX_HERO_IMAGES[slug] ?? fallback;
}

/** Match a print request to a cataloged offering. */
export function findCatalogedPrint(catalogId: string, sizeLabel: string) {
  for (const collection of photographyData.collections) {
    for (const photo of collection.photos) {
      const print = photo.print;
      if (!print || print.catalogId !== catalogId) continue;
      const size = print.sizes.find((entry) => entry.label === sizeLabel);
      if (!size) return undefined;
      return { photo, print, size };
    }
  }
  return undefined;
}
