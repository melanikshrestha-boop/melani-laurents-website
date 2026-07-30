"use client";

import { useMemo, useState } from "react";
import {
  BOOKSHELF_KIND_LABEL,
  type BookshelfEntry,
  type BookshelfKind,
  countByKind,
} from "@/data/bookshelf";

type Filter = "all" | BookshelfKind;

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Physical books" },
  { id: "paper", label: "Research papers" },
  { id: "blog", label: "Blogs" },
  { id: "podcast", label: "Podcasts" },
];

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function outboundLabel(kind: BookshelfKind): string {
  if (kind === "book") return "Get the book ↗";
  if (kind === "paper") return "Read paper ↗";
  if (kind === "blog") return "Read ↗";
  return "Listen ↗";
}

export function BookshelfView({ entries }: { entries: BookshelfEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = useMemo(() => countByKind(entries), [entries]);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => e.kind === filter);
  }, [entries, filter]);

  return (
    <div className="bookshelf">
      <header className="bookshelf__masthead">
        <p className="bookshelf__kicker">Bookshelf</p>
        <h1 className="bookshelf__title">What I read, hear, and keep.</h1>
        <p className="bookshelf__lede">
          Research papers, physical books, blogs, and podcasts — with notes on
          what I took, and how I applied it.
        </p>
      </header>

      {/* Wonder-style filter chips */}
      <div className="bookshelf__chips" role="tablist" aria-label="Filter shelf">
        {CHIPS.map((chip) => {
          const n =
            chip.id === "all"
              ? entries.length
              : counts[chip.id as BookshelfKind] ?? 0;
          const active = filter === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`bookshelf__chip${active ? " is-active" : ""}`}
              onClick={() => setFilter(chip.id)}
            >
              {chip.label}
              <span className="bookshelf__chip-count">{n}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="bookshelf__empty">Nothing on this shelf yet.</p>
      ) : (
        <ul className="bookshelf__list">
          {filtered.map((entry) => (
            <li key={entry.id} className="bookshelf__item">
              <div className="bookshelf__item-top">
                <span className="bookshelf__kind">
                  {BOOKSHELF_KIND_LABEL[entry.kind]}
                </span>
                <time dateTime={entry.loggedAt}>{formatDate(entry.loggedAt)}</time>
              </div>

              <h2 className="bookshelf__item-title">{entry.title}</h2>
              <p className="bookshelf__item-source">
                {entry.source}
                {entry.year ? ` · ${entry.year}` : null}
              </p>

              {entry.summary ? (
                <p className="bookshelf__item-summary">{entry.summary}</p>
              ) : null}

              {entry.thoughts ? (
                <div className="bookshelf__note">
                  <span className="bookshelf__note-label">Thoughts</span>
                  <p>{entry.thoughts}</p>
                </div>
              ) : null}

              {entry.applied ? (
                <div className="bookshelf__note">
                  <span className="bookshelf__note-label">Applied</span>
                  <p>{entry.applied}</p>
                </div>
              ) : null}

              {entry.href ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bookshelf__out"
                >
                  {outboundLabel(entry.kind)}
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
