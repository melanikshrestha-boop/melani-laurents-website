"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

/**
 * Temporary Google-Slides-style free move editor for the home landing frame.
 * Drag pieces. Scroll or use the size slider to scale. Remove when locked.
 */

const STORAGE_KEY = "celine-home-slide-layout-v1";

export type SlidePieceId =
  | "brand"
  | "socials"
  | "title"
  | "tagline"
  | "nav";

type AnchorX = "left" | "center" | "right";
type AnchorY = "top" | "center" | "bottom";

export type SlidePieceState = {
  /** 0–100 % of stage width */
  x: number;
  /** 0–100 % of stage height */
  y: number;
  ax: AnchorX;
  ay: AnchorY;
  /** Scale of the piece (text / icons) */
  scale: number;
};

export type Layout = Record<SlidePieceId, SlidePieceState>;

const DEFAULT_LAYOUT: Layout = {
  brand: { x: 3.5, y: 4, ax: "left", ay: "top", scale: 1 },
  socials: { x: 96.5, y: 4, ax: "right", ay: "top", scale: 1 },
  title: { x: 50, y: 46, ax: "center", ay: "center", scale: 1 },
  tagline: { x: 50, y: 62, ax: "center", ay: "center", scale: 1 },
  nav: { x: 50, y: 93, ax: "center", ay: "bottom", scale: 1 },
};

function loadLayout(): Layout {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as Partial<Layout>;
    return {
      brand: { ...DEFAULT_LAYOUT.brand, ...parsed.brand },
      socials: { ...DEFAULT_LAYOUT.socials, ...parsed.socials },
      title: { ...DEFAULT_LAYOUT.title, ...parsed.title },
      tagline: { ...DEFAULT_LAYOUT.tagline, ...parsed.tagline },
      nav: { ...DEFAULT_LAYOUT.nav, ...parsed.nav },
    };
  } catch {
    return DEFAULT_LAYOUT;
  }
}

function saveLayout(layout: Layout) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
  } catch {
    /* private mode */
  }
}

function pieceStyle(piece: SlidePieceState): CSSProperties {
  let tx = "0";
  let ty = "0";
  if (piece.ax === "center") tx = "-50%";
  if (piece.ax === "right") tx = "-100%";
  if (piece.ay === "center") ty = "-50%";
  if (piece.ay === "bottom") ty = "-100%";

  const originX =
    piece.ax === "left" ? "left" : piece.ax === "right" ? "right" : "center";
  const originY =
    piece.ay === "top" ? "top" : piece.ay === "bottom" ? "bottom" : "center";

  return {
    left: `${piece.x}%`,
    top: `${piece.y}%`,
    transform: `translate(${tx}, ${ty}) scale(${piece.scale})`,
    transformOrigin: `${originX} ${originY}`,
  };
}

type SlideCtx = {
  editMode: boolean;
  selected: SlidePieceId | null;
  layout: Layout;
  select: (id: SlidePieceId | null) => void;
  beginDrag: (id: SlidePieceId, event: ReactPointerEvent) => void;
  stageRef: React.RefObject<HTMLDivElement | null>;
};

const SlideContext = createContext<SlideCtx | null>(null);

function useSlide() {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error("SlidePiece must be inside HomeSlideStage");
  return ctx;
}

export function useHomeSlideLayout() {
  const [layout, setLayout] = useState<Layout>(DEFAULT_LAYOUT);
  const [ready, setReady] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [selected, setSelected] = useState<SlidePieceId | null>(null);

  useEffect(() => {
    setLayout(loadLayout());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveLayout(layout);
  }, [layout, ready]);

  const reset = () => {
    setLayout(DEFAULT_LAYOUT);
    setSelected(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const setScale = (scale: number) => {
    if (!selected) return;
    setLayout((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        scale: Math.min(2.4, Math.max(0.45, scale)),
      },
    }));
  };

  return {
    layout,
    setLayout,
    reset,
    ready,
    editMode,
    setEditMode,
    selected,
    setSelected,
    setScale,
  };
}

