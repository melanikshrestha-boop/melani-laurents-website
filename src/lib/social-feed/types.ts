export const SOCIAL_PLATFORMS = [
  "youtube",
  "tiktok",
  "instagram",
  "facebook",
  "x",
  "linkedin",
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export const SOCIAL_PILLARS = [
  "essays",
  "books",
  "daily",
  "builds",
] as const;

export type SocialPillar = (typeof SOCIAL_PILLARS)[number];

export type SocialContentType = "text" | "image" | "video" | "link";

export interface SocialPost {
  /** Stable normalized id, for example `youtube:dQw4w9WgXcQ`. */
  id: string;
  /** The provider's own id, kept separately for upserts and debugging. */
  externalId: string;
  platform: SocialPlatform;
  pillar: SocialPillar;
  contentType: SocialContentType;
  url: string;
  publishedAt: string;
  title?: string;
  body?: string;
  thumbnailUrl?: string;
  mediaUrl?: string;
  author?: string;
}

export type SocialProviderStatus =
  | "connected"
  | "not_configured"
  | "empty"
  | "failed";

export interface SocialProviderState {
  platform: SocialPlatform;
  status: SocialProviderStatus;
  profileUrl?: string;
}

export interface SocialFeedResult {
  posts: SocialPost[];
  providers: SocialProviderState[];
  /** Provider names only. API response bodies and credentials are never exposed. */
  failedProviders: SocialPlatform[];
  generatedAt: string;
}

export interface SocialFeedOptions {
  limit?: number;
  pillar?: SocialPillar;
  platforms?: readonly SocialPlatform[];
}

export interface SocialProvider {
  platform: SocialPlatform;
  profileUrl?: string;
  configured: boolean;
  fetchLatest: () => Promise<SocialPost[]>;
}
