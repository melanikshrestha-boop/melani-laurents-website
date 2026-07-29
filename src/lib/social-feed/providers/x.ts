import { normalizePost, summarize } from "../normalize";
import { fetchJson } from "../request";
import type { SocialPost, SocialProvider } from "../types";

interface XMedia {
  media_key: string;
  type?: "animated_gif" | "photo" | "video";
  url?: string;
  preview_image_url?: string;
}

interface XPost {
  id: string;
  text?: string;
  created_at?: string;
  attachments?: { media_keys?: string[] };
}

interface XTimelineResponse {
  data?: XPost[];
  includes?: { media?: XMedia[] };
}

export function createXProvider(profileUrl?: string): SocialProvider {
  const token = process.env.X_BEARER_TOKEN?.trim();
  const userId = process.env.X_USER_ID?.trim();
  const username = process.env.X_USERNAME?.trim();

  return {
    platform: "x",
    profileUrl,
    configured: Boolean(token && userId),
    async fetchLatest() {
      if (!token || !userId) return [];

      const url = new URL(`https://api.x.com/2/users/${userId}/tweets`);
      url.searchParams.set("max_results", "10");
      url.searchParams.set("exclude", "retweets,replies");
      url.searchParams.set("tweet.fields", "created_at,attachments");
      url.searchParams.set("expansions", "attachments.media_keys");
      url.searchParams.set(
        "media.fields",
        "media_key,type,url,preview_image_url",
      );

      const payload = await fetchJson<XTimelineResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mediaByKey = new Map(
        (payload.includes?.media ?? []).map((media) => [
          media.media_key,
          media,
        ]),
      );

      return (payload.data ?? []).flatMap((item): SocialPost[] => {
        const media = item.attachments?.media_keys
          ?.map((key) => mediaByKey.get(key))
          .find(Boolean);
        const post = normalizePost({
          externalId: item.id,
          platform: "x",
          url: username
            ? `https://x.com/${username}/status/${item.id}`
            : `https://x.com/i/web/status/${item.id}`,
          publishedAt: item.created_at,
          title: summarize(item.text),
          body: item.text,
          thumbnailUrl: media?.preview_image_url ?? media?.url,
          mediaUrl: media?.url,
          author: username ? `@${username}` : undefined,
          contentType:
            media?.type === "video" || media?.type === "animated_gif"
              ? "video"
              : media?.type === "photo"
                ? "image"
                : "text",
        });

        return post ? [post] : [];
      });
    },
  };
}
