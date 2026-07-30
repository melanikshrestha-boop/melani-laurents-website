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
 * Google-Slides-style free move editor for the home landing frame.
 * Drag pieces. Scroll or size slider to scale. Temporary — remove when locked.
 */

const STORAGE_KEY = "celine-home-slide-layout-v2";

export type SlidePieceId =
  | "signature"
  | "location"
  | "socials"
  | "title"
  | "tagline"
  | "nav";

type AnchorX = "left" | "center" | "right";
type AnchorY = "top" | "center" | "bottom";

export type SlidePieceState = {
  x: number;
  y: number;
  ax: AnchorX;
  ay: AnchorY;
  scale: number;
  tracking: number;
};

export type Layout = Record<SlidePieceId, SlidePieceState>;

const DEFAULT_LAYOUT: Layout = {
  signature: { x: 3.5, y: 4, ax: "left", ay: "top", scale: 1, tracking: 0 },
  location: { x: 14.5, y: 5.2, ax: "left", ay: "top", scale: 1, tracking: 0.14 },
  socials: { x: 96.5, y: 4, ax: "right", ay: "top", scale: 1, tracking: 0 },
  title: { x: 50, y: 46, ax: "center", ay: "center", scale: 1, tracking: -0.045 },
  tagline: { x: 50, y: 62, ax: "center", ay: "center", scale: 1, tracking: 0 },
  nav: { x: 50, y: 93, ax: "center", ay: "bottom", scale: 1, tracking: 0.16 },
};

function loadLayout(): Layout {
  if (typeof window === "undefined") return DEFAULT_LAYOUT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LAYOUT;
    const parsed = JSON.parse(raw) as Partial<Layout>;
    const legacyBrand = (parsed as Partial<Layout> & { brand?: SlidePieceState }).brand;
    return {
      signature: {
        ...DEFAULT_LAYOUT.signature,
        ...(parsed.signature ?? legacyBrand),
      },
      location: {
        ...DEFAULT_LAYOUT.location,
        ...parsed.location,
      },
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
    "--slide-piece-tracking": `${piece.tracking}em`,
  } as CSSProperties;
}

type SlideCtx = {
  editMode: boolean;
  selected: SlidePieceId | null;
  layout: Layout;
  beginDrag: (id: SlidePieceId, event: ReactPointerEvent<HTMLElement>) => void;
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
  // Start in edit mode so you can drag immediately
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

  // Mark body so we can disable competing UI while editing
  useEffect(() => {
    document.documentElement.classList.toggle("is-slide-editing", editMode);
    document.body.classList.toggle("is-slide-editing", editMode);
    return () => {
      document.documentElement.classList.remove("is-slide-editing");
      document.body.classList.remove("is-slide-editing");
    };
  }, [editMode]);

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

  const setTracking = (tracking: number) => {
    if (!selected) return;
    setLayout((prev) => ({
      ...prev,
      [selected]: {
        ...prev[selected],
        tracking: Math.min(0.6, Math.max(-0.15, tracking)),
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
    setTracking,
  };
}

/** Design canvas — entire composition scales as one unit to fit the viewport */
export const SLIDE_DESIGN_W = 1440;
export const SLIDE_DESIGN_H = 900;

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
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const [fit, setFit] = useState(1);

  // Uniform scale so phone/desktop look like the same “slide” (illusion of one layout)
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const measure = () => {
      const w = el.clientWidth || window.innerWidth;
      const h = el.clientHeight || window.innerHeight;
      const next = Math.min(w / SLIDE_DESIGN_W, h / SLIDE_DESIGN_H);
      setFit(Number.isFinite(next) && next > 0 ? next : 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const dragRef = useRef<{
    id: SlidePieceId;
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  const beginDrag = useCallback(
    (id: SlidePieceId, event: ReactPointerEvent<HTMLElement>) => {
      if (!editMode) return;
      // Only primary button / touch
      if (event.button !== 0 && event.pointerType === "mouse") return;

      event.preventDefault();
      event.stopPropagation();

      onSelect(id);
      const piece = layoutRef.current[id];
      const el = event.currentTarget;
      dragRef.current = {
        id,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: piece.x,
        originY: piece.y,
      };

      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        /* some browsers throw if already released */
      }

      stageRef.current?.classList.add("is-dragging");
    },
    [editMode, onSelect],
  );

  const onPiecePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const drag = dragRef.current;
      const stage = stageRef.current;
      if (!drag || drag.pointerId !== event.pointerId || !stage) return;

      const rect = stage.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const dx = ((event.clientX - drag.startX) / rect.width) * 100;
      const dy = ((event.clientY - drag.startY) / rect.height) * 100;
      const nextX = Math.min(100, Math.max(0, drag.originX + dx));
      const nextY = Math.min(100, Math.max(0, drag.originY + dy));

      const current = layoutRef.current;
      onLayoutChange({
        ...current,
        [drag.id]: { ...current[drag.id], x: nextX, y: nextY },
      });
    },
    [onLayoutChange],
  );

  const endDrag = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    stageRef.current?.classList.remove("is-dragging");
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
  }, []);

  // Scroll on selected piece to resize
  useEffect(() => {
    if (!editMode || !selected) return;
    const onWheel = (event: WheelEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest?.(`[data-slide-id="${selected}"]`)) return;
      event.preventDefault();
      const delta = event.deltaY > 0 ? -0.05 : 0.05;
      const current = layoutRef.current;
      const piece = current[selected];
      const scale = Math.min(2.4, Math.max(0.45, +(piece.scale + delta).toFixed(3)));
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
      beginDrag,
      onPiecePointerMove,
      endDrag,
    }),
    [editMode, selected, layout, beginDrag, onPiecePointerMove, endDrag],
  );

  // Extend context type inline via cast for move/end handlers on pieces
  return (
    <SlideContext.Provider value={value as SlideCtx}>
      <div
        ref={viewportRef}
        className={`hub-slide-viewport${editMode ? " is-edit" : ""}`}
      >
        <div
          ref={stageRef}
          className={`hub-slide-stage${editMode ? " is-edit" : ""}`}
          style={
            {
              "--slide-fit": fit,
              width: SLIDE_DESIGN_W,
              height: SLIDE_DESIGN_H,
            } as CSSProperties
          }
          onPointerDown={(event) => {
            if (!editMode) return;
            // Click empty canvas → deselect
            if (event.target === event.currentTarget) onSelect(null);
          }}
        >
          {children}
        </div>
      </div>
    </SlideContext.Provider>
  );
}