export function HomeSlideStage({
  editMode,
  selected,
  layout,
  onSelect,
  onLayoutChange,
  children,
}: {
  editMode: boolean;
  selected: SlidePieceId | null;
  layout: Layout;
  onSelect: (id: SlidePieceId | null) => void;
  onLayoutChange: (layout: Layout) => void;
  children: ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    id: SlidePieceId;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  const onPointerMove = useCallback(
    (event: PointerEvent) => {
      const drag = dragRef.current;
      const stage = stageRef.current;
      if (!drag || !stage) return;
      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dx = ((event.clientX - drag.startX) / rect.width) * 100;
      const dy = ((event.clientY - drag.startY) / rect.height) * 100;
      const nextX = Math.min(102, Math.max(-2, drag.originX + dx));
      const nextY = Math.min(102, Math.max(-2, drag.originY + dy));
      const current = layoutRef.current;
      onLayoutChange({
        ...current,
        [drag.id]: { ...current[drag.id], x: nextX, y: nextY },
      });
    },
    [onLayoutChange],
  );

  const endDrag = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    stageRef.current?.classList.remove("is-dragging");
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", endDrag);
  }, [onPointerMove]);

  const beginDrag = useCallback(
    (id: SlidePieceId, event: ReactPointerEvent) => {
      if (!editMode) return;
      event.preventDefault();
      event.stopPropagation();
      onSelect(id);
      const piece = layoutRef.current[id];
      dragRef.current = {
        id,
        startX: event.clientX,
        startY: event.clientY,
        originX: piece.x,
        originY: piece.y,
      };
      stageRef.current?.classList.add("is-dragging");
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag);
    },
    [editMode, onSelect, onPointerMove, endDrag],
  );

  useEffect(
    () => () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
    },
    [onPointerMove, endDrag],
  );

  // Scroll on selected piece to resize
  useEffect(() => {
    if (!editMode || !selected) return;
    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.(`[data-slide-id="${selected}"]`)) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.04 : 0.04;
      const current = layoutRef.current;
      const piece = current[selected];
      const scale = Math.min(2.4, Math.max(0.45, piece.scale + delta));
      onLayoutChange({
        ...current,
        [selected]: { ...piece, scale },
      });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [editMode, selected, onLayoutChange]);

  const value = useMemo(
    () => ({
      editMode,
      selected,
      layout,
      select: onSelect,
      beginDrag,
      stageRef,
    }),
    [editMode, selected, layout, onSelect, beginDrag],
  );

  return (
    <SlideContext.Provider value={value}>
      <div
        ref={stageRef}
        className={`hub-slide-stage${editMode ? " is-edit" : ""}`}
        onPointerDown={() => {
          if (editMode) onSelect(null);
        }}
      >
        {children}
      </div>
    </SlideContext.Provider>
  );
}

export function SlidePiece({
  id,
  children,
  className = "",
}: {
  id: SlidePieceId;
  children: ReactNode;
  className?: string;
}) {
  const { editMode, selected, layout, beginDrag } = useSlide();
  const piece = layout[id];
  const isSelected = selected === id;

  return (
    <div
      data-slide-id={id}
      className={`hub-slide-piece hub-slide-piece--${id}${editMode ? " is-editable" : ""}${isSelected ? " is-selected" : ""}${className ? ` ${className}` : ""}`}
      style={pieceStyle(piece)}
      onPointerDown={(event) => beginDrag(id, event)}
    >
      {editMode ? (
        <span className="hub-slide-piece__label" aria-hidden>
          {id}
          {isSelected ? ` · ${Math.round(piece.scale * 100)}%` : ""}
        </span>
      ) : null}
      <div className="hub-slide-piece__content">{children}</div>
    </div>
  );
}

export function HomeSlideToolbar({
  editMode,
  onToggleEdit,
  onReset,
  selected,
  scale,
  onScale,
}: {
  editMode: boolean;
  onToggleEdit: () => void;
  onReset: () => void;
  selected: SlidePieceId | null;
  scale: number;
  onScale: (scale: number) => void;
}) {
  return (
    <div className="hub-slide-toolbar" role="toolbar" aria-label="Page editor">
      <button
        type="button"
        className={`hub-slide-toolbar__btn${editMode ? " is-on" : ""}`}
        onClick={onToggleEdit}
      >
        {editMode ? "Done editing" : "Edit layout"}
      </button>
      {editMode ? (
        <>
          <span className="hub-slide-toolbar__hint">
            Drag anything · scroll on it to resize · empty space deselects
          </span>
          {selected ? (
            <label className="hub-slide-toolbar__scale">
              Size
              <input
                type="range"
                min={0.45}
                max={2.4}
                step={0.02}
                value={scale}
                onChange={(event) => onScale(Number(event.target.value))}
              />
              <output>{Math.round(scale * 100)}%</output>
            </label>
          ) : null}
          <button
            type="button"
            className="hub-slide-toolbar__btn is-quiet"
            onClick={onReset}
          >
            Reset layout
          </button>
        </>
      ) : null}
    </div>
  );
}
