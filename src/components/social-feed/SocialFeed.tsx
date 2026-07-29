import { getSocialFeed } from "@/lib/social-feed";
import type {
  SocialPillar,
  SocialPlatform,
} from "@/lib/social-feed";
import { SocialFeedClient } from "./SocialFeedClient";

export interface UnifiedSocialFeedProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  limit?: number;
  pillar?: SocialPillar;
  platforms?: readonly SocialPlatform[];
}

/**
 * Async Server Component for the unified social stream.
 *
 * Example:
 * `<UnifiedSocialFeed pillar="books" limit={8} />`
 */
export async function UnifiedSocialFeed({
  className,
  eyebrow = "Across the internet",
  title = "The latest, in one place.",
  limit = 12,
  pillar,
  platforms,
}: UnifiedSocialFeedProps) {
  const feed = await getSocialFeed({
    limit: pillar ? limit : 50,
    pillar,
    platforms,
  });

  return (
    <SocialFeedClient
      className={className}
      eyebrow={eyebrow}
      title={title}
      posts={feed.posts}
      providers={feed.providers}
      allowedPlatforms={platforms}
      fixedPillar={pillar}
      visibleLimit={limit}
    />
  );
}

export { getSocialFeed } from "@/lib/social-feed";
