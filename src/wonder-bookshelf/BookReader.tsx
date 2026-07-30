"use client";

/** Public site: no EPUB reader. Books open Amazon instead. */
export function BookReader(_props: {
  book: { title?: string; author?: string; externalUrl?: string; readerUrl?: string };
  onClose: () => void;
  startCfi?: string;
}) {
  return null;
}
