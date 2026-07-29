import { normalizePost, summarize } from "../normalize";
import { fetchJson } from "../request";
import type { SocialPost, SocialProvider } from "../types";

interface LinkedInPost {
  id: string;
  commentary?: string;
  createdAt?: number;
  publishedAt?: number;
  lifecycleState?: string;
  content?: {
    article?: {
      source?: string;
      title?: string;
      description?: string;
    };
  };
}

interface LinkedInPostsResponse {
  elements?: LinkedInPost[];
}

export function createLinkedInProvider(profileUrl?: string): SocialProvider {
  const token = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN?.trim();
  const version = process.env.LINKEDIN_VERSION?.trim();

  return {
    platform: "linkedin",
    profileUrl,
    configured: Boolean(token && authorUrn && version),
    async fetchLatest() {
      if (!token || !authorUrn || !version) return [];

      const url = new URL("https://api.linkedin.com/rest/posts");
      url.searchParams.set("author", authorUrn);
      url.searchParams.set("q", "author");
      url.searchParams.set("count", "20");
      url.searchParams.set("sortBy", "CREATED");

      const payload = await fetchJson<LinkedInPostsResponse>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "LinkedIn-Version": version,
          "X-Restli-Protocol-Version": "2.0.0",
          "X-RestLi-Method": "FINDER",
        },
      });

      return (payload.elements ?? []).flatMap((item): SocialPost[] => {
        if (!item.id || item.lifecycleState === "DRAFT") return [];
        const article = item.content?.article;
        const postUrl =
          article?.source ??
          `https://www.linkedin.com/feed/update/${item.id}/`;
        const post = normalizePost({
          externalId: item.id,
          platform: "linkedin",
          url: postUrl,
          publishedAt: item.publishedAt ?? item.createdAt,
          title: article?.title ?? summarize(item.commentary),
          body: item.commentary ?? article?.description,
          author: process.env.LINKEDIN_AUTHOR_NAME,
          contentType: article ? "link" : "text",
        });

        return post ? [post] : [];
      });
    },
  };
}
