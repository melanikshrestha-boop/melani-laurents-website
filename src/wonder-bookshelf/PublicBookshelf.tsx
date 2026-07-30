"use client";

/**
 * Public bookshelf — Wonder shelf look, static catalog only.
 * - Organized in folders (Business & Money, Autobiography, …)
 * - Cover + title only
 * - Click / Buy on Amazon → store link (affiliate-ready later)
 * - No detail page, no sync, no “Read here”, no device library
 */
import { useMemo, useState, type CSSProperties } from "react";
import {
  bookshelfEntries,
  BOOKSHELF_KIND_LABEL,
  type BookshelfEntry,
  type BookshelfKind,
} from "@/data/bookshelf";
import {
  CATEGORY_ORDER,
  categorizeBook,
  type BuiltInBookCategory,
} from "./booksStore";
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

const FOLDER_ACCENT: Record<string, string> = {
  "Autobiography & Memoir": "#c97b84",
  "Physics & Science": "#4faf8c",
  "Literature & Fiction": "#9b7fd4",
  "Technology & Innovation": "#5b9fd4",
  "Business & Money": "#d4a84b",
  "Psychology & Self-Development": "#72b9d6",
  "Philosophy & Spirituality": "#b89adc",
  "Music & Culture": "#e58fa3",
  Unsorted: "#8e98a6",
  Blogs: "#d6b367",
  Papers: "#65c5a6",
  Podcasts: "#7eb8ff",
  Faves: "#d4bc82",
};

function openLibraryCover(title: string): string {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
}

function buyUrl(entry: BookshelfEntry): string {
  if (entry.kind === "book") {
    return entry.href || amazonSearchUrl(entry.title, entry.source);
  }
  return entry.href || "#";
}

function buyLabel(entry: BookshelfEntry): string {
  if (entry.kind === "book") return "Buy on Amazon";
  if (entry.kind === "paper") return "Read paper";
  if (entry.kind === "blog") return "Open essay";
  return "Listen";
}

function folderFor(entry: BookshelfEntry): string {
  if (entry.kind === "blog") return "Blogs";
  if (entry.kind === "paper") return "Papers";
  if (entry.kind === "podcast") return "Podcasts";
  const cat = categorizeBook(entry.title, entry.source);
  return typeof cat === "string" ? cat : "Unsorted";
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

function CatalogCard({ entry }: { entry: BookshelfEntry }) {
  const href = buyUrl(entry);
  const label = buyLabel(entry);

  return (
    <div className="bl-card-wrap pb-card">
      {/* Whole card is the buy/open link — no detail page */}
      <a
        className="bl-card pb-card-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
      >
        <div className="bl-card-cover">
          <Cover entry={entry} />
        </div>
        <span className="bl-card-title">{entry.title}</span>
        {entry.source ? (
          <span className="bl-card-author">{entry.source}</span>
        ) : null}
      </a>
      <a
        className="bl-card-continue pb-buy"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    </div>
  );
}

type Shelf = { id: string; label: string; accent: string; items: BookshelfEntry[] };

export function PublicBookshelf() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

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
    return bookshelfEntries.filter((e) => {
      if (filter === "faves" && !e.favorite) return false;
      if (filter !== "all" && filter !== "faves" && e.kind !== filter) return false;
      if (!query) return true;
      return (
        e.title.toLowerCase().includes(query) ||
        e.source.toLowerCase().includes(query)
      );
    });
  }, [filter, q]);

  const shelves = useMemo<Shelf[]>(() => {
    if (filter === "faves") {
      return filtered.length
        ? [
            {
              id: "faves",
              label: "Faves",
              accent: FOLDER_ACCENT.Faves,
              items: filtered,
            },
          ]
        : [];
    }
    if (filter === "blog") {
      return filtered.length
        ? [{ id: "blogs", label: "Blogs", accent: FOLDER_ACCENT.Blogs, items: filtered }]
        : [];
    }
    if (filter === "paper") {
      return filtered.length
        ? [
            {
              id: "papers",
              label: "Papers",
              accent: FOLDER_ACCENT.Papers,
              items: filtered,
            },
          ]
        : [];
    }
    if (filter === "podcast") {
      return filtered.length
        ? [
            {
              id: "podcasts",
              label: "Podcasts",
              accent: FOLDER_ACCENT.Podcasts,
              items: filtered,
            },
          ]
        : [];
    }

    // Books / All — foldered like Wonder (Business & Money, Autobiography, …)
    const byFolder = new Map<string, BookshelfEntry[]>();
    for (const e of filtered) {
      const folder = folderFor(e);
      const list = byFolder.get(folder) || [];
      list.push(e);
      byFolder.set(folder, list);
    }

    const order: string[] = [
      ...CATEGORY_ORDER,
      "Blogs",
      "Papers",
      "Podcasts",
    ];

    const out: Shelf[] = [];
    for (const label of order) {
      const items = byFolder.get(label);
      if (!items?.length) continue;
      out.push({
        id: label,
        label,
        accent: FOLDER_ACCENT[label] || FOLDER_ACCENT.Unsorted,
        items,
      });
      byFolder.delete(label);
    }
    // any leftover folders
    for (const [label, items] of byFolder) {
      if (!items.length) continue;
      out.push({
        id: label,
        label,
        accent: FOLDER_ACCENT[label] || FOLDER_ACCENT.Unsorted,
        items,
      });
    }
    return out;
  }, [filtered, filter]);

  const chipCount = (id: Filter) => {
    if (id === "all") return counts.all;
    if (id === "faves") return counts.faves;
    return counts[id];
  };

  const isOpen = (id: string) => openFolders[id] !== false;

  return (
    <div className="bl-public-wrap pb-root">
      <div className="bl" data-books-theme="light">
        <header className="bl-head">
          <div className="bl-head-main">
            <div className="bl-head-copy">
              <h1 className="bl-title">Bookshelf</h1>
              <div className="bl-stats" aria-label="Catalog">
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
              aria-label="Search"
            />
          </form>
        </div>

        {shelves.length === 0 ? (
          <p className="bl-empty-all">
            {q ? "No matches." : "Nothing in this section yet."}
          </p>
        ) : (
          shelves.map((shelf) => {
            const open = isOpen(shelf.id);
            return (
              <section
                key={shelf.id}
                className={`bl-shelf${open ? " is-open" : ""}`}
                style={
                  {
                    "--bl-folder-accent": shelf.accent,
                    "--bl-folder-wash": `${shelf.accent}18`,
                  } as CSSProperties
                }
              >
                <div className="bl-folder-row">
                  <button
                    type="button"
                    className="bl-folder"
                    aria-expanded={open}
                    onClick={() =>
                      setOpenFolders((cur) => ({
                        ...cur,
                        [shelf.id]: !open,
                      }))
                    }
                  >
                    <span className="bl-folder-caret" aria-hidden>
                      ▸
                    </span>
                    <span
                      className="bl-folder-icon"
                      aria-hidden
                      style={{ color: shelf.accent }}
                    >
                      ▦
                    </span>
                    <span className="bl-folder-copy">
                      <strong>{shelf.label}</strong>
                      <small>
                        {shelf.items.length}{" "}
                        {shelf.items.length === 1 ? "title" : "titles"}
                      </small>
                    </span>
                  </button>
                </div>
                {open ? (
                  <div className="bl-grid">
                    {shelf.items.map((entry) => (
                      <CatalogCard key={entry.id} entry={entry} />
                    ))}
                  </div>
                ) : null}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}
