import data from "@/data/photography.json";
import {
  photographyBooking,
  type PhotoCollection,
  type PhotographyData,
} from "@/data/photography-meta";
import { siteConfig } from "@/config/site";

const photographyData = data as PhotographyData;

const INDEX_COLLECTION_ORDER = ["portraits", "vision", "scenery"] as const;

export const INDEX_HERO_IMAGES: Record<string, string> = {
  portraits: "/photography/index/portraits-hero.jpeg",
  vision: "/photography/index/vision-hero.jpg",
  scenery: "/photography/index/scenery-hero.jpg",
};

/** Auto-rotating index hero — vision (beach) ↔ scenery (Fendi NYC). Portraits on hover only. */
export const INDEX_HERO_AUTO_CYCLE_SLUGS = ["vision", "scenery"] as const;
export const INDEX_HERO_DEFAULT_SLUG = "vision";
export const INDEX_HERO_AUTO_CYCLE_MS = 4500;

export const PHOTOGRAPHY_BOOKING_PATH = "/photography/about#book";

const photographyInstagramHref =
  siteConfig.socialLinks.find((link) => link.id === "instagram")?.href ??
  "https://www.instagram.com/melanilaurents/";

export function getPhotographyInstagramHref(): string {
  return photographyInstagramHref;
}

export function getPhotographyInstagramHandle(): string {
  return photographyBooking.instagramHandle;
}

export function getPhotographyBookingDmUrl(): string {
  const message = encodeURIComponent(photographyBooking.dmMessage);
  return `https://ig.me/m/${photographyBooking.instagramHandle}?text=${message}`;
}

export function getPhotographyBookingMailtoUrl(): string {
  const subject = encodeURIComponent(photographyBooking.mailtoSubject);
  const body = encodeURIComponent(photographyBooking.dmMessage);
  return `mailto:${photographyBooking.email}?subject=${subject}&body=${body}`;
}

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
