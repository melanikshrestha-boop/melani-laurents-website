"use client";

import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import {
  BOOKSHELF_KIND_LABEL,
  type BookshelfEntry,
  type BookshelfKind,
  countByKind,
  getFavorites,
} from "@/data/bookshelf";

type Filter = "all" | BookshelfKind;

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "paper", label: "Papers" },
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
  if (kind === "book") return "Book ↗";
  if (kind === "paper") return "Paper ↗";
  if (kind === "blog") return "Link ↗";
  return "Listen ↗";
}

export function BookshelfView({ entries }: { entries: BookshelfEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = useMemo(() => countByKind(entries), [entries]);
  const faves = useMemo(() => getFavorites(), []);

  const filtered = useMemo(() => {
    if (filter === "all") return entries;
    return entries.filter((e) => e.kind === filter);
  }, [entries, filter]);

  return (
    <div className="bookshelf">
      <header className="bookshelf__masthead">
        <p className="bookshelf__kicker">Bookshelf</p>
        <p className="bookshelf__manifesto">{siteConfig.bookshelfDescription}</p>
      </header>

      {faves.length > 0 ? (
        <section className="bookshelf__faves" aria-labelledby="bookshelf-faves">
          <h2 id="bookshelf-faves" className="bookshelf__section-label">
            Faves
          </h2>
          <ul className="bookshelf__faves-list">
            {faves.map((entry) => (
              <li key={entry.id} className="bookshelf__fave">
                <div className="bookshelf__fave-head">
                  <span className="bookshelf__kind">
                    {BOOKSHELF_KIND_LABEL[entry.kind]}
                  </span>
                  <strong className="bookshelf__fave-title">{entry.title}</strong>
                  <span className="bookshelf__fave-source">{entry.source}</span>
                </div>
                {entry.favoriteWhy ? (
                  <p className="bookshelf__fave-why">
                    <span className="bookshelf__note-label">Why</span>
                    {entry.favoriteWhy}
                  </p>
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
        </section>
      ) : null}

      <div className="bookshelf__chips" role="tablist" aria-label="Filter">
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
        <p className="bookshelf__empty">Empty.</p>
      ) : (
        <ul className="bookshelf__list">
          {filtered.map((entry) => (
            <li key={entry.id} className="bookshelf__item">
              <div className="bookshelf__item-top">
                <span className="bookshelf__kind">
                  {BOOKSHELF_KIND_LABEL[entry.kind]}
                  {entry.favorite ? " · fave" : ""}
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
              {entry.applied ? (
                <p className="bookshelf__item-applied">
                  <span className="bookshelf__note-label">Applied</span>
                  {entry.applied}
                </p>
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
