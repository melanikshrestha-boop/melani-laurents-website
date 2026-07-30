/**
 * Amazon product helpers for the public bookshelf.
 * Use product /dp/{ASIN} links (affiliate tag can be added later).
 * Cover art is derived from ASIN so it matches the product page.
 */

/** Extract ASIN from /dp/ASIN or /gp/product/ASIN URLs. */
export function extractAsin(url: string | undefined | null): string | null {
  if (!url) return null;
  const m = url.match(
    /(?:\/dp\/|\/gp\/product\/|\/product\/|ASIN=)([A-Z0-9]{10})/i
  );
  return m ? m[1].toUpperCase() : null;
}

/** Clean product URL (no tracking junk). Aff tag later. */
export function amazonProductUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}`;
}

/**
 * Product cover from ASIN — same art as the Amazon listing.
 * Several CDN patterns; P/ASIN is the classic ISBN/ASIN cover endpoint.
 */
export function amazonCoverUrl(asin: string): string {
  return `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX500_.jpg`;
}

export function amazonSearchUrl(title: string, author = ""): string {
  const q = `${title} ${author}`.trim();
  return `https://www.amazon.com/s?k=${encodeURIComponent(q)}`;
}

/** Best store URL: product page if ASIN known, else search. */
export function storeUrlForBook(opts: {
  asin?: string | null;
  href?: string | null;
  title?: string;
  author?: string;
}): string {
  const fromHref = extractAsin(opts.href || undefined);
  const asin = (opts.asin || fromHref || "").toUpperCase() || null;
  if (asin) return amazonProductUrl(asin);
  if (opts.href && opts.href.includes("amazon.com") && opts.href.includes("/dp/")) {
    // already a product URL without parseable ASIN — use cleaned if possible
    return opts.href.split("?")[0];
  }
  return amazonSearchUrl(opts.title || "book", opts.author || "");
}

export function coverUrlForBook(opts: {
  asin?: string | null;
  href?: string | null;
  coverUrl?: string | null;
  title?: string;
}): string | undefined {
  if (opts.coverUrl) return opts.coverUrl;
  const asin =
    (opts.asin || extractAsin(opts.href || undefined) || "").toUpperCase() ||
    null;
  if (asin) return amazonCoverUrl(asin);
  if (opts.title) {
    return `https://covers.openlibrary.org/b/title/${encodeURIComponent(opts.title)}-L.jpg?default=false`;
  }
  return undefined;
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
