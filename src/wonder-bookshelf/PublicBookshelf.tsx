"use client";

/**
 * Public Bookshelf — insight into what Celine Nova reads.
 * Static catalog, folders, faves. Covers link out for the curious;
 * this is not a storefront.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  CaretDoubleDown,
  CaretDoubleUp,
  CaretRight,
  FolderSimple,
  MagicWand,
} from "@phosphor-icons/react";
import {
  bookshelfEntries,
  isYourIntelligence,
  type BookshelfEntry,
  type BookshelfKind,
} from "@/data/bookshelf";
import {
  CATEGORY_ORDER,
  SPINE_COLORS,
  type Book,
} from "./booksStore";
import {
  coverUrlForBook,
  hasAmazonAssociateTag,
  storeUrlForBook,
} from "./amazon";
import { catalogEntryToBook } from "./publicCatalog";
import {
  getShelfBlogs,
  shortBlogDate,
  type ShelfBlog,
} from "./shelfBlogs";
import {
  BLOG_FONT_OPTIONS,
  DEFAULT_BLOG_STYLE,
  blogStyleToCssVars,
  loadBlogStyle,
  saveBlogStyle,
  type BlogDisplayStyle,
} from "./blogDisplayStyle";
import {
  applyBlogOverlay,
  applyCatalogOverlay,
  loadShelfEditor,
  saveShelfEditor,
  DEFAULT_NEXT_ON_THE_LIST,
  type ShelfEditorState,
} from "./shelfEditorStore";
import { MinimalIcon } from "./MinimalIcon";
import "./books-library.css";

/** Drives she can assign a book to while editing */
const EDIT_FOLDER_OPTIONS = [
  "autobiographies",
  "everything startups",
  "psychology",
  "history",
  "economics",
  "fiction",
  "literature",
] as const;

/** Single tap vs double tap (ms). Double = annotations; single = outbound link. */
const TAP_MS = 280;

function openExternal(href: string) {
  if (!href || href === "#") return;
  window.open(href, "_blank", "noopener,noreferrer");
}

/** Public chips only — no empty Papers/Podcasts until real content exists */
type Filter = "all" | "book" | "blog" | "faves";

const CHIPS: { id: Filter; label: string }[] = [
  { id: "all", label: "all" },
  { id: "book", label: "books" },
  { id: "blog", label: "blogs I've read" },
  { id: "faves", label: "favs" },
];


const PUBLIC_FOLDER_ORDER = [
  "autobiographies",
  "everything startups",
  "psychology",
  "history",
  "economics",
  "fiction",
  "literature",
] as const;

const AUTOBIOGRAPHY_TECH_ORDER = [
  "book-entrepreneur-jobs",
  "book-entrepreneur-source-code",
  "book-entrepreneur-nvidia",
  "book-isaacson-elon-musk",
  "book-entrepreneur-musk-vance",
  "book-entrepreneur-book-of-elon",
  "book-creator-nolan-variations",
  "book-sv-a5b6547157",
  "book-isaacson-innovators",
  "book-isaacson-code-breaker",
  "book-genius-tesla-auto",
  "book-genius-tesla-carlson",
  "book-genius-menlo",
  "book-genius-feynman-joking",
  "book-genius-gleick-feynman",
  "book-genius-einstein",
  "book-genius-newton",
  "book-genius-wright",
  "book-genius-leonardo",
] as const;

const AUTOBIOGRAPHY_TECH_RANK = new Map<string, number>(
  AUTOBIOGRAPHY_TECH_ORDER.map((id, index) => [id, index]),
);

const FOLDER_ACCENT: Record<string, string> = {
  autobiographies: "#c4a06a",
  "main characters": "#c4a06a",
  "main characters only": "#c4a06a", // legacy catalog key until fully migrated
  "everything startups": "#5b9fd4",
  psychology: "#9b7fd4",
  history: "#c97b84",
  economics: "#6b9e78",
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
  Faves: "#d4bc82",
  "Your intelligence": "#d4bc82",
  beatles: "#e0803f",
  "by my heroes": "#cf5f8f",
  fiction: "#7b8fd4",
  literature: "#8d6e63",
  ai: "#3fb6b0",
  "technology ethics": "#3fb6b0",
  dostoevsky: "#8c5a5a",
  "high school reads": "#9aa84b",
};

/**
 * Fallback accent for any shelf not named above — every folder gets its own
 * colour instead of all the unlisted ones sharing one grey. Hashing the label
 * keeps a shelf's colour stable across reloads and reorders, and new shelves
 * pick one up automatically. Saturation and lightness are fixed so the whole
 * set stays in the same muted register as the hand-picked accents.
 */
function accentForLabel(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) {
    hash = (hash * 31 + label.charCodeAt(i)) % 360;
  }
  return `hsl(${hash} 42% 58%)`;
}

