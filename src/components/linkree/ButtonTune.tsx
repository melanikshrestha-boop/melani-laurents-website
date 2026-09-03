"use client";

import { useEffect } from "react";

const KEY = "linkree-button-tune";

type Size = { w: number; h: number };

function allowed() {
  const host = window.location.hostname;
  if (host === "127.0.0.1" || host === "localhost") return true;
  return new URLSearchParams(window.location.search).has("tune");
}

function readStore(): Size | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Size;
    if (parsed.w >= 80 && parsed.h >= 28) return parsed;
  } catch {
    /* ignore */
  }
  return null;
}

function apply(stack: HTMLElement, size: Size) {
  stack.dataset.tuned = "1";
  stack.style.setProperty("--tune-w", `${Math.round(size.w)}px`);
  stack.style.setProperty("--tune-h", `${Math.round(size.h)}px`);
}

function measure(stack: HTMLElement, button: HTMLElement): Size {
  const br = button.getBoundingClientRect();
  return { w: Math.round(br.width), h: Math.round(br.height) };
}

/** Local-only: double-click a pill, type `width x height`, Enter. */
export function ButtonTune() {
  useEffect(() => {
    if (!allowed()) return;
    const stack = document.querySelector<HTMLElement>(".buttons");
    if (!stack) return;

    const stored = readStore();
    if (stored) apply(stack, stored);

    let navTimer = 0;
    let box: HTMLFormElement | null = null;

    const closeBox = () => {
      box?.remove();
      box = null;
    };

    const openBox = (button: HTMLElement) => {
      closeBox();
      const now = measure(stack, button);
      const form = document.createElement("form");
      form.className = "button-tune";
      form.setAttribute("autocomplete", "off");
      const input = document.createElement("input");
      input.type = "text";
      input.value = `${now.w} × ${now.h}`;
      input.setAttribute("aria-label", "Button width × height");
      form.appendChild(input);
      stack.appendChild(form);
      box = form;
      input.focus();
      input.select();

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nums = input.value.match(/\d+/g);
        if (!nums || nums.length < 2) {
          closeBox();
          return;
        }
        const next = {
          w: Math.min(520, Math.max(80, Number(nums[0]))),
          h: Math.min(120, Math.max(28, Number(nums[1]))),
        };
        apply(stack, next);
        localStorage.setItem(KEY, JSON.stringify(next));
        closeBox();
      });

      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeBox();
        }
      });
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || !stack.contains(link) || box) return;
      event.preventDefault();
      window.clearTimeout(navTimer);
      navTimer = window.setTimeout(() => {
        window.open(link.href, link.getAttribute("target") || "_self", "noopener");
      }, 280);
    };

    const onDblClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a");
      if (!link || !stack.contains(link)) return;
      event.preventDefault();
      window.clearTimeout(navTimer);
      openBox(link);
    };

    stack.addEventListener("click", onClick, true);
    stack.addEventListener("dblclick", onDblClick, true);
    return () => {
      window.clearTimeout(navTimer);
      closeBox();
      stack.removeEventListener("click", onClick, true);
      stack.removeEventListener("dblclick", onDblClick, true);
    };
  }, []);

  return null;
}
