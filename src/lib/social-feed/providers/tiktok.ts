import { normalizePost, summarize } from "../normalize";
import { fetchJson } from "../request";
import type { SocialPost, SocialProvider } from "../types";

interface TikTokVideo {
  id: string;
  create_time?: number;
  title?: string;
  video_description?: string;
  cover_image_url?: string;
  share_url?: string;
  embed_link?: string;
}

interface TikTokVideoListResponse {
  data?: { videos?: TikTokVideo[] };
  error?: { code?: string; message?: string };
}

export function createTikTokProvider(profileUrl?: string): SocialProvider {
  const token = process.env.TIKTOK_ACCESS_TOKEN?.trim();

  return {
    platform: "tiktok",
    profileUrl,
    configured: Boolean(token),
    async fetchLatest() {
      if (!token) return [];

      const url = new URL("https://open.tiktokapis.com/v2/video/list/");
      url.searchParams.set(
        "fields",
        [
          "id",
          "create_time",
          "title",
          "video_description",
          "cover_image_url",
          "share_url",
          "embed_link",
        ].join(","),
      );

      const payload = await fetchJson<TikTokVideoListResponse>(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ max_count: 20 }),
      });

      if (payload.error?.code && payload.error.code !== "ok") {
        throw new Error("TikTok Display API request failed");
      }

      return (payload.data?.videos ?? []).flatMap((item): SocialPost[] => {
        const body = item.video_description ?? item.title;
        const url = item.share_url ?? item.embed_link;
        if (!url) return [];

        const post = normalizePost({
          externalId: item.id,
          platform: "tiktok",
          url,
          publishedAt: item.create_time,
          title: item.title || summarize(body),
          body,
          thumbnailUrl: item.cover_image_url,
          author: process.env.TIKTOK_USERNAME,
          contentType: "video",
        });

        return post ? [post] : [];
      });
    },
  };
}
