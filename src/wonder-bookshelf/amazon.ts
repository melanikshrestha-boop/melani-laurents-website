/** Store link only — never serve PDFs / Ocean EPUBs on the public site. */
export function amazonSearchUrl(title: string, author = ""): string {
  const q = `${title} ${author}`.trim();
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}`;
}

export function openBookStore(book: {
  title?: string;
  author?: string;
  externalUrl?: string;
}): void {
  const url =
    book.externalUrl ||
    amazonSearchUrl(book.title || "book", book.author || "");
  window.open(url, "_blank", "noopener,noreferrer");
}
