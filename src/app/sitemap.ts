import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPhotoCollectionSlugs } from "@/lib/photography";
import { getResearchSlugs } from "@/lib/research";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/art",
    "/daily",
    "/research",
    "/contact",
    "/publications",
    "/photography",
    "/photography/about",
  ];

  const researchPages = getResearchSlugs().map((slug) => ({
    url: `${siteConfig.url}/research/${slug}`,
    lastModified: new Date(),
  }));

  const photographyPages = getPhotoCollectionSlugs().map((slug) => ({
    url: `${siteConfig.url}/photography/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })),
    ...researchPages,
    ...photographyPages,
  ];
}
