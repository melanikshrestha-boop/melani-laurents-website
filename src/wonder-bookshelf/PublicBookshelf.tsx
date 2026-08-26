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
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ArrowClockwise,
  CaretRight,
  FolderSimple,
  MagicWand,
  Copy,
  Check,
} from "@phosphor-icons/react";
import {
  bookshelfEntries,
  isFiveStar,
  isYourIntelligence,
  type BookshelfEntry,
  type BookshelfKind,
} from "@/data/bookshelf";
import {
  CATEGORY_ORDER,
  SPINE_COLORS,
  type Book,
} from "./booksStore";
import { coverUrlForBook, storeUrlForBook } from "./amazon";
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
  materializeBlogs,
  materializeCatalog,
  saveShelfEditor,
  type ShelfEditorState,
} from "./shelfEditorStore";
import { MinimalIcon } from "./MinimalIcon";
import "./books-library.css";

/** Drives she can assign a book to while editing */
const EDIT_FOLDER_OPTIONS = [
  "main characters",
  "everything startups",
  "psychology",
  "history",
  "economics",
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
  { id: "all", label: "All" },
  { id: "book", label: "Books" },
  { id: "blog", label: "Blogs" },
  { id: "faves", label: "favs" },
];

/** Quote rotator — shelf voice + founders + the stack itself */
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
    author: "Celine Nova",
  },
  {
    text: "Zero to one is about creating something new. Copying is one to n.",
    author: "Peter Thiel",
  },
  {
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
  },
  {
    text: "Stay hungry. Stay foolish.",
    author: "Stewart Brand / Steve Jobs",
  },
  {
    text: "Reading is a discount ticket to everywhere.",
    author: "Mary Schmich",
  },
  {
    text: "Open sourcing my mind is how I stay sharp — and how I leave a trail.",
    author: "Celine Nova",
  },
  {
    text: "Make something people want.",
    author: "Paul Graham / YC",
  },
  {
    text: "The obstacle is the way.",
    author: "Ryan Holiday (via Marcus Aurelius)",
  },
  {
    text: "I don't read to finish. I read to rewire.",
    author: "Celine Nova",
  },
  {
    text: "The most impressive people I know have strong beliefs about the world, which is rare in the general population. If you find yourself always agreeing with whomever you last spoke with, that's bad. You will of course be wrong sometimes, but develop the confidence to stick with your convictions. It will let you be courageous when you're right about something important that most people don't see.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "Try to be around smart, productive, happy, and positive people that don't belittle your ambitions. I love being around people who push me and inspire me to be better. To the degree you are able to, avoid the opposite kind of people—the cost of letting them take up your mental cycles is horrific.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I highly recommend using lists. I make lists of what I want to accomplish each year, each month, and each day. Lists are very focusing, and they help me with multitasking because I don't have to keep as much in my head. If I'm not in the mood for some particular task, I can always find something else I'm excited to do.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I am relentless about getting my most important projects done—I've found that if I really want something to happen and I push hard enough, it usually happens.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I generally try to avoid meetings and conferences as I find the time cost to be huge—I get the most value out of time in my office. However, it is critical that you keep enough space in your schedule to allow for chance encounters and exposure to new people and ideas. Having an open network is valuable; though probably 90% of the random meetings I take are a waste of time, the other 10% really make up for it.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I find most meetings are best scheduled for 15-20 minutes, or 2 hours. The default of 1 hour is usually wrong, and leads to a lot of wasted time.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I have different times of day I try to use for different kinds of work. The first few hours of the morning are definitely my most productive time of the day, so I don't let anyone schedule anything then. I try to do meetings in the afternoon. I take a break, or switch tasks, whenever I feel my attention starting to fade.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "The right goal is to allocate your year optimally, not your day.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "I like a cold, dark, quiet room, and a great mattress (I resisted spending a bunch of money on a great mattress for years, which was stupid—it makes a huge difference to my sleep quality. I love this one). Not eating a lot in the few hours before sleep helps. Not drinking alcohol helps a lot, though I'm not willing to do that all the time.",
    author: "Sam Altman · Productivity",
  },
  {
    text: "Finally, to repeat one more time: productivity in the wrong direction isn't worth anything at all. Think more about what to work on.",
    author: "Sam Altman · Productivity",
  },
];

/**
 * Public folder order — core shelf only.
 * High school / Dostoevsky / uncategorized hidden for now (ugly dump piles).
 */
const HIDDEN_PUBLIC_CATEGORIES = new Set([
  "high school reads",
  "uncategorized",
  "unsorted", // legacy dump label
]);

