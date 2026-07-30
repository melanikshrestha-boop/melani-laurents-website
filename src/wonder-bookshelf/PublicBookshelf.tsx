"use client";

/**
 * Public Bookshelf — insight into what Melani reads.
 * Static catalog, folders, faves. Covers link out for the curious;
 * this is not a storefront.
 */
import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowClockwise,
  ArrowSquareOut,
  CaretRight,
  FolderSimple,
} from "@phosphor-icons/react";
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
import { coverUrlForBook, storeUrlForBook } from "./amazon";
import { catalogEntryToBook } from "./publicCatalog";
import { GREATS_AUTHORS } from "./greatsBlogs";
import "./books-library.css";

/** Public chips only — no empty Papers/Podcasts until real content exists */
type Filter = "all" | "book" | "blog" | "faves";

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "blog", label: "Blogs" },
  { id: "faves", label: "Faves" },
];

/** Quote rotator under the title — fun, not a library search chrome */
const SHELF_QUOTES: { text: string; author: string }[] = [
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work. And the only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    text: "When we are no longer able to change a situation, we are challenged to change ourselves.",
    author: "Viktor E. Frankl",
  },
  {
    text: "The people who are crazy enough to think they can change the world are the ones who do.",
    author: "Steve Jobs",
  },
  {
    text: "I wish I had a second life dedicated to just reading everything written out there.",
    author: "Melani Laurent",
  },
  {
    text: "Zero to one is about creating something new. Copying is one to n.",
    author: "Peter Thiel",
  },
];

/** Public folder order */
const PUBLIC_FOLDER_ORDER = [
  "main characters only",
  "everything startups",
  "psychology",
  "history",
  "uncategorized",
] as const;

const FOLDER_ACCENT: Record<string, string> = {
  "main characters only": "#c4a06a",
  "everything startups": "#5b9fd4",
  psychology: "#9b7fd4",
  history: "#c97b84",
  uncategorized: "#8e98a6",
  Conqueror: "#c45c4a",
  Entrepreneur: "#d4a84b",
  Genius: "#5b9fd4",
  "Autobiography & Memoir": "#c97b84",
  "Physics & Science": "#4faf8c",
  "Literature & Fiction": "#9b7fd4",
  "Technology & Innovation": "#5b9fd4",
  "Business & Money": "#d4a84b",
  "Psychology & Self-Development": "#72b9d6",
  "Philosophy & Spirituality": "#b89adc",
  "Music & Culture": "#e58fa3",
  Unsorted: "#8e98a6",
  Faves: "#d4bc82",
};

function buyUrl(entry: BookshelfEntry, book: Book): string {
  if (entry.kind === "book") {
    return storeUrlForBook({
      asin: entry.asin,
      href: entry.href || book.externalUrl,
      title: entry.title,
      author: entry.source,
    });
  }
  return entry.href || book.externalUrl || "#";
}

function openLabel(kind: BookshelfKind): string {
  if (kind === "book") return "Open book page";
  if (kind === "paper") return "Open paper";
  if (kind === "blog") return "Open essay";
  return "Open";
}

