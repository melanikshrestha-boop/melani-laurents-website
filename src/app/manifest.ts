import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Celine Nova",
    short_name: "Celine",
    description:
      "Essays, reading notes, daily inputs, art, and the things I build.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e7",
    theme_color: "#f7f1e7",
    icons: [
      {
        src: "/icon.png",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
