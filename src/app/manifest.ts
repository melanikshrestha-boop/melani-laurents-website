import type { MetadataRoute } from "next";
import { EREN_TAB_SRC } from "@/lib/eren-tab";

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
        src: EREN_TAB_SRC,
        sizes: "256x256",
        type: "image/png",
        purpose: "any",
      },
      {
        src: EREN_TAB_SRC,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: EREN_TAB_SRC,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
