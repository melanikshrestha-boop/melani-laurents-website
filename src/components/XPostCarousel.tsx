"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyPost } from "@/data/daily-posts";

function formatPostTime(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * X-style post cards in a user-controlled horizontal slider.
 * Prev / next, dots, keyboard, and swipe — fun without autoplay hijacking.
 */
export function XPostCarousel({ posts }: { posts: DailyPost[] }) {
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const n = posts.length;

  const go = useCallback(
    (next: number) => {
      if (n === 0) return;
      setIndex(((next % n) + n) % n);
    },
    [n],
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  if (n === 0) {
    return (
      <p className="daily-x-carousel__empty">
        No posts yet — the ones I write land here.
      </p>
    );
  }

  const post = posts[index];

  return (
    <div
      className="daily-x-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="My posts on X"
    >
      <div className="daily-x-carousel__stage">
        <button
          type="button"
          className="daily-x-carousel__arrow daily-x-carousel__arrow--prev"
          onClick={prev}
          aria-label="Previous post"
          disabled={n < 2}
        >
          ‹
        </button>

        <div
          className="daily-x-carousel__viewport"
          onTouchStart={(e) => {
            touchX.current = e.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchX.current == null) return;
            const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) < 40) return;
            if (dx > 0) prev();
            else next();
          }}
        >
          <div
            ref={trackRef}
            className="daily-x-carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {posts.map((p, i) => (
              <article
                key={p.slug}
                className="daily-x-post"
                aria-hidden={i !== index}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}`}
              >
                <header className="daily-x-post__head">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="daily-x-post__avatar"
                    src={
                      p.avatarUrl ??
                      "https://pbs.twimg.com/profile_images/2076576094493327360/LaEvB-1S.jpg"
                    }
                    alt=""
                    width={44}
                    height={44}
                  />
                  <div className="daily-x-post__who">
                    <div className="daily-x-post__names">
                      <strong>{p.displayName ?? "Celine Nova"}</strong>
                      <span className="daily-x-post__handle">
                        {p.handle ?? "@MelaniLaurentS"}
                      </span>
                    </div>
                    <time dateTime={p.date}>{formatPostTime(p.date)}</time>
                  </div>
                  <span className="daily-x-post__x" aria-hidden>
                    𝕏
                  </span>
                </header>
                <p className="daily-x-post__body">{p.title}</p>
                <footer className="daily-x-post__foot">
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="daily-x-post__open"
                  >
                    View on X ↗
                  </a>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="daily-x-carousel__arrow daily-x-carousel__arrow--next"
          onClick={next}
          aria-label="Next post"
          disabled={n < 2}
        >
          ›
        </button>
      </div>

      <div className="daily-x-carousel__controls">
        <div className="daily-x-carousel__dots" role="tablist" aria-label="Posts">
          {posts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show post ${i + 1}`}
              className={`daily-x-carousel__dot${i === index ? " is-on" : ""}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <p className="daily-x-carousel__counter" aria-live="polite">
          {index + 1} / {n}
        </p>
        <p className="daily-x-carousel__hint">
          Swipe · arrows · ← → keys — only posts I write
        </p>
      </div>

      {/* Prefetch/read current for screen readers when not on slide */}
      <span className="sr-only">{post.title}</span>
    </div>
  );
}
