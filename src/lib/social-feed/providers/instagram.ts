import { normalizePost, summarize } from "../normalize";
import { fetchJson } from "../request";
import type { SocialPost, SocialProvider } from "../types";

interface InstagramMedia {
  id: string;
  caption?: string;
  media_type?: "CAROUSEL_ALBUM" | "IMAGE" | "REELS" | "VIDEO";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

interface InstagramMediaResponse {
  data?: InstagramMedia[];
}

function graphVersion() {
  const value = process.env.META_GRAPH_VERSION?.trim() || "v23.0";
  return value.startsWith("v") ? value : `v${value}`;
}

export function createInstagramProvider(profileUrl?: string): SocialProvider {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const userId = process.env.INSTAGRAM_USER_ID?.trim();
  const username = process.env.INSTAGRAM_USERNAME?.trim();

  return {
    platform: "instagram",
    profileUrl,
    configured: Boolean(token && userId),
    async fetchLatest() {
      if (!token || !userId) return [];

      const url = new URL(
        `https://graph.instagram.com/${graphVersion()}/${userId}/media`,
      );
      url.searchParams.set(
        "fields",
        [
          "id",
          "caption",
          "media_type",
          "media_url",
          "thumbnail_url",
          "permalink",
          "timestamp",
        ].join(","),
      );
      url.searchParams.set("limit", "20");

      const payload = await fetchJson<InstagramMediaResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return (payload.data ?? []).flatMap((item): SocialPost[] => {
        if (!item.permalink) return [];
        const isVideo =
          item.media_type === "VIDEO" || item.media_type === "REELS";
        const post = normalizePost({
          externalId: item.id,
          platform: "instagram",
          url: item.permalink,
          publishedAt: item.timestamp,
          title: summarize(item.caption),
          body: item.caption,
          thumbnailUrl: item.thumbnail_url ?? item.media_url,
          mediaUrl: isVideo ? undefined : item.media_url,
          author: username ? `@${username}` : undefined,
          contentType: isVideo ? "video" : "image",
        });

        return post ? [post] : [];
      });
    },
  };
}
