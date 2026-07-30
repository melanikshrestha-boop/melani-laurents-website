"use client";

/**
 * Wonder Bookshelf UI (folders + cover grid) for the public site.
 * Static catalog only — no sync, no detail page.
 * Click / Buy on Amazon → store link.
 */
import { useMemo, useState, type CSSProperties } from "react";
import { CaretRight, FolderSimple, MagnifyingGlass } from "@phosphor-icons/react";
import {
  bookshelfEntries,
  type BookshelfEntry,
  type BookshelfKind,
} from "@/data/bookshelf";
import {
  CATEGORY_ORDER,
  SPINE_COLORS,
  categorizeBook,
  type Book,
} from "./booksStore";
import { amazonSearchUrl } from "./amazon";
import { catalogEntryToBook } from "./publicCatalog";
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

function coverUrlFor(title: string): string {
  return `https://covers.openlibrary.org/b/title/${encodeURIComponent(title)}-L.jpg?default=false`;
}

function buyUrl(entry: BookshelfEntry, book: Book): string {
  if (entry.kind === "book") {
    return book.externalUrl || entry.href || amazonSearchUrl(entry.title, entry.source);
  }
  return entry.href || book.externalUrl || "#";
}

function buyLabel(kind: BookshelfKind): string {
  if (kind === "book") return "Buy on Amazon";
  if (kind === "paper") return "Read paper";
  if (kind === "blog") return "Open essay";
  return "Listen";
}

function folderLabelFor(entry: BookshelfEntry): string {
  if (entry.kind === "blog") return "Blogs";
  if (entry.kind === "paper") return "Papers";
  if (entry.kind === "podcast") return "Podcasts";
  return String(categorizeBook(entry.title, entry.source));
}

type ShelfItem = { entry: BookshelfEntry; book: Book };

type ShelfGroup = {
  id: string;
  label: string;
  accent: string;
  items: ShelfItem[];
};

function BookCover({
  book,
  folderLabel,
}: {
  book: Book;
  folderLabel: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const style: CSSProperties = {
    backgroundColor: book.color || "#6b6358",
    backgroundImage:
      "linear-gradient(165deg, rgba(255,255,255,.14), transparent 42%), linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.58))",
  };
  const showImg = Boolean(book.coverUrl) && !imgFailed;

  return (
    <div className="bl-card-cover" style={style}>
      <span className="bl-cover-fallback" aria-hidden>
        <small>{book.author || folderLabel || book.category}</small>
        <strong>{book.title || "Untitled"}</strong>
      </span>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverUrl}
          alt=""
          className="bl-cover-image"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : null}
    </div>
  );
}

function CatalogCard({
  item,
  folderLabel,
}: {
  item: ShelfItem;
  folderLabel: string;
}) {
  const { entry, book } = item;
  const href = buyUrl(entry, book);
  const label = buyLabel(entry.kind);

  return (
    <div className="bl-card-wrap">
      {/* Cover + title only — whole card opens store link. No Buy button. */}
      <a
        className="bl-card pb-card-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        title={label}
      >
        <BookCover book={book} folderLabel={folderLabel} />
        <span className="bl-card-title">{book.title}</span>
        {book.author ? (
          <span className="bl-card-author">{book.author}</span>
        ) : null}
      </a>
    </div>
  );
}

export function PublicBookshelf() {
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  /** Wonder default: folders open unless explicitly closed */
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const catalog = useMemo<ShelfItem[]>(() => {
    return bookshelfEntries.map((entry, i) => {
      const book = catalogEntryToBook(entry);
      // Spine color + Open Library cover (art only — not a file sync)
      book.color = SPINE_COLORS[i % SPINE_COLORS.length];
      if (entry.kind === "book") {
        book.coverUrl = coverUrlFor(entry.title);
      }
      book.category = folderLabelFor(entry) as Book["category"];
      return { entry, book };
    });
  }, []);

  const counts = useMemo(() => {
    const c = {
      all: catalog.length,
      book: 0,
      paper: 0,
      blog: 0,
      podcast: 0,
      faves: 0,
    };
    for (const { entry } of catalog) {
      c[entry.kind] += 1;
      if (entry.favorite) c.faves += 1;
    }
    return c;
  }, [catalog]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter(({ entry }) => {
      if (filter === "faves" && !entry.favorite) return false;
      if (filter !== "all" && filter !== "faves" && entry.kind !== filter) {
        return false;
      }
      if (!query) return true;
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.source.toLowerCase().includes(query)
      );
    });
  }, [catalog, filter, q]);

  const groups = useMemo<ShelfGroup[]>(() => {
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
        ? [
            {
              id: "blogs",
              label: "Blogs",
              accent: FOLDER_ACCENT.Blogs,
              items: filtered,
            },
          ]
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

    // Books / All — Wonder-style subject folders
    const map = new Map<string, ShelfItem[]>();
    for (const item of filtered) {
      const label = folderLabelFor(item.entry);
      const list = map.get(label) || [];
      list.push(item);
      map.set(label, list);
    }

    const order = [...CATEGORY_ORDER, "Blogs", "Papers", "Podcasts"];
    const out: ShelfGroup[] = [];
    for (const label of order) {
      const items = map.get(label);
      if (!items?.length) continue;
      out.push({
        id: label,
        label,
        accent: FOLDER_ACCENT[label] || FOLDER_ACCENT.Unsorted,
        items,
      });
      map.delete(label);
    }
    for (const [label, items] of map) {
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

  /** Wonder: expanded unless explicitly false; search forces open */
  const isExpanded = (id: string) =>
    openFolders[id] !== false || Boolean(q.trim());

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
            <MagnifyingGlass size={15} aria-hidden />
            <input
              className="bl-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles or authors"
              aria-label="Search"
            />
          </form>
        </div>

        {groups.length === 0 ? (
          <p className="bl-empty-all">
            {q ? "No matches." : "Nothing in this section yet."}
          </p>
        ) : (
          groups.map((group) => {
            const expanded = isExpanded(group.id);
            return (
              <section
                key={group.id}
                className={`bl-shelf${expanded ? " is-open" : ""}`}
                style={
                  {
                    "--bl-folder-accent": group.accent,
                    "--bl-folder-wash": `${group.accent}18`,
                  } as CSSProperties
                }
              >
                {/* Exact Wonder folder row */}
                <div className="bl-folder-row">
                  <button
                    type="button"
                    className="bl-folder"
                    aria-expanded={expanded}
                    onClick={() =>
                      setOpenFolders((current) => ({
                        ...current,
                        // Wonder toggle: false means closed; missing/true = open
                        [group.id]: current[group.id] === false,
                      }))
                    }
                  >
                    <CaretRight
                      className="bl-folder-caret"
                      size={14}
                      aria-hidden
                    />
                    <FolderSimple
                      className="bl-folder-icon"
                      size={22}
                      weight="fill"
                      aria-hidden
                      style={{ color: group.accent, fill: group.accent }}
                    />
                    <span className="bl-folder-copy">
                      <strong>{group.label}</strong>
                      <small>
                        {group.items.length}{" "}
                        {group.items.length === 1 ? "book" : "books"}
                      </small>
                    </span>
                  </button>
                </div>

                {expanded ? (
                  <div className="bl-grid">
                    {group.items.map((item) => (
                      <CatalogCard
                        key={item.entry.id}
                        item={item}
                        folderLabel={group.label}
                      />
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
