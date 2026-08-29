"use client";

import {
  AlignCenterHorizontalIcon,
  AlignCenterVerticalIcon,
  ArrowCounterClockwiseIcon,
  ArrowsOutCardinalIcon,
  CheckIcon,
  CopyIcon,
  CornersOutIcon,
  MinusIcon,
  PlusIcon,
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@phosphor-icons/react";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

const STORAGE_KEY = "cn-layout-editor-v1";
const SESSION_KEY = "cn-layout-editor-active";
const SNAP_DISTANCE = 7;

type TextAlignment = "left" | "center" | "right";

type LayoutChange = {
  selector: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  minHeight?: number;
  fontSize?: number;
  textAlign?: TextAlignment;
};

type LayoutStore = Record<string, Record<string, LayoutChange>>;

type Selection = {
  element: HTMLElement;
  selector: string;
};

type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type PointerAction =
  | {
      mode: "move";
      startX: number;
      startY: number;
      originX: number;
      originY: number;
      startBox: Box;
    }
  | {
      mode: "resize";
      startX: number;
      startY: number;
      originWidth: number;
      originHeight: number;
    };

const TEXT_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a",
  "button",
  "label",
  "li",
  "dt",
  "dd",
  "th",
  "td",
  "figcaption",
  "blockquote",
  "input",
  "textarea",
  "[role='heading']",
  "[role='link']",
  "[role='button']",
  "[data-layout-editable]",
].join(",");

function readStore(): LayoutStore {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as LayoutStore) : {};
  } catch {
    return {};
  }
}

function writeStore(store: LayoutStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function asBox(rect: DOMRect): Box {
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function elementLabel(element: HTMLElement): string {
  const value =
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? element.value || element.placeholder
      : element.innerText || element.textContent || element.getAttribute("aria-label") || "Text";

  return value.replace(/\s+/g, " ").trim().slice(0, 90) || "Text";
}

function selectorFor(element: HTMLElement): string {
  const explicitId = element.dataset.layoutId;
  if (explicitId) {
    return `[data-layout-id="${CSS.escape(explicitId)}"]`;
  }

  if (element.id) return `#${CSS.escape(element.id)}`;

  const parts: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    const parent: HTMLElement | null = current.parentElement;
    const tag = current.tagName.toLowerCase();

    if (!parent) {
      parts.unshift(tag);
      break;
    }

    if (parent.id) {
      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current?.tagName,
      );
      const index = siblings.indexOf(current) + 1;
      parts.unshift(`${tag}:nth-of-type(${index})`);
      parts.unshift(`#${CSS.escape(parent.id)}`);
      break;
    }

    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName === current?.tagName,
    );
    const index = siblings.indexOf(current) + 1;
    parts.unshift(`${tag}:nth-of-type(${index})`);
    current = parent;
  }

  return parts.join(" > ");
}

function isUsableTextElement(element: HTMLElement): boolean {
  if (element.closest("[data-layout-editor]")) return false;
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  const hasText =
    element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement
      ? Boolean(element.value || element.placeholder)
      : Boolean((element.innerText || element.textContent || "").trim());

  return (
    hasText &&
    rect.width > 1 &&
    rect.height > 1 &&
    style.display !== "none" &&
    style.visibility !== "hidden"
  );
}

function isEditorTarget(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest("[data-layout-editor]"));
}

function findEditableElement(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof HTMLElement) || isEditorTarget(target)) {
    return null;
  }

  let current: HTMLElement | null = target;
  let inlineFallback: HTMLElement | null = null;

  while (current && current !== document.body) {
    if (current.matches(TEXT_SELECTOR) && isUsableTextElement(current)) {
      return current;
    }

    if (
      !inlineFallback &&
      current.matches("span,strong,em,small") &&
      isUsableTextElement(current)
    ) {
      inlineFallback = current;
    }

    current = current.parentElement;
  }

  return inlineFallback;
}

