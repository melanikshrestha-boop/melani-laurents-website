import type { Metadata } from "next";

/**
 * Canonical tab mark for every route: square Eren.
 * Never a cream/gold C. Never icon.tsx. Never src/app/favicon.ico
 * (Next hashes that ICO and Chrome prefers the C).
 * New filename when Chrome burns the last one.
 */
export const EREN_TAB_FILE = "/eren-forever.png";
export const EREN_TAB_SRC = `${EREN_TAB_FILE}?v=forever1`;

export const erenTabIcons: NonNullable<Metadata["icons"]> = {
  icon: [
    { url: EREN_TAB_SRC, type: "image/png", sizes: "256x256" },
    { url: EREN_TAB_SRC, type: "image/png", sizes: "48x48" },
    { url: EREN_TAB_SRC, type: "image/png", sizes: "32x32" },
  ],
  apple: [{ url: EREN_TAB_SRC, sizes: "180x180", type: "image/png" }],
  shortcut: [{ url: EREN_TAB_SRC, type: "image/png" }],
};
