"use client";

/**
 * Public bookshelf — Wonder look (same CSS classes), static catalog only.
 * No local EPUB sync, no Apple Books, no PDF reader.
 * Card = cover + title (+ author). Read → Amazon / source link.
 */
import { useMemo, useState } from "react";
import {
  bookshelfEntries,
  BOOKSHELF_KIND_LABEL,
  type BookshelfEntry,
  type BookshelfKind,
} from "@/data/bookshelf";
import { amazonSearchUrl } from "./amazon";
import "./books-library.css";

type Filter = "all" | BookshelfKind | "faves";

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "podcast", label: "Podcasts" },
  { id: "paper", label: "Papers" },
  { id: "blog", label: "Blogs" },
  { id: "faves", label: "Faves" },
];

function openLibraryCover(title: string, author: string): string {
  // Prefer title search; Open Library is fine for public cover art only
  const q = encodeURIComponent(`${title} ${author}`.trim());
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
}

function storeUrl(entry: BookshelfEntry): string {
  if (entry.href) return entry.href;
  if (entry.kind === "book") {
    return amazonSearchUrl(entry.title, entry.source);
  }
  return entry.href || "#";
}

function Cover({ entry }: { entry: BookshelfEntry }) {
  const [failed, setFailed] = useState(false);
  const letter = (entry.title.trim()[0] || "?").toUpperCase();

  // Blogs / papers / podcasts: letter spine is fine if no cover
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
      src={openLibraryCover(entry.title, entry.source)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Card({ entry }: { entry: BookshelfEntry }) {
  const href = storeUrl(entry);
  const cta =
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
      </div>
      {href && href !== "#" ? (
        <a
          className="bl-card-continue"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cta}
        </a>
      ) : null}
    </div>
  );
}

export function PublicBookshelf() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");

  const counts = useMemo(() => {
    const base = {
      all: bookshelfEntries.length,
      book: 0,
      paper: 0,
      blog: 0,
      podcast: 0,
      faves: 0,
    };
    for (const e of bookshelfEntries) {
      base[e.kind] += 1;
      if (e.favorite) base.faves += 1;
    }
    return base;
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return bookshelfEntries
      .filter((e) => {
        if (filter === "faves") return Boolean(e.favorite);
        if (filter !== "all" && e.kind !== filter) return false;
        if (!query) return true;
        return (
          e.title.toLowerCase().includes(query) ||
          e.source.toLowerCase().includes(query) ||
          (e.summary || "").toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const af = a.favorite ? 1 : 0;
        const bf = b.favorite ? 1 : 0;
        if (bf !== af) return bf - af;
        return b.loggedAt.localeCompare(a.loggedAt);
      });
  }, [filter, q]);

  const chipCount = (id: Filter) => {
    if (id === "all") return counts.all;
    if (id === "faves") return counts.faves;
    return counts[id];
  };

  return (
    <div className="bl-public-wrap">
      <div className="bl" data-books-theme="light">
        <header className="bl-head">
          <div className="bl-head-main">
            <div className="bl-head-copy">
              <h1 className="bl-title">Bookshelf</h1>
              <div className="bl-stats" aria-label="Catalog totals">
                <span>
                  <b>{counts.book}</b> books
                </span>
                <span>
                  <b>{counts.blog}</b> blogs
                </span>
                <span>
                  <b>{counts.faves}</b> faves
                </span>
              </div>
            </div>
            {/* No sync / import / add — static public catalog only */}
          </div>
        </header>

        <div className="bl-filter" aria-label="Sections">
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

        <div className="bl-toolbar">
          <form className="bl-search-wrap" onSubmit={(e) => e.preventDefault()}>
            <span className="bl-public-search-icon" aria-hidden>
              ⌕
            </span>
            <input
              className="bl-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles or authors"
              aria-label="Search bookshelf"
            />
          </form>
        </div>

        {filtered.length === 0 ? (
          <p className="bl-empty-all">
            {q ? "No matches." : "Nothing in this section yet."}
          </p>
        ) : (
          <div className="bl-grid">
            {filtered.map((entry) => (
              <Card key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