const PUBLIC_FOLDER_ORDER = [
  "main characters",
  "everything startups",
  "psychology",
  "history",
  "economics",
] as const;

const FOLDER_ACCENT: Record<string, string> = {
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

function isHiddenPublicCategory(label: string): boolean {
  return HIDDEN_PUBLIC_CATEGORIES.has(label.trim().toLowerCase());
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
    // Rename legacy drive label
    if (raw === "main characters only") return "main characters";
    return raw;
  }
  // Default public shelf — don't scatter into old subject bins
  return "main characters";
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
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, []);

  const onActivate = (e: ReactMouseEvent | ReactKeyboardEvent) => {
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
        onClick={onActivate}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onActivate(e);
        }}
      >
        <BookCover book={book} folderLabel={folderLabel} />
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
  /**
   * Start CLOSED — dense drive stack, no empty cover air until tapped.
   * openFolders[id] === true → open; undefined/false → closed.
   */
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteCopied, setQuoteCopied] = useState(false);
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

  /** Full-page owner edit — delete / move / rewrite / style */
  const [pageEdit, setPageEdit] = useState(false);
  const [editor, setEditor] = useState<ShelfEditorState>(() =>
    typeof window === "undefined" ? loadShelfEditor() : loadShelfEditor()
  );
  const [blogStyle, setBlogStyle] = useState<BlogDisplayStyle>(DEFAULT_BLOG_STYLE);
  const [styleCopied, setStyleCopied] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    setEditor(loadShelfEditor());
    setBlogStyle(loadBlogStyle());
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
      bookshelfEntries.filter((entry) => entry.kind !== "blog"),
      editor
    );
    return live
      .filter((entry) => !isHiddenPublicCategory(folderLabelFor(entry)))
      .map((entry, i) => {
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

  const saveToSite = useCallback(async () => {
    setSaveMsg("saving…");
    const nextCatalog = materializeCatalog(bookshelfEntries, editor);
    const nextBlogs = materializeBlogs(baseShelfBlogs, editor);
    try {
      const res = await fetch("/api/bookshelf/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog: nextCatalog, blogs: nextBlogs }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setSaveMsg(data.error || "save failed");
        return;
      }
      // Clear delete overlays — disk is source of truth now (reload for full sync)
      patchEditor((prev) => ({
        ...prev,
        deletedBookIds: [],
        deletedBlogIds: [],
        categoryById: {},
        ratingById: {},
        blogById: {},
      }));
      setSaveMsg("saved to disk — refresh");
      window.setTimeout(() => window.location.reload(), 600);
    } catch (e) {
      setSaveMsg(String(e instanceof Error ? e.message : e));
    }
  }, [editor, baseShelfBlogs, patchEditor]);

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
        items,
      });
      map.delete(label);
    }
    for (const [label, items] of map) {
      if (isHiddenPublicCategory(label)) continue;
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
        // Double-tap → full take (also always shown inline under the row)
        openAnnotation(
          blog.title,
          [blog.highlight && `“${blog.highlight}”`, blog.take]
            .filter(Boolean)
            .join("\n\n")
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

  /** Closed until user opens — denser shelf, less wasted space */
  const isExpanded = (id: string) => openFolders[id] === true;

  const quote = SHELF_QUOTES[quoteIndex % SHELF_QUOTES.length];
  const quoteTotal = SHELF_QUOTES.length;

  const nextQuote = useCallback(() => {
    setQuoteIndex((i) => (i + 1) % SHELF_QUOTES.length);
    setQuoteCopied(false);
  }, []);

  const copyQuote = useCallback(async () => {
    const line = `“${quote.text}” — ${quote.author}`;
    try {
      await navigator.clipboard.writeText(line);
      setQuoteCopied(true);
      window.setTimeout(() => setQuoteCopied(false), 1600);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }, [quote]);

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

  // Keyboard: R = next quote · S = surprise · 1–4 = chips · C = copy quote
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
      if (k === "r") {
        event.preventDefault();
        nextQuote();
      } else if (k === "s") {
        event.preventDefault();
        surpriseMe();
      } else if (k === "c" && (event.metaKey || event.ctrlKey) === false) {
        // plain C copies quote (not ⌘C)
        event.preventDefault();
        void copyQuote();
      } else if (k >= "1" && k <= "4") {
        const map: Filter[] = ["all", "book", "blog", "faves"];
        setFilter(map[Number(k) - 1]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextQuote, surpriseMe, copyQuote]);

  return (
    <div className="bl-public-wrap pb-root">
      {/* Quote strip above the cream card — same placement as Wonder shell */}
      <section className="pb-quote" aria-label="Shelf quote">
        <blockquote className="pb-quote__text">
          <p>“{quote.text}”</p>
          <cite className="pb-quote__author">{quote.author}</cite>
        </blockquote>
        <div className="pb-quote__controls">
          <button
            type="button"
            className="pb-quote__refresh"
            aria-label={quoteCopied ? "Copied" : "Copy quote"}
            title={quoteCopied ? "Copied" : "Copy quote (C)"}
            onClick={() => void copyQuote()}
          >
            {quoteCopied ? (
              <Check size={14} weight="bold" aria-hidden />
            ) : (
              <Copy size={14} weight="bold" aria-hidden />
            )}
          </button>
          <button
            type="button"
            className="pb-quote__refresh"
            aria-label="Next quote"
            title="Next quote (R)"
            onClick={nextQuote}
          >
            <ArrowClockwise size={14} weight="bold" aria-hidden />
          </button>
          <span className="pb-quote__index" aria-live="polite">
            {(quoteIndex % quoteTotal) + 1}/{quoteTotal}
          </span>
        </div>
      </section>

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
                  editor.pageTitle
                )}
              </h1>
              <div className="bl-stats" aria-label="Shelf totals">
                <span>
                  <b>{counts.book}</b> books
                </span>
                <span>
                  <b>{blogCount}</b> blogs
                </span>
                <span>
                  <b>{counts.faves}</b> favs
                </span>
              </div>
            </div>
            <div className="pb-page-edit-bar">
              <button
                type="button"
                className={`pb-blogs__edit-toggle${pageEdit ? " is-on" : ""}`}
                onClick={() => setPageEdit((v) => !v)}
                aria-pressed={pageEdit}
              >
                {pageEdit ? "done" : "edit page"}
              </button>
              {pageEdit ? (
                <>
                  <button
                    type="button"
                    className="pb-blogs__edit-toggle"
                    onClick={() => void saveToSite()}
                  >
                    save to site
                  </button>
                  {saveMsg ? (
                    <span className="pb-save-msg">{saveMsg}</span>
                  ) : null}
                </>
              ) : null}
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
                    <small>
                      {n} {n === 1 ? "book" : "books"}
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

        {/* Blogs: finished reads — style studio + always-visible highlight/take */}
        {showBlogs && shelfBlogs.length > 0 ? (
          <section
            className={`pb-blogs${filter === "all" ? " pb-blogs--after-books" : ""}`}
            aria-label="Blogs"
            style={blogCssVars}
          >
            <header className="pb-blogs__head">
              <h2 className="pb-blogs__title">Blogs</h2>
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

            <ol className="pb-blogs__list">
              {shelfBlogs.map((blog, i) => (
                <li key={blog.id} className="pb-blogs__item">
                  {pageEdit ? (
                    <div className="pb-blogs__row">
                      <span className="pb-blogs__n" aria-hidden>
                        {i + 1}
                      </span>
                      <span className="pb-blogs__body">
                        <span className="pb-blogs__line">
                          <span className="pb-blogs__name">{blog.title}</span>
                          {blog.date ? (
                            <time
                              className="pb-blogs__date"
                              dateTime={blog.date}
                            >
                              {shortBlogDate(blog.date)}
                            </time>
                          ) : null}
                          <span className="pb-blogs__by">{blog.author}</span>
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
                              e.target.value
                            )
                          }
                          aria-label="Highlight"
                        />
                        <textarea
                          className="pb-blogs__field pb-blogs__field--take"
                          rows={2}
                          value={blog.take}
                          onChange={(e) =>
                            patchBlogField(blog.id, "take", e.target.value)
                          }
                          aria-label="Your take"
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
                        {i + 1}
                      </span>
                      <span className="pb-blogs__body">
                        <span className="pb-blogs__line">
                          <span className="pb-blogs__name">{blog.title}</span>
                          {blog.date ? (
                            <time
                              className="pb-blogs__date"
                              dateTime={blog.date}
                            >
                              {shortBlogDate(blog.date)}
                            </time>
                          ) : null}
                          <span className="pb-blogs__by">{blog.author}</span>
                        </span>
                        <span className="pb-blogs__highlight">
                          {blog.highlight}
                        </span>
                        <span className="pb-blogs__take">{blog.take}</span>
                      </span>
                    </button>
                  )}
                </li>
              ))}
            </ol>
          </section>
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
