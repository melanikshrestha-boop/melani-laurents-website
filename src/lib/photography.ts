import data from "@/data/photography.json";
import type { PhotoCollection, PhotographyData } from "@/data/photography-meta";

const photographyData = data as PhotographyData;

const INDEX_COLLECTION_ORDER = ["portraits", "vision", "scenery"] as const;

export const INDEX_HERO_IMAGES: Record<string, string> = {
  portraits: "/photography/index/portraits-hero.jpeg",
  vision: "/photography/index/vision-hero.jpg",
  scenery: "/photography/index/scenery-hero.jpg",
};

export const ABOUT_PORTRAIT = "/photography/portraits/A28449D9-BAED-4FB1-A26B-FA6C55DFD538.JPG";

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
