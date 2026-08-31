/**
 * Full-page bookshelf edit overlay.
 * Live edits stick in localStorage; “Save to site” (dev) writes JSON on disk.
 */

import type { BookshelfEntry } from "@/data/bookshelf";
import type { ShelfBlog } from "./shelfBlogs";

export const SHELF_EDITOR_KEY = "celine-shelf-editor-v1";

export type CurrentRead = {
  title: string;
  author: string;
  href: string;
};

export type ShelfEditorState = {
  deletedBookIds: string[];
  categoryById: Record<string, string>;
  ratingById: Record<string, number>;
  deletedBlogIds: string[];
  blogById: Record<
    string,
    Partial<Pick<ShelfBlog, "highlight" | "take" | "title" | "author" | "url">>
  >;
  currentReads: CurrentRead[];
  folderViews: Record<string, string>;
  pageTitle: string;
};

export const DEFAULT_CURRENT_READS: CurrentRead[] = [
  {
    title: "the founders",
    author: "jimmy soni",
    href: "https://www.amazon.com/dp/1982153733",
  },
  {
    title: "man's search for meaning",
    author: "viktor e. frankl",
    href: "https://www.amazon.com/dp/0807014273",
  },
];

/** Sibling line under current reads — not a drive, not current. */
export const DEFAULT_NEXT_ON_THE_LIST: CurrentRead[] = [
  {
    title: "high growth handbook",
    author: "elad gil",
    href: "https://www.amazon.com/dp/1732265100",
  },
  {
    title: "hooked",
    author: "nir eyal",
    href: "https://www.amazon.com/dp/1591847788",
  },
  {
    title: "high output management",
    author: "andrew s. grove",
    href: "https://www.amazon.com/dp/0679762884",
  },
  {
    title: "get scalable",
    author: "ryan deiss",
    href: "https://www.amazon.com/dp/B0CG2QFZMZ",
  },
];

export const DEFAULT_FOLDER_VIEWS: Record<string, string> = {
  autobiographies: "ditch self-help books for autobiographies",
};

export const DEFAULT_EDITOR: ShelfEditorState = {
  deletedBookIds: [],
  categoryById: {},
  ratingById: {},
  deletedBlogIds: [],
  blogById: {},
  currentReads: DEFAULT_CURRENT_READS,
  folderViews: DEFAULT_FOLDER_VIEWS,
  pageTitle: "my bookshelf",
};

export function loadShelfEditor(): ShelfEditorState {
  if (typeof window === "undefined") return structuredClone(DEFAULT_EDITOR);
  try {
    const raw = localStorage.getItem(SHELF_EDITOR_KEY);
    if (!raw) return structuredClone(DEFAULT_EDITOR);
    const parsed = JSON.parse(raw) as Partial<ShelfEditorState>;
    return {
      ...structuredClone(DEFAULT_EDITOR),
      ...parsed,
      deletedBookIds: parsed.deletedBookIds || [],
      categoryById: parsed.categoryById || {},
      ratingById: parsed.ratingById || {},
      deletedBlogIds: parsed.deletedBlogIds || [],
      blogById: parsed.blogById || {},
      currentReads: parsed.currentReads?.length
        ? parsed.currentReads
        : DEFAULT_CURRENT_READS,
      folderViews: {
        ...DEFAULT_FOLDER_VIEWS,
        ...(parsed.folderViews || {}),
      },
      pageTitle: parsed.pageTitle?.trim() || DEFAULT_EDITOR.pageTitle,
    };
  } catch {
    return structuredClone(DEFAULT_EDITOR);
  }
}

export function saveShelfEditor(state: ShelfEditorState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SHELF_EDITOR_KEY, JSON.stringify(state));
}

/** Apply deletes / category / rating overlays to catalog entries */
export function applyCatalogOverlay(
  entries: BookshelfEntry[],
  editor: ShelfEditorState
): BookshelfEntry[] {
  const deleted = new Set(editor.deletedBookIds);
  return entries
    .filter((e) => !deleted.has(e.id))
    .map((e) => {
      let next = e;
      const cat = editor.categoryById[e.id];
      if (cat && cat !== e.category) {
        next = { ...next, category: cat };
      }
      const rating = editor.ratingById[e.id];
      if (rating != null && rating !== e.rating) {
        next = {
          ...next,
          rating: Math.max(1, Math.min(5, rating)) as 1 | 2 | 3 | 4 | 5,
        };
      }
      return next;
    });
}

export function applyBlogOverlay(
  blogs: ShelfBlog[],
  editor: ShelfEditorState
): ShelfBlog[] {
  const deleted = new Set(editor.deletedBlogIds);
  return blogs
    .filter((b) => !deleted.has(b.id))
    .map((b) => {
      const o = editor.blogById[b.id];
      if (!o) return b;
      return {
        ...b,
        ...Object.fromEntries(
          Object.entries(o).filter(([, v]) => typeof v === "string")
        ),
      } as ShelfBlog;
    })
    .filter(
      (b) =>
        b.visible === true ||
        (b.highlight.trim().length > 0 && b.take.trim().length > 0),
    );
}

/** Merge overlay into full catalog for permanent write */
export function materializeCatalog(
  base: BookshelfEntry[],
  editor: ShelfEditorState
): BookshelfEntry[] {
  return applyCatalogOverlay(base, editor);
}

export function materializeBlogs(
  base: ShelfBlog[],
  editor: ShelfEditorState
): ShelfBlog[] {
  return applyBlogOverlay(base, editor);
}