function folderAccent(label: string): string {
  return FOLDER_ACCENT[label] || accentForLabel(label);
}

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
  const raw = entry.category?.trim();
  if (raw) {
    const normalized = raw.toLowerCase();
    if (
      normalized === "main characters only" ||
      normalized === "main characters" ||
      normalized === "beatles" ||
      normalized === "by my heroes"
    ) {
      return "autobiographies";
    }
    if (normalized === "dostoevsky" || normalized === "high school reads") {
      return "literature";
    }
    if (normalized === "uncategorized" || normalized === "unsorted") {
      return "history";
    }
    return raw;
  }
  return "autobiographies";
}

type ShelfItem = { entry: BookshelfEntry; book: Book };

type ShelfGroup = {
  id: string;
  label: string;
  accent: string;
  items: ShelfItem[];
};

type BlogAuthorGroup = {
  id: string;
  author: string;
  items: ShelfBlog[];
};

function orderFolderItems(label: string, items: ShelfItem[]): ShelfItem[] {
  if (label !== "autobiographies") return items;

  return [...items].sort((a, b) => {
    const aRank = AUTOBIOGRAPHY_TECH_RANK.get(a.entry.id);
    const bRank = AUTOBIOGRAPHY_TECH_RANK.get(b.entry.id);
    if (aRank === undefined && bRank === undefined) return 0;
    if (aRank === undefined) return 1;
    if (bRank === undefined) return -1;
    return aRank - bRank;
  });
}

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

/**
 * Always 5 star slots. Fill color = rating; empty = muted outline.
 * Never shorten the row to “★★★” for a 3 — that was wrong.
 */
