"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DailyPost, QuotedPost } from "@/data/daily-posts";

function formatDateShort(date: string): string {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function QuotedCard({ q }: { q: QuotedPost }) {
  const inner = (
    <>
      <div className="x-quote__head">
        {q.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="x-quote__avatar" src={q.avatarUrl} alt="" width={20} height={20} />
        ) : (
          <span className="x-quote__avatar x-quote__avatar--fallback" aria-hidden />
        )}
        <strong>{q.displayName}</strong>
        <span className="x-quote__handle">{q.handle}</span>
        {q.date ? <span className="x-quote__dot">·</span> : null}
        {q.date ? <span className="x-quote__date">{q.date}</span> : null}
      </div>
      <p className="x-quote__body">{q.text}</p>
    </>
  );

  if (q.href) {
    return (
      <a
        href={q.href}
        target="_blank"
        rel="noopener noreferrer"
        className="x-quote"
        onClick={(e) => e.stopPropagation()}
      >
        {inner}
      </a>
    );
  }
  return <div className="x-quote">{inner}</div>;
}

function XPostCard({ post }: { post: DailyPost }) {
  const name = post.displayName ?? "Celine Nova";
  const handle = post.handle ?? "@MelaniLaurentS";
  const avatar =
    post.avatarUrl ??
    "https://pbs.twimg.com/profile_images/2076576094493327360/LaEvB-1S.jpg";

  return (
    <article className="x-tweet">
      <div className="x-tweet__row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="x-tweet__avatar" src={avatar} alt="" width={40} height={40} />
        <div className="x-tweet__main">
          <header className="x-tweet__meta">
            <div className="x-tweet__names">
              <strong className="x-tweet__name">{name}</strong>
              <span className="x-tweet__handle">{handle}</span>
            </div>
            <span className="x-tweet__logo" aria-hidden>
              𝕏
            </span>
          </header>

          <p className="x-tweet__text">{post.title}</p>

          {post.quoted ? <QuotedCard q={post.quoted} /> : null}

          <div className="x-tweet__time">
            {post.timeLabel ? <span>{post.timeLabel}</span> : null}
            {post.timeLabel ? <span className="x-tweet__sep">·</span> : null}
            <time dateTime={post.date}>{formatDateShort(post.date)}</time>
            {post.viewsLabel ? (
              <>
                <span className="x-tweet__sep">·</span>
                <span>
                  <strong>{post.viewsLabel}</strong> Views
                </span>
              </>
            ) : null}
          </div>

          <div className="x-tweet__actions" aria-hidden>
            <span>💬</span>
            <span>🔁</span>
            <span>♡</span>
            <span>↗</span>
          </div>

          <a
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            className="x-tweet__open"
          >
            Open on X ↗
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Real X-format posts in a user-controlled horizontal slider.
 * Looks like the app (dark tweet cards), not generic “Open ↗” list rows.
 */
export function XPostCarousel({ posts }: { posts: DailyPost[] }) {
  const [index, setIndex] = useState(0);
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
            className="daily-x-carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {posts.map((p, i) => (
              <div
                key={p.slug}
                className="daily-x-carousel__slide"
                aria-hidden={i !== index}
              >
                <XPostCard post={p} />
              </div>
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
          Swipe · ‹ › · ← → — only posts I write
        </p>
      </div>
    </div>
  );
}
