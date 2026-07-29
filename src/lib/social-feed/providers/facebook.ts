import { normalizePost, summarize } from "../normalize";
import { fetchJson } from "../request";
import type { SocialPost, SocialProvider } from "../types";

interface FacebookAttachment {
  media_type?: string;
  title?: string;
  description?: string;
  url?: string;
}

interface FacebookPost {
  id: string;
  message?: string;
  created_time?: string;
  permalink_url?: string;
  full_picture?: string;
  attachments?: { data?: FacebookAttachment[] };
}

interface FacebookPostsResponse {
  data?: FacebookPost[];
}

function graphVersion() {
  const value = process.env.META_GRAPH_VERSION?.trim() || "v23.0";
  return value.startsWith("v") ? value : `v${value}`;
}

export function createFacebookProvider(profileUrl?: string): SocialProvider {
  const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();

  return {
    platform: "facebook",
    profileUrl,
    configured: Boolean(token && pageId),
    async fetchLatest() {
      if (!token || !pageId) return [];

      const url = new URL(
        `https://graph.facebook.com/${graphVersion()}/${pageId}/posts`,
      );
      url.searchParams.set(
        "fields",
        [
          "id",
          "message",
          "created_time",
          "permalink_url",
          "full_picture",
          "attachments{media_type,title,description,url}",
        ].join(","),
      );
      url.searchParams.set("limit", "20");

      const payload = await fetchJson<FacebookPostsResponse>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return (payload.data ?? []).flatMap((item): SocialPost[] => {
        const attachment = item.attachments?.data?.[0];
        const url = item.permalink_url ?? attachment?.url;
        if (!url) return [];
        const mediaType = attachment?.media_type?.toLowerCase();
        const body = item.message ?? attachment?.description;
        const post = normalizePost({
          externalId: item.id,
          platform: "facebook",
          url,
          publishedAt: item.created_time,
          title: attachment?.title ?? summarize(body),
          body,
          thumbnailUrl: item.full_picture,
          author: process.env.FACEBOOK_PAGE_NAME,
          contentType: mediaType?.includes("video")
            ? "video"
            : item.full_picture
              ? "image"
              : "text",
        });

        return post ? [post] : [];
      });
    },
  };
}