function StarRating({ rating }: { rating?: number }) {
  const filled = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  if (filled < 1) return null;

  return (
    <span
      className="bl-card-stars pb-card-stars"
      aria-label={`${filled} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={
            i < filled ? "pb-star pb-star--on" : "pb-star pb-star--off"
          }
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  );
}

function CatalogCard({
  item,
  folderLabel,
  highlight = false,
  editMode = false,
  onAnnotate,
  onDelete,
  onCategory,
  onRating,
}: {
  item: ShelfItem;
  folderLabel: string;
  highlight?: boolean;
  editMode?: boolean;
  onAnnotate: (title: string, body: string) => void;
  onDelete?: (id: string) => void;
  onCategory?: (id: string, category: string) => void;
  onRating?: (id: string, rating: number) => void;
}) {
  const { entry, book } = item;
  const href = buyUrl(entry, book);
  const label = openLabel(entry.kind);
  const associateLink = entry.kind === "book" && hasAmazonAssociateTag();
  const hoverNote = (entry.thoughts || entry.summary || "").trim();
  const artifactTitleSize =
    book.title.length > 110
      ? "clamp(0.5rem, 3.8cqw, 0.72rem)"
      : book.title.length > 80
        ? "clamp(0.56rem, 4.4cqw, 0.8rem)"
        : book.title.length > 55
          ? "clamp(0.62rem, 5cqw, 0.9rem)"
          : book.title.length > 30
            ? "clamp(0.68rem, 5.8cqw, 1rem)"
            : "clamp(0.72rem, 8cqw, 1.2rem)";
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, []);

  const onActivate = (e: ReactMouseEvent) => {
    e.preventDefault();
    if (editMode) return;
    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
      const body = (entry.thoughts || entry.summary || "").trim();
      onAnnotate(book.title, body);
      return;
    }
    tapTimer.current = setTimeout(() => {
      tapTimer.current = null;
      openExternal(href);
    }, TAP_MS);
  };

  return (
    <div
      className={`bl-card-wrap${highlight ? " pb-card-wrap--picked" : ""}${editMode ? " pb-card-wrap--edit" : ""}`}
      id={`pb-book-${entry.id}`}
      data-book-id={entry.id}
    >
      <button
        type="button"
        className="bl-card pb-card-link pb-card-btn"
        title={editMode ? book.title : `${label} · double-tap for notes`}
        aria-label={
          editMode
            ? book.title
            : `${entry.kind === "book" ? "Open on Amazon" : label}: ${book.title}${book.author ? ` by ${book.author}` : ""}`
        }
        onClick={onActivate}
      >
        <span className="pb-artifact-frame">
          <BookCover book={book} folderLabel={folderLabel} />
          {!editMode ? (
            <span className="pb-artifact-popover" aria-hidden>
              <span className="pb-artifact-kicker">{entry.kind}</span>
              <strong
                className="pb-artifact-title"
                style={
                  {
                    "--pb-artifact-title-size": artifactTitleSize,
                  } as CSSProperties
                }
              >
                {book.title}
              </strong>
              {book.author ? (
                <span className="pb-artifact-author">{book.author}</span>
              ) : null}
              <span className="pb-artifact-cta">
                {entry.kind === "book"
                  ? `Amazon${associateLink ? " · paid link" : ""} ↗`
                  : `${label} ↗`}
              </span>
              {hoverNote ? (
                <span className="pb-artifact-note">{hoverNote}</span>
              ) : null}
            </span>
          ) : null}
        </span>
        <span className="bl-card-title">{book.title}</span>
        {book.author ? (
          <span className="bl-card-author">{book.author}</span>
        ) : null}
        {!editMode ? <StarRating rating={entry.rating} /> : null}
      </button>
      {editMode ? (
        <div className="pb-card-edit">
          <select
            className="pb-card-edit__select"
            value={folderLabel}
            aria-label="Folder"
            onChange={(e) => onCategory?.(entry.id, e.target.value)}
          >
            {EDIT_FOLDER_OPTIONS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
            {!EDIT_FOLDER_OPTIONS.includes(
              folderLabel as (typeof EDIT_FOLDER_OPTIONS)[number]
            ) ? (
              <option value={folderLabel}>{folderLabel}</option>
            ) : null}
          </select>
          <select
            className="pb-card-edit__select"
            value={entry.rating ?? 0}
            aria-label="Rating"
            onChange={(e) => onRating?.(entry.id, Number(e.target.value))}
          >
            <option value={0}>no stars</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}★
              </option>
            ))}
          </select>
          <button
            type="button"
            className="pb-card-edit__delete"
            onClick={() => onDelete?.(entry.id)}
          >
            delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function PublicBookshelf() {
  const [filter, setFilter] = useState<Filter>("all");
  /** Start closed so the public shelf reads as one compact, aligned index. */
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [openBlogAuthors, setOpenBlogAuthors] = useState<
    Record<string, boolean>
  >({});
  /** Ephemeral “Press S again” tip after a random pick (~5s) */
  const [sHint, setSHint] = useState(false);
  /** Pink pick stays until that drive is closed */
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [highlightFolder, setHighlightFolder] = useState<string | null>(null);
  const sHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Formal annotation panel — double-tap on book or blog */
  const [annotation, setAnnotation] = useState<{
    title: string;
    body: string;
  } | null>(null);

  /** The owner-edit surface is intentionally disabled on the public shelf. */
  const pageEdit = false;
  const [editor, setEditor] = useState<ShelfEditorState>(() =>
    typeof window === "undefined" ? loadShelfEditor() : loadShelfEditor()
  );
  const [blogStyle, setBlogStyle] = useState<BlogDisplayStyle>(DEFAULT_BLOG_STYLE);
  const [styleCopied, setStyleCopied] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setEditor(loadShelfEditor());
      setBlogStyle(loadBlogStyle());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const patchEditor = useCallback(
    (fn: (prev: ShelfEditorState) => ShelfEditorState) => {
      setEditor((prev) => {
        const next = fn(prev);
        saveShelfEditor(next);
        return next;
      });
    },
    []
  );

  /** Books / papers / podcasts only — never fake blog "book" covers */
  const catalog = useMemo<ShelfItem[]>(() => {
    const live = applyCatalogOverlay(
      bookshelfEntries.filter(
        (entry) =>
          entry.kind !== "blog" &&
          entry.category?.trim().toLowerCase() !== "technology ethics",
      ),
      editor
    );
    return live.map((entry, i) => {
        const book = catalogEntryToBook(entry);
        book.color = SPINE_COLORS[i % SPINE_COLORS.length];
        if (entry.kind === "book") {
          book.coverUrl = coverUrlForBook({
            asin: entry.asin,
            href: entry.href,
            title: entry.title,
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
  }, [editor]);

  const baseShelfBlogs = useMemo(() => getShelfBlogs(), []);
  const shelfBlogs = useMemo(
    () => applyBlogOverlay(baseShelfBlogs, editor),
    [baseShelfBlogs, editor]
  );
  const blogGroups = useMemo<BlogAuthorGroup[]>(() => {
    const byAuthor = new Map<string, ShelfBlog[]>();
    for (const blog of shelfBlogs) {
      const items = byAuthor.get(blog.author) || [];
      items.push(blog);
      byAuthor.set(blog.author, items);
    }
    return [...byAuthor.entries()]
      .map(([author, items]) => ({
        id: author
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        author,
        items,
      }))
      .sort(
        (a, b) =>
          b.items.length - a.items.length || a.author.localeCompare(b.author),
      );
  }, [shelfBlogs]);
  const blogCount = shelfBlogs.length;
  const blogCssVars = useMemo(
    () => blogStyleToCssVars(blogStyle) as CSSProperties,
    [blogStyle]
  );

  const patchBlogStyle = useCallback(
    <K extends keyof BlogDisplayStyle>(key: K, value: BlogDisplayStyle[K]) => {
      setBlogStyle((prev) => {
        const next = { ...prev, [key]: value };
        saveBlogStyle(next);
        return next;
      });
    },
    []
  );

  const deleteBook = useCallback(
    (id: string) => {
      patchEditor((prev) => ({
        ...prev,
        deletedBookIds: prev.deletedBookIds.includes(id)
          ? prev.deletedBookIds
          : [...prev.deletedBookIds, id],
      }));
    },
    [patchEditor]
  );

  const setBookCategory = useCallback(
    (id: string, category: string) => {
      patchEditor((prev) => ({
        ...prev,
        categoryById: { ...prev.categoryById, [id]: category },
      }));
    },
    [patchEditor]
  );

  const setBookRating = useCallback(
    (id: string, rating: number) => {
      patchEditor((prev) => {
        const ratingById = { ...prev.ratingById };
        if (rating < 1) delete ratingById[id];
        else ratingById[id] = rating;
        return { ...prev, ratingById };
      });
    },
    [patchEditor]
  );

  const deleteBlog = useCallback(
    (id: string) => {
      patchEditor((prev) => ({
        ...prev,
        deletedBlogIds: prev.deletedBlogIds.includes(id)
          ? prev.deletedBlogIds
          : [...prev.deletedBlogIds, id],
      }));
    },
    [patchEditor]
  );

  const patchBlogField = useCallback(
    (id: string, field: "highlight" | "take", value: string) => {
      patchEditor((prev) => ({
        ...prev,
        blogById: {
          ...prev.blogById,
          [id]: { ...prev.blogById[id], [field]: value },
        },
      }));
    },
    [patchEditor]
  );

  const resetBlogStyle = useCallback(() => {
    setBlogStyle({ ...DEFAULT_BLOG_STYLE });
    saveBlogStyle(DEFAULT_BLOG_STYLE);
  }, []);

  const copyBlogStyle = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(blogStyle, null, 2));
      setStyleCopied(true);
      window.setTimeout(() => setStyleCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }, [blogStyle]);

  const counts = useMemo(() => {
    const c = {
      all: catalog.length + blogCount,
      book: 0,
      blog: blogCount,
      faves: 0,
    };
    for (const { entry } of catalog) {
      if (entry.kind === "book") c.book += 1;
      // Your intelligence = 5★ faves + meditations
      if (isYourIntelligence(entry)) c.faves += 1;
    }
    return c;
  }, [catalog, blogCount]);

  const filtered = useMemo(() => {
    return catalog.filter(({ entry }) => {
      // Your intelligence chip = faves + meditations
      if (filter === "faves" && !isYourIntelligence(entry)) return false;
      // blogs are not in the cover grid
      if (filter === "blog") return false;
      if (filter === "book" && entry.kind !== "book") return false;
      return true;
    });
  }, [catalog, filter]);

  /** Blogs: numbered list below books — never a folder of covers */
  const showBlogs = filter === "all" || filter === "blog";

  const groups = useMemo<ShelfGroup[]>(() => {
    // Blogs chip: only the numbered list (no book folders)
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
        accent: folderAccent(label),
        items: orderFolderItems(label, items),
      });
      map.delete(label);
    }
    for (const [label, items] of map) {
      out.push({
        id: label,
        label,
        accent: folderAccent(label),
        items,
      });
    }
    return out;
  }, [filtered, filter]);

  const chipCount = (id: Filter) => {
    if (id === "all") return counts.all;
    if (id === "faves") return counts.faves;
    if (id === "blog") return blogCount;
    if (id === "book") return counts.book;
    return 0;
  };

  const visibleBlogGroups = useMemo(
    () => (showBlogs ? blogGroups : []),
    [blogGroups, showBlogs],
  );
  const visibleFolderCount = groups.length + visibleBlogGroups.length;
  const allFoldersExpanded =
    visibleFolderCount > 0 &&
    groups.every((group) => openFolders[group.id] === true) &&
    visibleBlogGroups.every(
      (group) => openBlogAuthors[group.id] === true,
    );

  const expandAllFolders = useCallback(() => {
    setOpenFolders(
      Object.fromEntries(groups.map((group) => [group.id, true])),
    );
    setOpenBlogAuthors(
      Object.fromEntries(visibleBlogGroups.map((group) => [group.id, true])),
    );
  }, [groups, visibleBlogGroups]);

  const closeAllFolders = useCallback(() => {
    setOpenFolders(
      Object.fromEntries(groups.map((group) => [group.id, false])),
    );
    setOpenBlogAuthors(
      Object.fromEntries(visibleBlogGroups.map((group) => [group.id, false])),
    );
    setHighlightId(null);
    setHighlightFolder(null);
  }, [groups, visibleBlogGroups]);

  const toggleAllFolders = useCallback(() => {
    if (allFoldersExpanded) closeAllFolders();
    else expandAllFolders();
  }, [allFoldersExpanded, closeAllFolders, expandAllFolders]);

  const openAnnotation = useCallback((title: string, body: string) => {
    setAnnotation({ title, body });
  }, []);

  const blogTapTimers = useRef<
    Map<string, ReturnType<typeof setTimeout>>
  >(new Map());

  const onBlogActivate = useCallback(
    (blog: ShelfBlog) => {
      const existing = blogTapTimers.current.get(blog.id);
      if (existing) {
        clearTimeout(existing);
        blogTapTimers.current.delete(blog.id);
        const note = [blog.highlight && `“${blog.highlight}”`, blog.take]
          .filter(Boolean)
          .join("\n\n");
        if (!note) {
          openExternal(blog.url);
          return;
        }
        // Double-tap opens the reader's notes when that entry has notes.
        openAnnotation(
          blog.title,
          note,
        );
        return;
      }
      const t = setTimeout(() => {
        blogTapTimers.current.delete(blog.id);
        openExternal(blog.url);
      }, TAP_MS);
      blogTapTimers.current.set(blog.id, t);
    },
    [openAnnotation],
  );

  function isExpanded(id: string): boolean {
    return openFolders[id] === true;
  }

  function isBlogAuthorExpanded(id: string): boolean {
    return openBlogAuthors[id] === true;
  }

  const toggleBlogAuthor = useCallback((id: string) => {
    setOpenBlogAuthors((current) => ({ ...current, [id]: !current[id] }));
  }, []);

  /** Random pick — open drive, pink highlight until that drive closes */
  const surpriseMe = useCallback(() => {
    if (!catalog.length) return;
    const pick = catalog[Math.floor(Math.random() * catalog.length)];
    const folder = folderLabelFor(pick.entry);
    setFilter("all");
    setOpenFolders((current) => ({ ...current, [folder]: true }));
    setHighlightId(pick.entry.id);
    setHighlightFolder(folder);
    window.setTimeout(() => {
      document
        .getElementById(`pb-book-${pick.entry.id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);

    // 5s tip popup only (highlight stays)
    if (sHintTimerRef.current) clearTimeout(sHintTimerRef.current);
    setSHint(true);
    sHintTimerRef.current = setTimeout(() => {
      setSHint(false);
      sHintTimerRef.current = null;
    }, 5000);
  }, [catalog]);

  const toggleFolder = useCallback(
    (folderId: string) => {
      setOpenFolders((current) => {
        const nextOpen = !current[folderId];
        // Closing the drive that holds the pick clears the pink highlight
        if (!nextOpen && highlightFolder === folderId) {
          setHighlightId(null);
          setHighlightFolder(null);
        }
        return { ...current, [folderId]: nextOpen };
      });
    },
    [highlightFolder],
  );

  useEffect(() => {
    return () => {
      if (sHintTimerRef.current) clearTimeout(sHintTimerRef.current);
    };
  }, []);

  // Keyboard: S = surprise · V/B = folder controls · 1–4 = chips
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const t = event.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" ||
          t.tagName === "TEXTAREA" ||
          t.isContentEditable)
      ) {
        return;
      }
      const k = event.key.toLowerCase();
      if (k === "s") {
        event.preventDefault();
        surpriseMe();
      } else if (k === "v") {
        event.preventDefault();
        expandAllFolders();
      } else if (k === "b") {
        event.preventDefault();
        closeAllFolders();
      } else if (k >= "1" && k <= "4") {
        const map: Filter[] = ["all", "book", "blog", "faves"];
        setFilter(map[Number(k) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [surpriseMe, expandAllFolders, closeAllFolders]);

  return (
    <div className="bl-public-wrap pb-root">
      {/* Wonder light panel — same structure as BooksLibrary list view */}
      <div className="bl" data-books-theme="light">
        <header className="bl-head">
          <div className="bl-head-main">
            <div className="bl-head-copy">
              <h1 className="bl-title">
                <MinimalIcon name="books" size={22} />
                {pageEdit ? (
                  <input
                    className="pb-page-title-input"
                    value={editor.pageTitle}
                    onChange={(e) =>
                      patchEditor((p) => ({
                        ...p,
                        pageTitle: e.target.value,
                      }))
                    }
                    aria-label="Page title"
                  />
                ) : (
                  editor.pageTitle.toLocaleLowerCase()
                )}
              </h1>
              <div className="bl-stats" aria-label="Shelf totals">
                <span>
                  <b>{counts.book}</b> books
                </span>
                <span>
                  <b>{blogCount}</b> blogs read
                </span>
                <span>
                  <b>{counts.faves}</b> favs
                </span>
              </div>
            </div>
          </div>
        </header>

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
          {visibleFolderCount > 0 ? (
            <button
              type="button"
              className="bl-chip pb-chip-folders"
              onClick={toggleAllFolders}
              title={
                allFoldersExpanded
                  ? "Close all folders (B)"
                  : "Expand all folders (V)"
              }
              aria-label={
                allFoldersExpanded
                  ? "Close all folders"
                  : "Expand all folders"
              }
            >
              {allFoldersExpanded ? (
                <CaretDoubleUp size={12} weight="bold" aria-hidden />
              ) : (
                <CaretDoubleDown size={12} weight="bold" aria-hidden />
              )}
              <span>
                {allFoldersExpanded ? "close all folders" : "expand all folders"}
              </span>
            </button>
          ) : null}
          <button
            type="button"
            className="bl-chip pb-chip-surprise"
            onClick={surpriseMe}
            title="random book generator for my list (S)"
          >
            <MagicWand size={12} weight="fill" aria-hidden />
            <span>random book generator for my list</span>
          </button>
        </div>

        {/* Current reads — editable in page edit mode */}
        {pageEdit ? (
          <div className="pb-currently-reading pb-currently-reading--edit">
            <span>current reads:</span>
            {editor.currentReads.map((r, i) => (
              <div key={i} className="pb-current-edit-row">
                <input
                  value={r.title}
                  aria-label={`Current read ${i + 1} title`}
                  onChange={(e) =>
                    patchEditor((p) => {
                      const currentReads = [...p.currentReads];
                      currentReads[i] = {
                        ...currentReads[i],
                        title: e.target.value,
                      };
                      return { ...p, currentReads };
                    })
                  }
                />
                <input
                  value={r.author}
                  aria-label={`Current read ${i + 1} author`}
                  onChange={(e) =>
                    patchEditor((p) => {
                      const currentReads = [...p.currentReads];
                      currentReads[i] = {
                        ...currentReads[i],
                        author: e.target.value,
                      };
                      return { ...p, currentReads };
                    })
                  }
                />
                <input
                  value={r.href}
                  aria-label={`Current read ${i + 1} link`}
                  onChange={(e) =>
                    patchEditor((p) => {
                      const currentReads = [...p.currentReads];
                      currentReads[i] = {
                        ...currentReads[i],
                        href: e.target.value,
                      };
                      return { ...p, currentReads };
                    })
                  }
                />
                <button
                  type="button"
                  className="pb-card-edit__delete"
                  onClick={() =>
                    patchEditor((p) => ({
                      ...p,
                      currentReads: p.currentReads.filter((_, j) => j !== i),
                    }))
                  }
                >
                  delete
                </button>
              </div>
            ))}
            <button
              type="button"
              className="pb-blogs__edit-toggle"
              onClick={() =>
                patchEditor((p) => ({
                  ...p,
                  currentReads: [
                    ...p.currentReads,
                    { title: "title", author: "author", href: "https://" },
                  ],
                }))
              }
            >
              + current read
            </button>
          </div>
        ) : (
          <p className="pb-currently-reading">
            current reads:{" "}
            {editor.currentReads.map((r, i) => (
              <span key={`${r.title}-${i}`}>
                {i > 0 ? (
                  <span className="pb-currently-reading__sep"> · </span>
                ) : null}
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.title}
                </a>{" "}
                by {r.author}
              </span>
            ))}
          </p>
        )}
        <p className="pb-currently-reading">
          next on the list:{" "}
          {DEFAULT_NEXT_ON_THE_LIST.map((r, i) => (
            <span key={`${r.title}-${i}`}>
              {i > 0 ? (
                <span className="pb-currently-reading__sep"> · </span>
              ) : null}
              <a href={r.href} target="_blank" rel="noopener noreferrer">
                {r.title}
              </a>{" "}
              by {r.author}
            </span>
          ))}
        </p>

        {sHint ? (
          <div className="pb-s-popup" role="status" aria-live="polite">
            Press S again for another.
          </div>
        ) : null}

        {groups.length === 0 &&
        !(filter === "faves" && filtered.length > 0) &&
        !showBlogs ? (
          <p className="bl-empty-all">—</p>
        ) : null}

        {/* favs: 5★ only — flat grid + small line under chip */}
        {filter === "faves" && filtered.length > 0 ? (
          <section
            className="bl-shelf is-open pb-faves-flat"
            aria-label="favs"
          >
            <p className="pb-faves-note">my only 5 stars</p>
            <div className="bl-grid">
              {filtered.map((item) => (
                <CatalogCard
                  key={item.entry.id}
                  item={item}
                  folderLabel="favs"
                  highlight={highlightId === item.entry.id}
                  editMode={pageEdit}
                  onAnnotate={openAnnotation}
                  onDelete={deleteBook}
                  onCategory={setBookCategory}
                  onRating={setBookRating}
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* Wonder drive rows — caret + icon + title + “N books”; no rename pencils */}
        {groups.map((group) => {
          const expanded = isExpanded(group.id);
          const n = group.items.length;
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
                  onClick={() => toggleFolder(group.id)}
                >
                  <CaretRight
                    className="bl-folder-caret"
                    size={12}
                    aria-hidden
                  />
                  <FolderSimple
                    className="bl-folder-icon"
                    size={16}
                    weight="fill"
                    aria-hidden
                    style={{ color: group.accent, fill: group.accent }}
                  />
                  <span className="bl-folder-copy">
                    <strong>{group.label}</strong>
                    <small className="bl-folder-count" aria-label={`n = ${n}`}>
                      <span aria-hidden="true">n</span>
                      <span aria-hidden="true">=</span>
                      <span aria-hidden="true">{n}</span>
                    </small>
                  </span>
                </button>
              </div>

              {expanded ? (
                <>
                  {pageEdit ? (
                    <input
                      className="pb-folder-view pb-folder-view--input"
                      value={editor.folderViews[group.label] || ""}
                      placeholder="line under drive name"
                      onChange={(e) =>
                        patchEditor((p) => ({
                          ...p,
                          folderViews: {
                            ...p.folderViews,
                            [group.label]: e.target.value,
                          },
                        }))
                      }
                    />
                  ) : editor.folderViews[group.label] ? (
                    <p className="pb-folder-view">
                      {editor.folderViews[group.label]}
                    </p>
                  ) : null}
                  <div className="bl-grid">
                    {group.items.map((item) => (
                      <CatalogCard
                        key={item.entry.id}
                        item={item}
                        folderLabel={group.label}
                        highlight={highlightId === item.entry.id}
                        editMode={pageEdit}
                        onAnnotate={openAnnotation}
                        onDelete={deleteBook}
                        onCategory={setBookCategory}
                        onRating={setBookRating}
                      />
                    ))}
                  </div>
                </>
              ) : null}
            </section>
          );
        })}

        {/* Finished reading archive, grouped by author. */}
        {showBlogs && shelfBlogs.length > 0 ? (
          <section
            className={`pb-blogs${filter === "all" ? " pb-blogs--after-books" : ""}`}
            aria-label="blogs I've read"
            style={blogCssVars}
          >
            <header className="pb-blogs__head">
              <h2 className="pb-blogs__title">blogs i&apos;ve read</h2>
            </header>

            {pageEdit ? (
              <div className="pb-blogs__studio" role="group" aria-label="Blog style">
                <label>
                  font
                  <select
                    value={blogStyle.fontFamily}
                    onChange={(e) =>
                      patchBlogStyle("fontFamily", e.target.value)
                    }
                  >
                    {BLOG_FONT_OPTIONS.map((f) => (
                      <option key={f.label} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  heading size
                  <input
                    type="number"
                    min={9}
                    max={28}
                    value={blogStyle.headingSize}
                    onChange={(e) =>
                      patchBlogStyle("headingSize", Number(e.target.value) || 13)
                    }
                  />
                </label>
                <label>
                  title size
                  <input
                    type="number"
                    min={8}
                    max={24}
                    value={blogStyle.titleSize}
                    onChange={(e) =>
                      patchBlogStyle("titleSize", Number(e.target.value) || 11)
                    }
                  />
                </label>
                <label>
                  meta size
                  <input
                    type="number"
                    min={8}
                    max={20}
                    value={blogStyle.metaSize}
                    onChange={(e) =>
                      patchBlogStyle("metaSize", Number(e.target.value) || 10)
                    }
                  />
                </label>
                <label>
                  highlight size
                  <input
                    type="number"
                    min={8}
                    max={22}
                    value={blogStyle.highlightSize}
                    onChange={(e) =>
                      patchBlogStyle(
                        "highlightSize",
                        Number(e.target.value) || 10
                      )
                    }
                  />
                </label>
                <label>
                  take size
                  <input
                    type="number"
                    min={8}
                    max={22}
                    value={blogStyle.takeSize}
                    onChange={(e) =>
                      patchBlogStyle("takeSize", Number(e.target.value) || 10)
                    }
                  />
                </label>
                <label>
                  row gap
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={blogStyle.rowGap}
                    onChange={(e) =>
                      patchBlogStyle("rowGap", Number(e.target.value) || 0)
                    }
                  />
                </label>
                <label>
                  line gap
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={blogStyle.lineGap}
                    onChange={(e) =>
                      patchBlogStyle("lineGap", Number(e.target.value) || 0)
                    }
                  />
                </label>
                <label>
                  section top
                  <input
                    type="number"
                    min={0}
                    max={48}
                    value={blogStyle.sectionTop}
                    onChange={(e) =>
                      patchBlogStyle("sectionTop", Number(e.target.value) || 0)
                    }
                  />
                </label>
                <label>
                  heading color
                  <input
                    type="color"
                    value={blogStyle.headingColor}
                    onChange={(e) =>
                      patchBlogStyle("headingColor", e.target.value)
                    }
                  />
                </label>
                <label>
                  title color
                  <input
                    type="color"
                    value={blogStyle.titleColor}
                    onChange={(e) =>
                      patchBlogStyle("titleColor", e.target.value)
                    }
                  />
                </label>
                <label>
                  meta color
                  <input
                    type="color"
                    value={blogStyle.metaColor}
                    onChange={(e) =>
                      patchBlogStyle("metaColor", e.target.value)
                    }
                  />
                </label>
                <label>
                  highlight color
                  <input
                    type="color"
                    value={blogStyle.highlightColor}
                    onChange={(e) =>
                      patchBlogStyle("highlightColor", e.target.value)
                    }
                  />
                </label>
                <label>
                  take color
                  <input
                    type="color"
                    value={blogStyle.takeColor}
                    onChange={(e) =>
                      patchBlogStyle("takeColor", e.target.value)
                    }
                  />
                </label>
                <label>
                  number color
                  <input
                    type="color"
                    value={blogStyle.numberColor}
                    onChange={(e) =>
                      patchBlogStyle("numberColor", e.target.value)
                    }
                  />
                </label>
                <div className="pb-blogs__studio-actions">
                  <button type="button" onClick={resetBlogStyle}>
                    reset
                  </button>
                  <button type="button" onClick={copyBlogStyle}>
                    {styleCopied ? "copied" : "copy style json"}
                  </button>
                </div>
              </div>
            ) : null}

            <div className="pb-blog-authors">
              {blogGroups.map((group) => {
                const expanded = isBlogAuthorExpanded(group.id);
                return (
                  <section
                    key={group.id}
                    className={`pb-blog-author${expanded ? " is-open" : ""}`}
                  >
                    <button
                      type="button"
                      className="pb-blog-author__folder"
                      aria-expanded={expanded}
                      onClick={() => toggleBlogAuthor(group.id)}
                    >
                      <CaretRight
                        className="pb-blog-author__caret"
                        size={12}
                        weight="bold"
                        aria-hidden
                      />
                      <FolderSimple
                        className="pb-blog-author__icon"
                        size={16}
                        weight="fill"
                        aria-hidden
                      />
                      <span className="pb-blog-author__copy">
                        <strong>{group.author}</strong>
                        <small>
                          {group.items.length}{" "}
                          {group.items.length === 1 ? "essay" : "essays"}
                        </small>
                      </span>
                    </button>

                    {expanded ? (
                      <ol className="pb-blogs__list">
                        {group.items.map((blog, i) => {
                          const displayDate = blog.readAt || blog.date;
                          const displayDateLabel = blog.readAt
                            ? `read ${shortBlogDate(blog.readAt)}`
                            : shortBlogDate(blog.date);
                          return (
                            <li key={blog.id} className="pb-blogs__item">
                              {pageEdit ? (
                                <div className="pb-blogs__row">
                                  <span className="pb-blogs__n" aria-hidden>
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <span className="pb-blogs__body">
                                    <span className="pb-blogs__line">
                                      <span className="pb-blogs__name">
                                        {blog.title}
                                      </span>
                                      {displayDate ? (
                                        <time
                                          className="pb-blogs__date"
                                          dateTime={displayDate}
                                        >
                                          {displayDateLabel}
                                        </time>
                                      ) : null}
                                      <button
                                        type="button"
                                        className="pb-card-edit__delete"
                                        onClick={() => deleteBlog(blog.id)}
                                      >
                                        delete
                                      </button>
                                    </span>
                                    <textarea
                                      className="pb-blogs__field pb-blogs__field--highlight"
                                      rows={2}
                                      value={blog.highlight}
                                      onChange={(e) =>
                                        patchBlogField(
                                          blog.id,
                                          "highlight",
                                          e.target.value,
                                        )
                                      }
                                      aria-label={`Highlight from ${blog.title}`}
                                    />
                                    <textarea
                                      className="pb-blogs__field pb-blogs__field--take"
                                      rows={2}
                                      value={blog.take}
                                      onChange={(e) =>
                                        patchBlogField(
                                          blog.id,
                                          "take",
                                          e.target.value,
                                        )
                                      }
                                      aria-label={`Your take on ${blog.title}`}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="pb-blogs__row"
                                  onClick={() => onBlogActivate(blog)}
                                  title="Open essay"
                                >
                                  <span className="pb-blogs__n" aria-hidden>
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <span className="pb-blogs__body">
                                    <span className="pb-blogs__line">
                                      <span className="pb-blogs__name">
                                        {blog.title}
                                      </span>
                                      {displayDate ? (
                                        <time
                                          className="pb-blogs__date"
                                          dateTime={displayDate}
                                        >
                                          {displayDateLabel}
                                        </time>
                                      ) : null}
                                    </span>
                                  </span>
                                  <span className="pb-blogs__open" aria-hidden>
                                    ↗
                                  </span>
                                </button>
                              )}
                            </li>
                          );
                        })}
                      </ol>
                    ) : null}
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}

        {hasAmazonAssociateTag() ? (
          <p className="pb-affiliate-disclosure">
            As an Amazon Associate I earn from qualifying purchases.
          </p>
        ) : null}
      </div>

      {annotation ? (
        <div
          className="pb-note-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pb-note-title"
        >
          <button
            type="button"
            className="pb-note-modal__backdrop"
            aria-label="Close"
            onClick={() => setAnnotation(null)}
          />
          <div className="pb-note-modal__panel">
            <header className="pb-note-modal__head">
              <h3 id="pb-note-title">{annotation.title}</h3>
              <button
                type="button"
                className="pb-note-modal__close"
                onClick={() => setAnnotation(null)}
              >
                Close
              </button>
            </header>
            <div className="pb-note-modal__body">
              {annotation.body ? (
                <p>{annotation.body}</p>
              ) : (
                <p className="pb-note-modal__empty">—</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
