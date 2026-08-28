import data from "@/data/photography.json";
import {
  type PhotoCollection,
  type PhotographyData,
} from "@/data/photography-meta";

const photographyData = data as PhotographyData;

const INDEX_COLLECTION_ORDER = [
  "portraits",
  "scenery",
  "sketches",
  "film",
  "poem",
] as const;

export const INDEX_HERO_IMAGES: Record<string, string> = {
  portraits: "/photography/index/portraits-hero.jpeg",
  scenery: "/photography/index/scenery-hero.jpg",
  sketches: "/photography/index/sketches-hero.jpeg",
  film: "/photography/film/cover.jpeg",
  poem: "/photography/sketches/cover.jpeg",
};

/** The Photography group alternates between its two collections. */
export const INDEX_HERO_AUTO_CYCLE_SLUGS = [
  "portraits",
  "scenery",
] as const;
export const INDEX_HERO_DEFAULT_SLUG = "portraits";
export const INDEX_HERO_AUTO_CYCLE_MS = 4500;

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

export function getAdjacentCollections(slug: string) {
  const collections = getIndexCollections();
  const index = collections.findIndex((c) => c.slug === slug);
  if (index === -1) return { prev: undefined, next: undefined };
  return {
    prev: index > 0 ? collections[index - 1] : undefined,
    next: index < collections.length - 1 ? collections[index + 1] : undefined,
  };
}

export function getIndexHeroImage(slug: string, fallback: string): string {
  return INDEX_HERO_IMAGES[slug] ?? fallback;
}
