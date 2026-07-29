import { attributeValue, normalizePost, tagValue } from "../normalize";
import { fetchText } from "../request";
import type { SocialPost, SocialProvider } from "../types";

function parseFeed(xml: string): SocialPost[] {
  const entries = xml.match(/<entry\b[\s\S]*?<\/entry>/gi) ?? [];

  return entries.flatMap((entry) => {
    const externalId = tagValue(entry, "yt:videoId");
    const publishedAt = tagValue(entry, "published");
    const title = tagValue(entry, "title");
    const body = tagValue(entry, "media:description");
    const author = tagValue(entry, "name");
    const thumbnailUrl = attributeValue(entry, "media:thumbnail", "url");

    if (!externalId) return [];

    const post = normalizePost({
      externalId,
      platform: "youtube",
      url: `https://www.youtube.com/watch?v=${encodeURIComponent(externalId)}`,
      publishedAt,
      title,
      body,
      thumbnailUrl,
      author,
      contentType: "video",
    });

    return post ? [post] : [];
  });
}

export function createYouTubeProvider(profileUrl?: string): SocialProvider {
  const channelId = process.env.YOUTUBE_CHANNEL_ID?.trim();

  return {
    platform: "youtube",
    profileUrl,
    configured: Boolean(channelId),
    async fetchLatest() {
      if (!channelId) return [];
      const url = new URL("https://www.youtube.com/feeds/videos.xml");
      url.searchParams.set("channel_id", channelId);
      return parseFeed(await fetchText(url));
    },
  };
}
