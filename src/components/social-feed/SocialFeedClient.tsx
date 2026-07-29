"use client";

import { useMemo, useState } from "react";
import {
  SOCIAL_PILLARS,
  SOCIAL_PLATFORMS,
  type SocialPillar,
  type SocialPlatform,
  type SocialPost,
  type SocialProviderState,
} from "@/lib/social-feed/types";
import styles from "./SocialFeed.module.css";

type PlatformFilter = "all" | SocialPlatform;
type PillarFilter = "all" | SocialPillar;

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
  facebook: "Facebook",
  x: "X",
  linkedin: "LinkedIn",
};

const PILLAR_LABELS: Record<SocialPillar, string> = {
  essays: "Essays",
  books: "Books",
  daily: "Daily",
  builds: "Builds",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function postDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function joinClassNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

interface SocialFeedClientProps {
  className?: string;
  eyebrow: string;
  title: string;
  posts: SocialPost[];
  providers: SocialProviderState[];
  allowedPlatforms?: readonly SocialPlatform[];
  fixedPillar?: SocialPillar;
  visibleLimit?: number;
}

export function SocialFeedClient({
  className,
  eyebrow,
  title,
  posts,
  providers,
  allowedPlatforms,
  fixedPillar,
  visibleLimit = 12,
}: SocialFeedClientProps) {
  const platforms = allowedPlatforms ?? SOCIAL_PLATFORMS;
  const [platformFilter, setPlatformFilter] =
    useState<PlatformFilter>("all");
  const [pillarFilter, setPillarFilter] = useState<PillarFilter>(
    fixedPillar ?? "all",
  );
  const visiblePosts = useMemo(
    () =>
      posts
        .filter(
          (post) =>
            (platformFilter === "all" ||
              post.platform === platformFilter) &&
            (pillarFilter === "all" || post.pillar === pillarFilter),
        )
        .slice(0, visibleLimit),
    [pillarFilter, platformFilter, posts, visibleLimit],
  );
  const visibleProfiles = providers.filter(
    (provider) =>
      provider.profileUrl &&
      platforms.includes(provider.platform) &&
      (platformFilter === "all" ||
        provider.platform === platformFilter),
  );

  return (
    <section className={joinClassNames(styles.feed, className)}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <div className={styles.filterGroups}>
          {!fixedPillar ? (
            <div
              className={styles.filters}
              aria-label="Filter by content category"
            >
              <span className={styles.filterLabel}>Filed under</span>
              <button
                type="button"
                className={styles.filter}
                aria-pressed={pillarFilter === "all"}
                onClick={() => setPillarFilter("all")}
              >
                All
              </button>
              {SOCIAL_PILLARS.map((pillar) => (
                <button
                  key={pillar}
                  type="button"
                  className={styles.filter}
                  aria-pressed={pillarFilter === pillar}
                  onClick={() => setPillarFilter(pillar)}
                >
                  {PILLAR_LABELS[pillar]}
                </button>
              ))}
            </div>
          ) : null}
          <div
            className={styles.filters}
            aria-label="Filter by platform"
          >
            <span className={styles.filterLabel}>Source</span>
            <button
              type="button"
              className={styles.filter}
              aria-pressed={platformFilter === "all"}
              onClick={() => setPlatformFilter("all")}
            >
              All
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                className={styles.filter}
                aria-pressed={platformFilter === platform}
                onClick={() => setPlatformFilter(platform)}
              >
                {PLATFORM_LABELS[platform]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {visiblePosts.length > 0 ? (
        <ol className={styles.grid}>
          {visiblePosts.map((post) => {
            const heading = post.title ?? post.body;
            const showBody =
              post.body && post.body.trim() !== post.title?.trim();

            return (
              <li key={post.id} className={styles.item}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  {post.thumbnailUrl ? (
                    // Provider thumbnails come from trusted official API responses.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.thumbnailUrl}
                      alt=""
                      className={styles.thumbnail}
                      loading="lazy"
                    />
                  ) : null}
                  <div className={styles.cardBody}>
                    <div className={styles.meta}>
                      <span>{PLATFORM_LABELS[post.platform]}</span>
                      <time dateTime={post.publishedAt}>
                        {postDate(post.publishedAt)}
                      </time>
                    </div>
                    {heading ? <h3>{heading}</h3> : null}
                    {showBody ? <p>{post.body}</p> : null}
                    <div className={styles.cardFooter}>
                      <span>{post.pillar}</span>
                      <span aria-hidden>↗</span>
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Nothing published here yet.</p>
          <p className={styles.emptyBody}>
            New public posts will appear automatically when their connector is
            active. Until then, go straight to the source.
          </p>
          {visibleProfiles.length > 0 ? (
            <div className={styles.profileLinks}>
              {visibleProfiles.map((provider) => (
                <a
                  key={provider.platform}
                  href={provider.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PLATFORM_LABELS[provider.platform]} ↗
                </a>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
