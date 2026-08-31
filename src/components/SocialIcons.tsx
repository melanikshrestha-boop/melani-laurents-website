"use client";

import { siteConfig, type SocialId } from "@/config/site";
import { Allura } from "next/font/google";

const handwriting = Allura({
  subsets: ["latin"],
  weight: "400",
});

const socialIcons: Record<SocialId, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.17-.97-.56-.26-1.08-.59-1.59-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.72-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.68.41-1.07.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  ),
};

interface SocialIconsProps {
  className?: string;
  size?: "sm" | "md" | "hub";
  /** icons = SVG marks. labels = same words as the CELINE NOVA wordmark. */
  appearance?: "icons" | "labels";
}

function placeHoverNote(anchor: HTMLAnchorElement) {
  const note = anchor.querySelector<HTMLElement>(".social-icons__tip");
  if (!note) return;

  const margin = 24;
  const gap = 8;
  const cap = window.innerWidth <= 900 ? 160 : 220;
  const anchorRect = anchor.getBoundingClientRect();
  const anchorCenter = anchorRect.left + anchorRect.width / 2;

  note.style.removeProperty("--social-tip-width");
  let noteRect = note.getBoundingClientRect();
  const room =
    2 *
    Math.min(
      anchorCenter - margin,
      window.innerWidth - margin - anchorCenter,
    );
  const nextWidth = Math.min(cap, Math.max(0, room));

  if (nextWidth >= 120 && nextWidth < noteRect.width) {
    note.style.setProperty("--social-tip-width", `${nextWidth}px`);
    noteRect = note.getBoundingClientRect();
  }

  const maxLeft = Math.max(margin, window.innerWidth - noteRect.width - margin);
  const centeredLeft = anchorCenter - noteRect.width / 2;
  const left = Math.min(Math.max(centeredLeft, margin), maxLeft);

  const onWordmark = Boolean(anchor.closest(".hub-page__socials--wordmark"));
  let top = onWordmark
    ? anchorRect.top - noteRect.height - gap
    : anchorRect.bottom + gap;
  if (!onWordmark && top + noteRect.height > window.innerHeight - margin) {
    top = anchorRect.top - noteRect.height - gap;
  }

  /* Photo HUD: never cover the centered name. */
  const photoHub = anchor.closest(".hub-page--photo");
  if (photoHub && !onWordmark) {
    const title = photoHub.querySelector<HTMLElement>(".hub-page__title");
    const titleRect = title?.getBoundingClientRect();
    const overlapsTitle = titleRect
      ? left < titleRect.right &&
        left + noteRect.width > titleRect.left &&
        top < titleRect.bottom &&
        top + noteRect.height > titleRect.top
      : false;
    if (overlapsTitle || top + noteRect.height > window.innerHeight * 0.28) {
      top = Math.max(margin, anchorRect.top - noteRect.height - gap);
    }
  }

  if (onWordmark) {
    /* Stay above the labels even if the note is tall — don't shove it onto CELINE NOVA. */
    top = Math.max(8, Math.min(top, anchorRect.top - noteRect.height - gap));
  } else {
    top = Math.min(
      Math.max(top, margin),
      Math.max(margin, window.innerHeight - noteRect.height - margin),
    );
  }

  note.style.setProperty("--social-tip-left", `${left}px`);
  note.style.setProperty("--social-tip-top", `${top}px`);
}

export function SocialIcons({
  className = "",
  size = "md",
  appearance = "icons",
}: SocialIconsProps) {
  const isLabels = appearance === "labels";
  /* hub: em-based so piece scale + canvas scale both apply (no fixed rem) */
  const iconSize =
    size === "hub"
      ? "h-[1em] w-[1em]"
      : size === "sm"
        ? "h-3.5 w-3.5"
        : "h-4 w-4";
  const gap = isLabels
    ? "gap-[0.95em]"
    : size === "hub"
      ? "gap-[0.7em]"
      : size === "sm"
        ? "gap-2.5"
        : "gap-3";

  return (
    <div
      className={`social-icons flex flex-nowrap items-center ${gap} ${className}`}
    >
      {siteConfig.socialLinks.map((link) => {
        const { id, label, href } = link;
        const hoverNote =
          "hoverNote" in link && typeof link.hoverNote === "string"
            ? link.hoverNote
            : undefined;

        return (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={isLabels ? undefined : label}
            className={
              hoverNote
                ? "social-icons__link social-icons__link--tip"
                : "social-icons__link"
            }
            /* Native title only when we have no personal note (avoids double tooltip) */
            title={hoverNote || isLabels ? undefined : label}
            onPointerEnter={
              hoverNote ? (event) => placeHoverNote(event.currentTarget) : undefined
            }
            onFocus={
              hoverNote ? (event) => placeHoverNote(event.currentTarget) : undefined
            }
          >
            {isLabels ? (
              <span className="social-icons__label">{label}</span>
            ) : (
              <span className={`social-icons__icon ${iconSize}`}>
                {socialIcons[id]}
              </span>
            )}
            {hoverNote ? (
              <span
                className="social-icons__tip"
                role="tooltip"
                style={{ fontFamily: handwriting.style.fontFamily }}
              >
                {hoverNote}
              </span>
            ) : null}
          </a>
        );
      })}
    </div>
  );
}
