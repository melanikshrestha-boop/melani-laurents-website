import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getPhotoCollectionSlugs } from "@/lib/photography";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/art",
    "/daily",
    "/projects",
    "/youtube",
    "/contact",
    "/publications",
    "/photography",
    "/photography/about",
  ];

  const photographyPages = getPhotoCollectionSlugs().map((slug) => ({
    url: `${siteConfig.url}/photography/${slug}`,
    lastModified: new Date(),
  }));

  return [
    ...staticPages.map((path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: new Date(),
    })),
    ...photographyPages,
  ];
}
