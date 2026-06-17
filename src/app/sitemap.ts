import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getResearchSlugs } from "@/lib/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/projects", "/research", "/about", "/contact"];

  const researchPages = getResearchSlugs().map((slug) => ({
    url: `${siteConfig.url}/research/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })),
    ...researchPages,
  ];
}
