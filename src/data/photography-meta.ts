export interface PhotoPrintSize {
  label: string;
  priceUsd: number;
}

export interface PhotoPrint {
  catalogId: string;
  title: string;
  sizes: PhotoPrintSize[];
}

export interface Photo {
  id: string;
  src: string;
  alt: string;
  /** Where it was shot — shown as the title on the gallery hover placard */
  place?: string;
  /** One line of context under the place. Her words, not filler. */
  note?: string;
  /** Present only when Celine owns and offers the photograph as a print. */
  print?: PhotoPrint;
}

export interface PhotoCollection {
  id: string;
  title: string;
  tagline: string;
  slug: string;
  cover: string;
  story?: string;
  photos: Photo[];
}

export interface PhotographyData {
  collections: PhotoCollection[];
}

export const photographyIntro = {
  headline: "Shot by Celine",
  subhead:
    "Portraits, scenery, and sketches, camera and hand",
  body: "Photography is how I slow down. While my day job lives in signals and systems, my camera lives in golden hour, honest faces, and places that feel like a dream. Sketches are the same eye, slower, on paper.",
};

export const photographyVibes = [
  { label: "mood", value: "ethereal meets editorial" },
  { label: "light", value: "golden hour obsessed" },
  { label: "gear", value: "whatever catches the moment" },
  { label: "booking", value: "contact through the main site" },
];
