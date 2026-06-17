import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Melani Kirstein",
    short_name: "MK",
    description:
      "Technical builder at the intersection of med-tech, research, and entrepreneurship.",
    start_url: "/",
    display: "standalone",
    background_color: "#121110",
    theme_color: "#c99585",
  };
}