function findEditableAtPoint(
  target: EventTarget | null,
  clientX: number,
  clientY: number,
): HTMLElement | null {
  const direct = findEditableElement(target);
  if (direct) return direct;

  for (const element of document.elementsFromPoint(clientX, clientY)) {
    const editable = findEditableElement(element);
    if (editable) return editable;
  }

  const geometricMatches = Array.from(
    document.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
  )
    .filter((element) => {
      if (!isUsableTextElement(element)) return false;
      const rect = element.getBoundingClientRect();
      return (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      );
    })
    .sort((a, b) => {
      const aRect = a.getBoundingClientRect();
      const bRect = b.getBoundingClientRect();
      return aRect.width * aRect.height - bRect.width * bRect.height;
    });

  if (geometricMatches[0]) return geometricMatches[0];

  return null;
}

function applyChange(element: HTMLElement, change: LayoutChange) {
  element.classList.add("layout-editor-customized");
  element.dataset.layoutCustomized = "true";
  element.style.setProperty("--layout-editor-x", `${change.x ?? 0}px`);
  element.style.setProperty("--layout-editor-y", `${change.y ?? 0}px`);

  if (change.width !== undefined) {
    element.dataset.layoutSized = "true";
    element.style.setProperty("--layout-editor-width", `${change.width}px`);
  } else {
    delete element.dataset.layoutSized;
    element.style.removeProperty("--layout-editor-width");
  }

  if (change.minHeight !== undefined) {
    element.style.setProperty("--layout-editor-min-height", `${change.minHeight}px`);
  } else {
    element.style.removeProperty("--layout-editor-min-height");
  }

  if (change.fontSize !== undefined) {
    element.style.setProperty("--layout-editor-font-size", `${change.fontSize}px`);
  } else {
    element.style.removeProperty("--layout-editor-font-size");
  }

  if (change.textAlign !== undefined) {
    element.style.setProperty("--layout-editor-text-align", change.textAlign);
  } else {
    element.style.removeProperty("--layout-editor-text-align");
  }
}

function clearChange(element: HTMLElement) {
  element.classList.remove("layout-editor-customized");
  delete element.dataset.layoutCustomized;
  delete element.dataset.layoutSized;
  element.style.removeProperty("--layout-editor-x");
  element.style.removeProperty("--layout-editor-y");
  element.style.removeProperty("--layout-editor-width");
  element.style.removeProperty("--layout-editor-min-height");
  element.style.removeProperty("--layout-editor-font-size");
  element.style.removeProperty("--layout-editor-text-align");
}