/** Subject folders for books. Never blogs. */
function folderLabelFor(entry: BookshelfEntry): string {
  // Explicit catalog folder
  if (entry.category?.trim()) return entry.category.trim();
  // Default public shelf — don't scatter into old subject bins
  return "main characters only";
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
  const showImg = Boolean(book.coverUrl) && !imgFailed;

  // Real product covers: clean image, no muddy gradient overlay
  // Amazon missing covers return a 1×1 GIF — treat those as failed.
  if (showImg) {
    return (
      <div className="bl-card-cover pb-cover-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={book.coverUrl}
          alt=""
          className="bl-cover-image"
          loading="lazy"
          onError={() => setImgFailed(true)}
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth < 40 || img.naturalHeight < 40) {
              setImgFailed(true);
            }
          }}
        />
      </div>
    );
  }

  const style: CSSProperties = {
    backgroundColor: book.color || "#6b6358",
    backgroundImage:
      "linear-gradient(165deg, rgba(255,255,255,.14), transparent 42%), linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.58))",
  };

  return (
    <div className="bl-card-cover" style={style}>
      <span className="bl-cover-fallback" aria-hidden>
        <small>{book.author || folderLabel || book.category}</small>
        <strong>{book.title || "Untitled"}</strong>
      </span>
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
  const label = openLabel(entry.kind);

  return (
    <div className="bl-card-wrap">
      {/* Cover + title — personal shelf; link is optional deeper look, not a cart */}
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
  /** Start closed — one tap/click toggles open or closed (no hover-only chrome) */
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [quoteIndex, setQuoteIndex] = useState(0);

  /** Books / papers / podcasts only — never fake blog "book" covers */
  const catalog = useMemo<ShelfItem[]>(() => {
    return bookshelfEntries
      .filter((entry) => entry.kind !== "blog")
      .map((entry, i) => {
        const book = catalogEntryToBook(entry);
        book.color = SPINE_COLORS[i % SPINE_COLORS.length];
        if (entry.kind === "book") {
          book.coverUrl = coverUrlForBook({
            asin: entry.asin,
            href: entry.href,
            title: entry.title,
            // Catalog coverUrl wins when Amazon serves the wrong face (back, blank…)
            coverUrl: entry.coverUrl,
          });
          book.externalUrl = storeUrlForBook({
            asin: entry.asin,
            href: entry.href,
            title: entry.title,
            author: entry.source,
          });
        }
        book.category = folderLabelFor(entry) as Book["category"];
        return { entry, book };
      });
  }, []);

  const blogPostCount = useMemo(
    () => GREATS_AUTHORS.reduce((n, a) => n + a.posts.length, 0),
    []
  );

  const counts = useMemo(() => {
    const c = {
      all: catalog.length + blogPostCount,
      book: 0,
      blog: blogPostCount,
      faves: 0,
    };
    for (const { entry } of catalog) {
      if (entry.kind === "book") c.book += 1;
      if (entry.favorite) c.faves += 1;
    }
    return c;
  }, [catalog, blogPostCount]);

  const filtered = useMemo(() => {
    return catalog.filter(({ entry }) => {
      if (filter === "faves" && !entry.favorite) return false;
      // blogs are not in the cover grid
      if (filter === "blog") return false;
      if (filter === "book" && entry.kind !== "book") return false;
      return true;
    });
  }, [catalog, filter]);

  /** Wonder: blogs are a link section below books — never a folder of covers */
  const showBlogs = filter === "all" || filter === "blog";

  const filteredGreats = useMemo(() => {
    if (!showBlogs) return [];
    return GREATS_AUTHORS;
  }, [showBlogs]);

  const groups = useMemo<ShelfGroup[]>(() => {
    // Blogs chip: only the greats link section (no book folders)
    if (filter === "blog") return [];

    // Faves: no folder chrome — rare picks shown as a flat cover grid
    if (filter === "faves") return [];

    // Books / All — subject folders only. Blogs are never folders (links below).
    const map = new Map<string, ShelfItem[]>();
    for (const item of filtered) {
      const label = folderLabelFor(item.entry);
      const list = map.get(label) || [];
      list.push(item);
      map.set(label, list);
    }

    const order = [...PUBLIC_FOLDER_ORDER, ...CATEGORY_ORDER];
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
    if (id === "blog") return GREATS_AUTHORS.length; // sources, like Wonder
    if (id === "book") return counts.book;
    return 0;
  };

  /** Closed by default; true only after a tap opens the drive */
  const isExpanded = (id: string) => openFolders[id] === true;

  const quote = SHELF_QUOTES[quoteIndex % SHELF_QUOTES.length];
  const quoteTotal = SHELF_QUOTES.length;

  return (
    <div className="bl-public-wrap pb-root">
      <div className="bl" data-books-theme="light">
        <header className="bl-head">
          <div className="bl-head-main">
            <div className="bl-head-copy">
              <h1 className="bl-title">Bookshelf</h1>
            </div>
          </div>
        </header>

        {/* Quote generator — rotate for fun, like a personal board */}
        <section className="pb-quote" aria-label="Shelf quote">
          <blockquote className="pb-quote__text">
            <p>“{quote.text}”</p>
            <cite className="pb-quote__author">{quote.author}</cite>
          </blockquote>
          <div className="pb-quote__controls">
            <button
              type="button"
              className="pb-quote__refresh"
              aria-label="Next quote"
              title="Next quote"
              onClick={() =>
                setQuoteIndex((i) => (i + 1) % SHELF_QUOTES.length)
              }
            >
              <ArrowClockwise size={16} weight="bold" aria-hidden />
            </button>
            <span className="pb-quote__index" aria-live="polite">
              {(quoteIndex % quoteTotal) + 1}/{quoteTotal}
            </span>
          </div>
        </section>

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

        {groups.length === 0 &&
        !(filter === "faves" && filtered.length > 0) &&
        !showBlogs ? (
          <p className="bl-empty-all">
            {filter === "faves"
              ? "Almost never a fave — when one sticks, it lands here."
              : "Nothing in this section yet."}
          </p>
        ) : null}

        {/* Faves: flat grid only — no nested folder toggle (they're already rare picks) */}
        {filter === "faves" && filtered.length > 0 ? (
          <section className="bl-shelf is-open pb-faves-flat" aria-label="Faves">
            <div className="bl-grid">
              {filtered.map((item) => (
                <CatalogCard
                  key={item.entry.id}
                  item={item}
                  folderLabel="Faves"
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Wonder drive UI (spacing/fonts) — public: no edit pencils; count is n = x */}
        {groups.length > 0 ? (
          <div className="pb-drives" role="list">
            {groups.map((group) => {
              const expanded = isExpanded(group.id);
              const n = group.items.length;
              return (
                <section
                  key={group.id}
                  role="listitem"
                  className={`bl-shelf pb-drive${expanded ? " is-open" : ""}`}
                  style={
                    {
                      "--bl-folder-accent": group.accent,
                      "--bl-folder-wash": `${group.accent}18`,
                    } as CSSProperties
                  }
                >
                  <div className="bl-folder-row">
                    <button
                      type="button"
                      className="bl-folder pb-drive-btn"
                      aria-expanded={expanded}
                      onClick={() =>
                        setOpenFolders((current) => ({
                          ...current,
                          [group.id]: !current[group.id],
                        }))
                      }
                    >
                      <FolderSimple
                        className="bl-folder-icon"
                        size={22}
                        weight="fill"
                        aria-hidden
                        style={{ color: group.accent, fill: group.accent }}
                      />
                      <span className="bl-folder-copy pb-drive-copy">
                        <strong>{group.label}</strong>
                        {/* Public count format: n = x (not “14 books”) */}
                        <small>n = {n}</small>
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
            })}
          </div>
        ) : null}

        {/* Wonder: blogs are links below books — not covers in a folder */}
        {showBlogs && filteredGreats.length > 0 ? (
          <section
            className={`bl-greats${filter === "all" ? " bl-greats-after-books" : ""}`}
            aria-label="Blogs and essays"
          >
            <div className="bl-greats-head">
              <div>
                <span>Writing worth returning to</span>
                <h2 className="bl-greats-h">Blogs &amp; essays</h2>
              </div>
              <small>
                {filteredGreats.length} source
                {filteredGreats.length === 1 ? "" : "s"}
              </small>
            </div>
            <div className="bl-greats-grid">
              {filteredGreats.map((author) => (
                <article
                  key={author.id}
                  className="bl-greats-card"
                  style={
                    { "--bl-blog-accent": author.accent } as CSSProperties
                  }
                >
                  <header>
                    <div>
                      <span>{author.kind}</span>
                      <h3>{author.name}</h3>
                    </div>
                    <a
                      href={author.homeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Open ${author.name}`}
                      aria-label={`Open ${author.name}`}
                    >
                      <ArrowSquareOut size={16} aria-hidden />
                    </a>
                  </header>
                  {author.posts.length ? (
                    <ul>
                      {author.posts.map((post) => (
                        <li key={post.id}>
                          <a
                            href={post.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span>{post.title}</span>
                            <CaretRight size={13} weight="bold" aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <a
                      className="bl-greats-own-blog"
                      href={author.homeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open {author.name}&apos;s writing
                      <CaretRight size={13} weight="bold" aria-hidden />
                    </a>
                  )}
                  <a
                    className="bl-greats-home"
                    href={author.homeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {(() => {
                      try {
                        return new URL(author.homeUrl).hostname.replace(
                          /^www\./,
                          ""
                        );
                      } catch {
                        return author.homeUrl;
                      }
                    })()}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
