import "server-only";

import { unstable_cache } from "next/cache";
import { siteConfig } from "@/config/site";
import { createFacebookProvider } from "./providers/facebook";
import { createInstagramProvider } from "./providers/instagram";
import { createLinkedInProvider } from "./providers/linkedin";
import { createTikTokProvider } from "./providers/tiktok";
import { createXProvider } from "./providers/x";
import { createYouTubeProvider } from "./providers/youtube";
import type {
  SocialFeedOptions,
  SocialFeedResult,
  SocialPlatform,
  SocialPost,
  SocialProvider,
  SocialProviderState,
} from "./types";

export type {
  SocialContentType,
  SocialFeedOptions,
  SocialFeedResult,
  SocialPillar,
  SocialPlatform,
  SocialPost,
  SocialProviderState,
} from "./types";
export { SOCIAL_PILLARS, SOCIAL_PLATFORMS } from "./types";

function safeProfileUrl(value: string | undefined) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

function siteProfile(platform: SocialPlatform) {
  if (platform === "facebook") {
    return safeProfileUrl(process.env.FACEBOOK_PROFILE_URL);
  }

  return safeProfileUrl(
    siteConfig.socialLinks.find((link) => link.id === platform)?.href,
  );
}

function providers(): SocialProvider[] {
  return [
    createYouTubeProvider(siteProfile("youtube")),
    createTikTokProvider(siteProfile("tiktok")),
    createInstagramProvider(siteProfile("instagram")),
    createFacebookProvider(siteProfile("facebook")),
    createXProvider(siteProfile("x")),
    createLinkedInProvider(siteProfile("linkedin")),
  ];
}

function uniqueNewest(posts: SocialPost[]) {
  const unique = new Map<string, SocialPost>();

  for (const post of posts) {
    const existing = unique.get(post.id);
    if (
      !existing ||
      new Date(post.publishedAt).getTime() >
        new Date(existing.publishedAt).getTime()
    ) {
      unique.set(post.id, post);
    }
  }

  return [...unique.values()].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime(),
  );
}

async function fetchAllSocialPosts(): Promise<SocialFeedResult> {
  const allProviders = providers();
  const results = await Promise.allSettled(
    allProviders.map((provider) =>
      provider.configured ? provider.fetchLatest() : Promise.resolve([]),
    ),
  );

  const posts: SocialPost[] = [];
  const states: SocialProviderState[] = [];
  const failedProviders: SocialPlatform[] = [];

  results.forEach((result, index) => {
    const provider = allProviders[index];

    if (!provider.configured) {
      states.push({
        platform: provider.platform,
        status: "not_configured",
        profileUrl: provider.profileUrl,
      });
      return;
    }

    if (result.status === "rejected") {
      failedProviders.push(provider.platform);
      states.push({
        platform: provider.platform,
        status: "failed",
        profileUrl: provider.profileUrl,
      });
      return;
    }

    posts.push(...result.value);
    states.push({
      platform: provider.platform,
      status: result.value.length > 0 ? "connected" : "empty",
      profileUrl: provider.profileUrl,
    });
  });

  return {
    posts: uniqueNewest(posts),
    providers: states,
    failedProviders,
    generatedAt: new Date().toISOString(),
  };
}

const getCachedSocialFeed = unstable_cache(
  fetchAllSocialPosts,
  ["unified-social-feed-v1"],
  {
    revalidate: 900,
    tags: ["social-feed"],
  },
);

/**
 * Server-only connector entry point. Missing credentials and individual API
 * failures return a partial feed instead of failing the page.
 */
export async function getSocialFeed(
  options: SocialFeedOptions = {},
): Promise<SocialFeedResult> {
  const result = await getCachedSocialFeed();
  const enabledPlatforms = options.platforms
    ? new Set(options.platforms)
    : null;
  const limit = Math.max(0, Math.min(options.limit ?? 18, 50));

  const posts = result.posts
    .filter(
      (post) =>
        (!enabledPlatforms || enabledPlatforms.has(post.platform)) &&
        (!options.pillar || post.pillar === options.pillar),
    )
    .slice(0, limit);

  return { ...result, posts };
}