export function LayoutEditor() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [selectedChange, setSelectedChange] = useState<LayoutChange | null>(null);
  const [selectionBox, setSelectionBox] = useState<Box | null>(null);
  const [hoverBox, setHoverBox] = useState<Box | null>(null);
  const [guides, setGuides] = useState({ horizontal: false, vertical: false });
  const [copied, setCopied] = useState(false);

  const storeRef = useRef<LayoutStore>({});
  const selectionRef = useRef<Selection | null>(null);
  const selectedChangeRef = useRef<LayoutChange | null>(null);
  const pointerActionRef = useRef<PointerAction | null>(null);
  const pathnameRef = useRef(pathname);

  const syncSelectionBox = useCallback(() => {
    const current = selectionRef.current;
    setSelectionBox(current ? asBox(current.element.getBoundingClientRect()) : null);
  }, []);

  const persistStore = useCallback(() => {
    writeStore(storeRef.current);
  }, []);

  const updateChange = useCallback(
    (patch: Partial<LayoutChange>, persist = true) => {
      const currentSelection = selectionRef.current;
      if (!currentSelection) return;

      const pageKey = pathnameRef.current;
      const page = (storeRef.current[pageKey] ??= {});
      const previous =
        page[currentSelection.selector] ??
        ({
          selector: currentSelection.selector,
          label: elementLabel(currentSelection.element),
        } satisfies LayoutChange);
      const next = { ...previous, ...patch };

      page[currentSelection.selector] = next;
      selectedChangeRef.current = next;
      setSelectedChange(next);
      applyChange(currentSelection.element, next);
      window.requestAnimationFrame(syncSelectionBox);

      if (persist) persistStore();
    },
    [persistStore, syncSelectionBox],
  );

  const selectElement = useCallback(
    (element: HTMLElement) => {
      const selector = selectorFor(element);
      const nextSelection = { element, selector };
      const stored = storeRef.current[pathnameRef.current]?.[selector] ?? null;

      selectionRef.current = nextSelection;
      selectedChangeRef.current = stored;
      setSelection(nextSelection);
      setSelectedChange(stored);
      setSelectionBox(asBox(element.getBoundingClientRect()));
      setHoverBox(null);
    },
    [],
  );

  const deselect = useCallback(() => {
    selectionRef.current = null;
    selectedChangeRef.current = null;
    pointerActionRef.current = null;
    setSelection(null);
    setSelectedChange(null);
    setSelectionBox(null);
    setGuides({ horizontal: false, vertical: false });
  }, []);

  const beginMove = useCallback((clientX: number, clientY: number) => {
    const currentSelection = selectionRef.current;
    if (!currentSelection) return;
    const currentChange = selectedChangeRef.current;
    pointerActionRef.current = {
      mode: "move",
      startX: clientX,
      startY: clientY,
      originX: currentChange?.x ?? 0,
      originY: currentChange?.y ?? 0,
      startBox: asBox(currentSelection.element.getBoundingClientRect()),
    };
    document.body.classList.add("layout-editor-dragging");
  }, []);

  const beginResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const currentSelection = selectionRef.current;
      if (!currentSelection) return;
      const rect = currentSelection.element.getBoundingClientRect();
      pointerActionRef.current = {
        mode: "resize",
        startX: event.clientX,
        startY: event.clientY,
        originWidth: selectedChangeRef.current?.width ?? rect.width,
        originHeight: selectedChangeRef.current?.minHeight ?? rect.height,
      };
      document.body.classList.add("layout-editor-dragging");
    },
    [],
  );

  const stopEditing = useCallback(() => {
    window.sessionStorage.removeItem(SESSION_KEY);
    const url = new URL(window.location.href);
    url.searchParams.delete("layout");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    setActive(false);
    deselect();
  }, [deselect]);

  const resetSelection = useCallback(() => {
    const currentSelection = selectionRef.current;
    if (!currentSelection) return;
    const page = storeRef.current[pathnameRef.current];
    if (page) delete page[currentSelection.selector];
    clearChange(currentSelection.element);
    selectedChangeRef.current = null;
    setSelectedChange(null);
    persistStore();
    window.requestAnimationFrame(syncSelectionBox);
  }, [persistStore, syncSelectionBox]);

  const setAlignment = useCallback(
    (textAlign: TextAlignment) => updateChange({ textAlign }),
    [updateChange],
  );

  const changeFontSize = useCallback(
    (amount: number) => {
      const currentSelection = selectionRef.current;
      if (!currentSelection) return;
      const computed = Number.parseFloat(
        window.getComputedStyle(currentSelection.element).fontSize,
      );
      const base = selectedChangeRef.current?.fontSize ?? computed;
      updateChange({ fontSize: Math.max(6, Math.min(240, base + amount)) });
    },
    [updateChange],
  );

  const centerSelection = useCallback(
    (axis: "horizontal" | "vertical") => {
      const currentSelection = selectionRef.current;
      if (!currentSelection) return;
      const rect = currentSelection.element.getBoundingClientRect();
      const current = selectedChangeRef.current;

      if (axis === "horizontal") {
        updateChange({
          x: (current?.x ?? 0) + window.innerWidth / 2 - (rect.left + rect.width / 2),
        });
      } else {
        updateChange({
          y: (current?.y ?? 0) + window.innerHeight / 2 - (rect.top + rect.height / 2),
        });
      }
    },
    [updateChange],
  );

  const copyLayout = useCallback(async () => {
    const page = storeRef.current[pathnameRef.current] ?? {};
    const payload = JSON.stringify(
      { pathname: pathnameRef.current, elements: Object.values(page) },
      null,
      2,
    );

    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      window.prompt("Copy layout", payload);
    }
  }, []);

  useEffect(() => {
    storeRef.current = readStore();
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("layout");

    if (mode === "edit") window.sessionStorage.setItem(SESSION_KEY, "true");
    if (mode === "off") window.sessionStorage.removeItem(SESSION_KEY);

    const frame = window.requestAnimationFrame(() => {
      setActive(
        mode === "edit" ||
          (mode !== "off" && window.sessionStorage.getItem(SESSION_KEY) === "true"),
      );
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    pathnameRef.current = pathname;

    const applyPage = () => {
      document
        .querySelectorAll<HTMLElement>("[data-layout-customized='true']")
        .forEach(clearChange);

      const page = storeRef.current[pathname] ?? {};
      Object.values(page).forEach((change) => {
        try {
          const element = document.querySelector<HTMLElement>(change.selector);
          if (element) applyChange(element, change);
        } catch {
          // A changed DOM can invalidate an old selector. Keep the rest usable.
        }
      });
    };

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      deselect();
      secondFrame = window.requestAnimationFrame(applyPage);
    });
    const lateApply = window.setTimeout(applyPage, 350);

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(lateApply);
    };
  }, [deselect, pathname]);

  useEffect(() => {
    document.body.classList.toggle("layout-editor-active", active);
    return () => document.body.classList.remove("layout-editor-active");
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) return;
      const target = event.target;
      if (isEditorTarget(target)) return;

      const element = findEditableAtPoint(target, event.clientX, event.clientY);
      if (!element) {
        deselect();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      if (selectionRef.current?.element !== element) selectElement(element);
      beginMove(event.clientX, event.clientY);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const action = pointerActionRef.current;
      if (!action) {
        if (isEditorTarget(event.target)) {
          setHoverBox(null);
          return;
        }
        const element = findEditableAtPoint(
          event.target,
          event.clientX,
          event.clientY,
        );
        setHoverBox(
          element && element !== selectionRef.current?.element
            ? asBox(element.getBoundingClientRect())
            : null,
        );
        return;
      }

      event.preventDefault();

      if (action.mode === "resize") {
        updateChange(
          {
            width: Math.max(48, action.originWidth + event.clientX - action.startX),
            minHeight: Math.max(18, action.originHeight + event.clientY - action.startY),
          },
          false,
        );
        return;
      }

      let deltaX = event.clientX - action.startX;
      let deltaY = event.clientY - action.startY;
      const movingCenterX = action.startBox.left + deltaX + action.startBox.width / 2;
      const movingCenterY = action.startBox.top + deltaY + action.startBox.height / 2;
      const snapX = Math.abs(movingCenterX - window.innerWidth / 2) <= SNAP_DISTANCE;
      const snapY = Math.abs(movingCenterY - window.innerHeight / 2) <= SNAP_DISTANCE;

      if (snapX) deltaX += window.innerWidth / 2 - movingCenterX;
      if (snapY) deltaY += window.innerHeight / 2 - movingCenterY;

      setGuides({ horizontal: snapY, vertical: snapX });
      updateChange(
        { x: action.originX + deltaX, y: action.originY + deltaY },
        false,
      );
    };

    const handlePointerUp = () => {
      if (!pointerActionRef.current) return;
      pointerActionRef.current = null;
      document.body.classList.remove("layout-editor-dragging");
      setGuides({ horizontal: false, vertical: false });
      persistStore();
    };

    const handleClick = (event: MouseEvent) => {
      if (isEditorTarget(event.target)) return;
      if (findEditableAtPoint(event.target, event.clientX, event.clientY)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        deselect();
        return;
      }

      if (!selectionRef.current || !event.key.startsWith("Arrow")) return;
      event.preventDefault();
      const amount = event.shiftKey ? 10 : 1;
      const current = selectedChangeRef.current;
      const movement = {
        ArrowLeft: { x: (current?.x ?? 0) - amount },
        ArrowRight: { x: (current?.x ?? 0) + amount },
        ArrowUp: { y: (current?.y ?? 0) - amount },
        ArrowDown: { y: (current?.y ?? 0) + amount },
      }[event.key];
      if (movement) updateChange(movement);
    };

    const handleViewportChange = () => syncSelectionBox();

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("pointermove", handlePointerMove, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("pointerup", handlePointerUp, true);
    window.addEventListener("pointercancel", handlePointerUp, true);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("pointermove", handlePointerMove, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("pointerup", handlePointerUp, true);
      window.removeEventListener("pointercancel", handlePointerUp, true);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [
    active,
    beginMove,
    deselect,
    persistStore,
    selectElement,
    syncSelectionBox,
    updateChange,
  ]);

  if (!active) return null;

  const computedFontSize = selection
    ? Number.parseFloat(window.getComputedStyle(selection.element).fontSize)
    : 0;
  const activeAlignment =
    selectedChange?.textAlign ??
    (selection
      ? (window.getComputedStyle(selection.element).textAlign as TextAlignment)
      : "left");

  return (
    <div data-layout-editor>
      {hoverBox ? (
        <div
          className="layout-editor-hover"
          style={{
            left: hoverBox.left,
            top: hoverBox.top,
            width: hoverBox.width,
            height: hoverBox.height,
          }}
        />
      ) : null}

      {selectionBox ? (
        <div
          className="layout-editor-selection"
          style={{
            left: selectionBox.left,
            top: selectionBox.top,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        >
          <button
            type="button"
            className="layout-editor-selection__move"
            aria-label="Move text box"
            title="Move text box"
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();
              beginMove(event.clientX, event.clientY);
            }}
          >
            <ArrowsOutCardinalIcon size={14} weight="bold" />
          </button>
          <button
            type="button"
            className="layout-editor-selection__resize"
            aria-label="Resize text box"
            title="Resize text box"
            onPointerDown={beginResize}
          >
            <CornersOutIcon size={14} weight="bold" />
          </button>
        </div>
      ) : null}

      {guides.vertical ? <div className="layout-editor-guide layout-editor-guide--v" /> : null}
      {guides.horizontal ? <div className="layout-editor-guide layout-editor-guide--h" /> : null}

      <div className="layout-editor-toolbar" role="toolbar" aria-label="Text layout tools">
        <button
          type="button"
          aria-label="Align text left"
          title="Align text left"
          aria-pressed={activeAlignment === "left"}
          disabled={!selection}
          onClick={() => setAlignment("left")}
        >
          <TextAlignLeftIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Align text center"
          title="Align text center"
          aria-pressed={activeAlignment === "center"}
          disabled={!selection}
          onClick={() => setAlignment("center")}
        >
          <TextAlignCenterIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Align text right"
          title="Align text right"
          aria-pressed={activeAlignment === "right"}
          disabled={!selection}
          onClick={() => setAlignment("right")}
        >
          <TextAlignRightIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Center text box horizontally"
          title="Center text box horizontally"
          disabled={!selection}
          onClick={() => centerSelection("horizontal")}
        >
          <AlignCenterHorizontalIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Center text box vertically"
          title="Center text box vertically"
          disabled={!selection}
          onClick={() => centerSelection("vertical")}
        >
          <AlignCenterVerticalIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Decrease font size"
          title="Decrease font size"
          disabled={!selection}
          onClick={() => changeFontSize(-1)}
        >
          <MinusIcon size={17} />
        </button>
        <output className="layout-editor-toolbar__size" aria-label="Font size">
          {selection ? Math.round(computedFontSize) : "--"}
        </output>
        <button
          type="button"
          aria-label="Increase font size"
          title="Increase font size"
          disabled={!selection}
          onClick={() => changeFontSize(1)}
        >
          <PlusIcon size={17} />
        </button>
        <button
          type="button"
          aria-label="Reset selected text box"
          title="Reset selected text box"
          disabled={!selection}
          onClick={resetSelection}
        >
          <ArrowCounterClockwiseIcon size={18} />
        </button>
        <button
          type="button"
          aria-label="Copy this page layout"
          title="Copy this page layout"
          onClick={copyLayout}
        >
          {copied ? <CheckIcon size={18} weight="bold" /> : <CopyIcon size={18} />}
        </button>
        <button
          type="button"
          aria-label="Finish layout editing"
          title="Finish layout editing"
          onClick={stopEditing}
        >
          <CheckIcon size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}
