"use client";

/**
 * Wonder Bookshelf UI (folders + cover grid) for the public site.
 * Static catalog only — no sync, no detail page.
 * Click / Buy on Amazon → store link.
 */
import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowSquareOut,
  CaretRight,
  FolderSimple,
  MagnifyingGlass,
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

/** Public folder order — main pile first, then parking lot */
const PUBLIC_FOLDER_ORDER = ["main characters only", "uncategorized"] as const;

const FOLDER_ACCENT: Record<string, string> = {
  "main characters only": "#c4a06a",
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

function buyLabel(kind: BookshelfKind): string {
  if (kind === "book") return "Buy on Amazon";
  if (kind === "paper") return "Read paper";
  if (kind === "blog") return "Open essay";
  return "Listen";
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
    const query = q.trim().toLowerCase();
    return catalog.filter(({ entry }) => {
      if (filter === "faves" && !entry.favorite) return false;
      // blogs are not in the cover grid
      if (filter === "blog") return false;
      if (filter === "book" && entry.kind !== "book") return false;
      if (!query) return true;
      return (
        entry.title.toLowerCase().includes(query) ||
        entry.source.toLowerCase().includes(query)
      );
    });
  }, [catalog, filter, q]);

  /** Wonder: blogs are a link section below books — never a folder of covers */
  const showBlogs = filter === "all" || filter === "blog";

  const filteredGreats = useMemo(() => {
    if (!showBlogs) return [];
    const query = q.trim().toLowerCase();
    if (!query) return GREATS_AUTHORS;
    return GREATS_AUTHORS.map((author) => ({
      ...author,
      posts: author.posts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          author.name.toLowerCase().includes(query)
      ),
    })).filter(
      (author) =>
        author.posts.length > 0 ||
        author.name.toLowerCase().includes(query)
    );
  }, [showBlogs, q]);

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
              {/* Counts live on the chips below — tagline is why this shelf exists */}
              <p className="bl-tagline pb-shelf-tagline">
                I wish I had a second life dedicated to just reading everything
                written out there. Here are my book counts. The goal is to read
                at least 1 book every week with the intent to have fun more than
                seeking to learn something.
              </p>
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

        {groups.length === 0 &&
        !(filter === "faves" && filtered.length > 0) &&
        !showBlogs ? (
          <p className="bl-empty-all">
            {q
              ? "No matches."
              : filter === "faves"
                ? "No faves yet — mark a few from scattered shelves when one truly sticks."
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

        {groups.map((group) => {
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
              <div className="bl-folder-row">
                <button
                  type="button"
                  className="bl-folder"
                  aria-expanded={expanded}
                  onClick={() =>
                    setOpenFolders((current) => ({
                      ...current,
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
                    {/* Quirky shelf math — not “9 books” corporate-speak */}
                    <small>n = {group.items.length}</small>
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
