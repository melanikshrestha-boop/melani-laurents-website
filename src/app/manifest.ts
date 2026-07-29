import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Celine Nova",
    short_name: "CN",
    description:
      "Open sourcing my mind through essays, reading notes, daily inputs, art, and the things I build.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
  };
}
