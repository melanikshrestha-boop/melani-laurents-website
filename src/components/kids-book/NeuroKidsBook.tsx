"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { kidsNeuroStory } from "@/data/kids-neuro-story";

/**
 * Interactive neuroscience storybook for kids.
 * Any keyboard key (or a tap/click on the book) turns to the next page.
 * After the last page, it loops back to the cover so they can read again.
 */
export function NeuroKidsBook() {
  // Which page of the story we are on right now (starts at 0 = cover)
  const [pageIndex, setPageIndex] = useState(0);
  // Short flash when a page turns — makes the flip feel alive
  const [isFlipping, setIsFlipping] = useState(false);
  // Big hint on first page so kids know what to do
  const [showHint, setShowHint] = useState(true);
  // Instant lock so Enter key + button click cannot skip two pages at once
  const flipLockRef = useRef(false);

  const total = kidsNeuroStory.length; // how many pages in the whole book
  const page = kidsNeuroStory[pageIndex]; // the page object we show now
  const isNight = page.id === "sleep"; // night chapter uses light text

  // Go to the next page (or back to the start after the end)
  const turnPage = useCallback(() => {
    // Do not start a second flip while one is already animating
    if (flipLockRef.current) return;
    flipLockRef.current = true; // lock right away (faster than waiting for React state)

    setIsFlipping(true); // start the flip animation
    setShowHint(false); // hide the “press a key” tip after first turn

    // After a short flip, move the page number forward
    window.setTimeout(() => {
      setPageIndex((current) => {
        const next = current + 1; // one page forward
        // If we went past the last page, restart the story
        return next >= total ? 0 : next;
      });
      setIsFlipping(false); // flip animation finished
      flipLockRef.current = false; // allow the next key or tap
    }, 280);
  }, [total]);

  // Listen for ANY keyboard key — that is how kids turn pages
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Ignore pure modifier keys so Shift alone does not count
      if (event.key === "Shift" || event.key === "Control" || event.key === "Alt" || event.key === "Meta") {
        return;
      }
      // Do not scroll the page with space/arrows while reading
      if (
        event.key === " " ||
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "PageDown" ||
        event.key === "Enter"
      ) {
        event.preventDefault();
      }
      turnPage(); // any other key still turns the page
    };

    window.addEventListener("keydown", onKeyDown); // start listening
    return () => window.removeEventListener("keydown", onKeyDown); // clean up
  }, [turnPage]);

  // Progress as a percent for the little bar at the bottom
  const progress = ((pageIndex + 1) / total) * 100;

  return (
    <div
      className={`kids-book ${isNight ? "kids-book--night" : ""} ${isFlipping ? "kids-book--flip" : ""}`}
      style={
        {
          // Soft page color from the story data
          ["--kids-bg" as string]: page.bg,
          ["--kids-accent" as string]: page.accent,
        } as CSSProperties
      }
    >
      {/* Soft floating dots in the background for a magical feel */}
      <div className="kids-book__sparkles" aria-hidden>
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>

      <header className="kids-book__top">
        <p className="kids-book__brand">Melani’s Brain Book</p>
        <p className="kids-book__counter" aria-live="polite">
          Page {pageIndex + 1} of {total}
        </p>
      </header>

      {/* Main book surface — click/tap also turns the page */}
      <button
        type="button"
        className="kids-book__page"
        onClick={turnPage}
        aria-label={`Story page: ${page.title}. Press any key or tap to go to the next page.`}
      >
        <p className="kids-book__chapter">{page.chapter}</p>

        {/* Big friendly picture (emoji) for young readers */}
        <div className="kids-book__emoji" aria-hidden>
          {page.emoji}
        </div>

        <h1 className="kids-book__title">{page.title}</h1>
        <p className="kids-book__story">{page.story}</p>

        {/* Little science box — still simple words */}
        <div className="kids-book__fact">
          <span className="kids-book__fact-label">Brain fact</span>
          <p>{page.fact}</p>
        </div>

        {showHint ? (
          <p className="kids-book__hint">
            Press any key on the keyboard — or tap this page — to turn
          </p>
        ) : (
          <p className="kids-book__hint kids-book__hint--soft">
            Press any key or tap for the next page
          </p>
        )}
      </button>

      {/* Progress bar so kids see how far they are in the story */}
      <div className="kids-book__progress" aria-hidden>
        <div className="kids-book__progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <footer className="kids-book__footer">
        <p>A neuroscience story for curious kids</p>
      </footer>
    </div>
  );
}
