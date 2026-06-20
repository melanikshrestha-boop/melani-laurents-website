import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Melani Laurent S.",
    short_name: "Melani",
    description:
      "Med-tech builder, photographer, and creator at the intersection of research and craft.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0908",
    theme_color: "#ddb896",
  };
}
