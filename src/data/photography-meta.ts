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
  { label: "booking", value: "inquiry form on About" },
];

export const photographyBooking = {
  instagramHandle: "melanilaurents",
  email: "itsmelanilaurent@gmail.com",
  mailtoSubject: "Photoshoot inquiry",
  dmMessage:
    "Hi Melani! I'd like to book a photoshoot.\n\nPreferred date: \nShoot type: Portraits / Vision / Scenery\n",
  steps: [
    "Share your preferred date, location (or let me choose), and the vibe you want — or note if you'd like to consult first",
    "I'll confirm within 24 hours",
  ],
  contactLead:
    "Ready to book? Send an inquiry below — I'll reply within 24 hours.",
} as const;