// Internal extended context for move/end (keeps public SlideCtx small)
type SlideCtxFull = SlideCtx & {
  onPiecePointerMove: (event: ReactPointerEvent<HTMLElement>) => void;
  endDrag: (event: ReactPointerEvent<HTMLElement>) => void;
};

export function SlidePiece({
  id,
  children,
  className = "",
}: {
  id: SlidePieceId;
  children: ReactNode;
  className?: string;
}) {
  const ctx = useContext(SlideContext) as SlideCtxFull | null;
  if (!ctx) throw new Error("SlidePiece must be inside HomeSlideStage");
  const { editMode, selected, layout, beginDrag, onPiecePointerMove, endDrag } =
    ctx;
  const piece = layout[id];
  const isSelected = selected === id;

  return (
    <div
      data-slide-id={id}
      className={`hub-slide-piece hub-slide-piece--${id}${editMode ? " is-editable" : ""}${isSelected ? " is-selected" : ""}${className ? ` ${className}` : ""}`}
      style={pieceStyle(piece)}
      onPointerDown={(event) => beginDrag(id, event)}
      onPointerMove={onPiecePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {editMode ? (
        <span className="hub-slide-piece__label" aria-hidden>
          {id}
          {isSelected ? ` · ${Math.round(piece.scale * 100)}%` : ""}
        </span>
      ) : null}
      {/* Content MUST receive hits so the piece has a real target (not pass-through) */}
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
  tracking,
  onTracking,
}: {
  editMode: boolean;
  onToggleEdit: () => void;
  onReset: () => void;
  selected: SlidePieceId | null;
  scale: number;
  onScale: (scale: number) => void;
  tracking: number;
  onTracking: (tracking: number) => void;
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
            Click a blue box → drag. Scroll or slider = size.
          </span>
          {selected ? (
            <>
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
              {selected !== "signature" && selected !== "socials" ? (
                <label className="hub-slide-toolbar__scale">
                  Character spacing
                  <input
                    type="range"
                    min={-0.15}
                    max={0.6}
                    step={0.005}
                    value={tracking}
                    onChange={(event) => onTracking(Number(event.target.value))}
                  />
                  <output>{tracking.toFixed(3)}em</output>
                </label>
              ) : null}
            </>
          ) : (
            <span className="hub-slide-toolbar__hint is-warn">
              Click CELINE NOVA or any text to select it
            </span>
          )}
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
