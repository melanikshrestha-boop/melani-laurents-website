"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { kidsNeuroStory } from "@/data/kids-neuro-story";
import { NeuralAmbient } from "./NeuralAmbient";
import { PageScene } from "./PageScenes";
import { useStorySounds } from "./useStorySounds";

/**
 * Full interactive neuroscience storybook for kids.
 * Any keyboard key (or tap) turns the page.
 * Features: 3D flip, custom SVG scenes, neural background, sounds, line reveals.
 */
export function NeuroKidsBook() {
  const [pageIndex, setPageIndex] = useState(0); // which story page
  const [phase, setPhase] = useState<"idle" | "flipping" | "enter">("enter"); // animation phase
  const [lineVisible, setLineVisible] = useState(0); // how many story lines are shown
  const [lastKey, setLastKey] = useState<string | null>(null); // show the key she pressed
  const [started, setStarted] = useState(false); // after first interaction
  const flipLockRef = useRef(false); // block double turns
  const { playPageTurn, playLinePop } = useStorySounds();

  const total = kidsNeuroStory.length;
  const page = kidsNeuroStory[pageIndex];
  const progress = ((pageIndex + 1) / total) * 100;

  // Reveal story lines one at a time so reading feels alive
  useEffect(() => {
    setLineVisible(0); // reset when page changes
    if (phase === "flipping") return;

    const timers: number[] = [];
    page.lines.forEach((_, i) => {
      const t = window.setTimeout(() => {
        setLineVisible(i + 1);
        if (i > 0) playLinePop(); // soft pop for each new line (not the first)
      }, 280 + i * 420);
      timers.push(t);
    });

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [pageIndex, page.lines, phase, playLinePop]);

  // First mount entrance
  useEffect(() => {
    const t = window.setTimeout(() => setPhase("idle"), 600);
    return () => window.clearTimeout(t);
  }, []);

  // Turn to the next page (or restart)
  const turnPage = useCallback(
    (keyLabel?: string) => {
      if (flipLockRef.current) return;
      flipLockRef.current = true;
      setStarted(true);
      if (keyLabel) setLastKey(keyLabel);

      playPageTurn();
      setPhase("flipping");

      // Mid-flip: swap content
      window.setTimeout(() => {
        setPageIndex((current) => {
          const next = current + 1;
          return next >= total ? 0 : next;
        });
        setPhase("enter");
      }, 320);

      // Settle into idle after enter animation
      window.setTimeout(() => {
        setPhase("idle");
        flipLockRef.current = false;
      }, 700);
    },
    [playPageTurn, total],
  );

  // ANY keyboard key turns the page
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Shift" || event.key === "CapsLock" || event.key === "Tab") return;

      // Stop browser scroll / default for navigation keys
      if (
        event.key === " " ||
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Enter"
      ) {
        event.preventDefault();
      }

      // Friendly label for the floating key badge
      let label = event.key;
      if (event.key === " ") label = "SPACE";
      else if (event.key === "ArrowRight") label = "→";
      else if (event.key === "ArrowLeft") label = "←";
      else if (event.key === "Enter") label = "ENTER";
      else if (event.key.length === 1) label = event.key.toUpperCase();
      else label = event.key;

      turnPage(label);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [turnPage]);

  // Clear key badge after a moment
  useEffect(() => {
    if (!lastKey) return;
    const t = window.setTimeout(() => setLastKey(null), 900);
    return () => window.clearTimeout(t);
  }, [lastKey, pageIndex]);

  return (
    <div
      className={[
        "kids-book",
        page.night ? "kids-book--night" : "",
        `kids-book--${phase}`,
        started ? "kids-book--started" : "kids-book--fresh",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          ["--kids-from" as string]: page.bgFrom,
          ["--kids-to" as string]: page.bgTo,
          ["--kids-accent" as string]: page.accent,
          ["--kids-ink" as string]: page.ink,
        } as CSSProperties
      }
    >
      {/* Living neural network behind everything */}
      <NeuralAmbient accent={page.accent} ink={page.ink} />

      {/* Soft color wash that changes every chapter */}
      <div className="kids-book__wash" aria-hidden />

      {/* Floating key she just pressed */}
      {lastKey ? (
        <div className="kids-book__key-burst" aria-hidden>
          <span>{lastKey}</span>
        </div>
      ) : null}

      <header className="kids-book__chrome">
        <div className="kids-book__brand-block">
          <p className="kids-book__brand">Melani’s Brain Book</p>
          <p className="kids-book__subtitle">Neuroscience for curious kids</p>
        </div>
        <div className="kids-book__chrome-right">
          <p className="kids-book__chapter-tag">{page.chapter}</p>
          <p className="kids-book__counter" aria-live="polite">
            {pageIndex + 1} / {total}
          </p>
        </div>
      </header>

      {/* Progress dots for every page */}
      <nav className="kids-book__dots" aria-label="Story progress">
        {kidsNeuroStory.map((p, i) => (
          <span
            key={p.id}
            className={`kids-book__dot ${i === pageIndex ? "is-active" : ""} ${i < pageIndex ? "is-done" : ""}`}
          />
        ))}
      </nav>

      {/* 3D book stage — tap anywhere on the book to turn */}
      <div
        className="kids-book__stage"
        role="button"
        tabIndex={0}
        onClick={() => turnPage("TAP")}
        onKeyDown={(e) => {
          // Keep accessibility without double-firing global listener badly
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
          }
        }}
        aria-label={`${page.title}. Press any keyboard key or tap to turn the page.`}
      >
        <div className="kids-book__book">
          {/* Spine shadow */}
          <div className="kids-book__spine" aria-hidden />

          {/* LEFT page — illustration */}
          <div className="kids-book__leaf kids-book__leaf--left">
            <div className="kids-book__leaf-inner">
              <PageScene scene={page.scene} accent={page.accent} night={page.night} />
              <p className="kids-book__art-caption">Look · listen · wonder</p>
            </div>
          </div>

          {/* RIGHT page — story words */}
          <div className="kids-book__leaf kids-book__leaf--right">
            <div className="kids-book__leaf-inner">
              <p className="kids-book__kicker">{page.chapter}</p>
              <h1 className="kids-book__title">{page.title}</h1>

              <div className="kids-book__lines">
                {page.lines.map((line, i) => (
                  <p
                    key={`${page.id}-${i}`}
                    className={`kids-book__line ${i < lineVisible ? "is-show" : ""}`}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <div className="kids-book__fact">
                <span className="kids-book__fact-label">{page.factTitle}</span>
                <p>{page.fact}</p>
              </div>
            </div>
          </div>

          {/* Flipping page overlay for 3D turn feel */}
          <div className="kids-book__flipper" aria-hidden>
            <div className="kids-book__flipper-face kids-book__flipper-face--front" />
            <div className="kids-book__flipper-face kids-book__flipper-face--back" />
          </div>
        </div>
      </div>

      {/* Bottom progress + hint */}
      <div className="kids-book__bottom">
        <div className="kids-book__progress" aria-hidden>
          <div className="kids-book__progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className={`kids-book__hint ${started ? "is-soft" : "is-pulse"}`}>
          {started
            ? "Press any key — or tap the book — for the next page"
            : "Press ANY key on the keyboard to open the next page ✨"}
        </p>
      </div>
    </div>
  );
}
