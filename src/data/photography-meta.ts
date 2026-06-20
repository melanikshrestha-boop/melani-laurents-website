export interface Photo {
  id: string;
  src: string;
  alt: string;
}

export interface PhotoCollection {
  id: string;
  title: string;
  tagline: string;
  slug: string;
  cover: string;
  photos: Photo[];
}

export interface PhotographyData {
  collections: PhotoCollection[];
}

export const photographyIntro = {
  headline: "Shot by Melani",
  subhead:
    "Portraits, vision, scenery — I see the world through light and feeling.",
  body: "Photography is how I slow down. While my day job lives in signals and systems, my camera lives in golden hour, honest faces, and places that feel like a dream.",
};

export const photographyVibes = [
  { label: "mood", value: "ethereal meets editorial" },
  { label: "light", value: "golden hour obsessed" },
  { label: "gear", value: "whatever catches the moment" },
  { label: "booking", value: "DM on IG @melanilaurents" },
];
