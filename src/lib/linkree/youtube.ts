import { STALE_DAYS, YOUTUBE_CHANNEL_ID } from "./site";

export type YoutubeLatest = {
  title: string;
  videoId: string;
  url: string;
  thumb: string;
  publishedAt: string;
};

export type YoutubePayload = YoutubeLatest | { empty: true };

export const EMPTY = { empty: true } as const;

export function youtubeFeedUrl(channelId = YOUTUBE_CHANNEL_ID): string {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
}

export async function getLatestYoutube(): Promise<YoutubePayload> {
  try {
    const res = await fetch(youtubeFeedUrl(), {
      headers: { "user-agent": "celine-nova-links/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return EMPTY;
    return parseLatestEntry(await res.text());
  } catch {
    return EMPTY;
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

export function parseLatestEntry(xml: string, now = Date.now()): YoutubePayload {
  const match = xml.match(/<entry>([\s\S]*?)<\/entry>/);
  if (!match) return EMPTY;
  const block = match[1];
  const videoId = block.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1]?.trim();
  const title = block.match(/<title>([^<]*)<\/title>/)?.[1];
  const publishedAt = block.match(/<published>([^<]+)<\/published>/)?.[1]?.trim();
  if (!videoId || title == null || !publishedAt) return EMPTY;
  const publishedMs = Date.parse(publishedAt);
  if (!Number.isFinite(publishedMs)) return EMPTY;
  const ageDays = (now - publishedMs) / 86_400_000;
  if (ageDays > STALE_DAYS) return EMPTY;
  return {
    title: decodeEntities(title.trim()),
    videoId,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    thumb: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    publishedAt,
  };
}
