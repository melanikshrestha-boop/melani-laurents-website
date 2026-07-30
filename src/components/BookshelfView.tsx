"use client";

/**
 * Public Bookshelf — Wonder Library UI (same classes/CSS), without PDF/EPUB reader.
 * "Read" opens the store / source link (Amazon for physical books).
 */
import { useMemo, useState } from "react";
import {
  BOOKSHELF_KIND_LABEL,
  type BookshelfEntry,
  type BookshelfKind,
  countByKind,
  getFavorites,
} from "@/data/bookshelf";
import { siteConfig } from "@/config/site";
import "@/styles/wonder-bookshelf.css";

type Filter = "all" | BookshelfKind | "faves";

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "paper", label: "Papers" },
  { id: "blog", label: "Blogs" },
  { id: "podcast", label: "Podcasts" },
  { id: "faves", label: "Faves" },
];

function openLibraryCover(title: string): string {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
}

function Cover({ entry }: { entry: BookshelfEntry }) {
  const [failed, setFailed] = useState(false);
  const letter = (entry.title.trim()[0] || "?").toUpperCase();

  if (failed || entry.kind !== "book") {
    return (
      <div className="bl-cover-fallback" aria-hidden>
        <small>{BOOKSHELF_KIND_LABEL[entry.kind]}</small>
        <strong>{letter}</strong>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="bl-cover-image"
      src={openLibraryCover(entry.title)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PublicBookCard({ entry }: { entry: BookshelfEntry }) {
  const readHref = entry.href;
  const readLabel =
    entry.kind === "book"
      ? "Read"
      : entry.kind === "paper"
        ? "Paper"
        : entry.kind === "blog"
          ? "Open"
          : "Listen";

  return (
    <div className="bl-card-wrap">
      <div className="bl-card" title={entry.title}>
        <div className="bl-card-cover">
          <Cover entry={entry} />
        </div>
        <span className="bl-card-title">{entry.title}</span>
        {entry.source ? (
          <span className="bl-card-author">{entry.source}</span>
        ) : null}
        <span className="bl-card-meta">
          <span>{BOOKSHELF_KIND_LABEL[entry.kind]}</span>
          {entry.favorite ? <span>fave</span> : null}
        </span>
      </div>
      {readHref ? (
        <a
          className="bl-card-continue"
          href={readHref}
          target="_blank"
          rel="noopener noreferrer"
          /* Physical books → Amazon (etc). No PDF / no Wonder library sync. */
        >
          {readLabel}
        </a>
      ) : null}
    </div>
  );
}

export function BookshelfView({ entries }: { entries: BookshelfEntry[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = useMemo(() => countByKind(entries), [entries]);
  const faves = useMemo(() => getFavorites(), []);

  // Personal insight shelf — no search (not a store catalog)
  const filtered = useMemo(() => {
    if (filter === "faves") return entries.filter((e) => e.favorite);
    if (filter === "all") return entries;
    return entries.filter((e) => e.kind === filter);
  }, [entries, filter]);

  const chipCount = (id: Filter) => {
    if (id === "all") return entries.length;
    if (id === "faves") return faves.length;
    return counts[id] ?? 0;
  };

  return (
    <div className="bl-public-wrap">
      <div className="bl" data-books-theme="light" data-books-font="serif">
        <header className="bl-head">
          <div className="bl-head-main">
            <div className="bl-head-copy">
              <h1 className="bl-title">Bookshelf</h1>
              <div className="bl-stats" aria-label="Library totals">
                <span>
                  <b>{entries.length}</b> titles
                </span>
                <span>
                  <b>{counts.book ?? 0}</b> books
                </span>
                <span>
                  <b>{counts.paper ?? 0}</b> papers
                </span>
                <span>
                  <b>{faves.length}</b> faves
                </span>
              </div>
              <p className="bl-public-manifesto">
                {siteConfig.bookshelfDescription}
              </p>
            </div>
          </div>
        </header>

        {faves.length > 0 && filter === "all" ? (
          <section className="bl-public-faves" aria-labelledby="public-faves">
            <h2 id="public-faves" className="bl-shelf-h">
              Faves <em>{faves.length}</em>
            </h2>
            <ul className="bl-public-faves-list">
              {faves.map((entry) => (
                <li key={entry.id}>
                  <strong>{entry.title}</strong>
                  <span className="bl-public-faves-src">{entry.source}</span>
                  {entry.favoriteWhy ? (
                    <p>
                      <em>Why · </em>
                      {entry.favoriteWhy}
                    </p>
                  ) : null}
                  {entry.href ? (
                    <a
                      href={entry.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bl-link-quiet"
                    >
                      {entry.kind === "book" ? "Read ↗" : "Open ↗"}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="bl-filter" aria-label="Library sections">
          {CHIPS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`bl-chip${filter === id ? " is-on" : ""}`}
              onClick={() => setFilter(id)}
            >
              <span>{label}</span>
              <em>{chipCount(id)}</em>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="bl-empty-all">Nothing on this shelf yet.</p>
        ) : (
          <div className="bl-grid bl-public-grid">
            {filtered.map((entry) => (
              <PublicBookCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
