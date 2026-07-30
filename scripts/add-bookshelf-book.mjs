#!/usr/bin/env node
/**
 * Resolve a book title → Amazon ASIN + product URL + cover metadata,
 * then add (or update) it in src/data/bookshelf-catalog.json.
 *
 * Usage:
 *   npm run bookshelf:add -- "Titan" "Ron Chernow"
 *   npm run bookshelf:add -- "Atomic Habits"
 *   npm run bookshelf:add -- --favorite "Zero to One" "Peter Thiel"
 *
 * Uses Open Library (free) to find ISBN-10 (works as Amazon ASIN for books).
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CATALOG_PATH = path.join(ROOT, "src/data/bookshelf-catalog.json");

function usage() {
  console.error(`Usage: npm run bookshelf:add -- [--favorite] "Title" ["Author"]`);
  process.exit(1);
}

function slugId(title, author) {
  const h = createHash("sha1")
    .update(`${title}|${author}`.toLowerCase())
    .digest("hex")
    .slice(0, 12);
  return `book-${h}`;
}

function isbn13To10(isbn13) {
  const clean = String(isbn13 || "").replace(/[^0-9Xx]/g, "");
  if (clean.length === 10) return clean.toUpperCase();
  if (clean.length !== 13 || !clean.startsWith("978")) return null;
  const core = clean.slice(3, 12);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += (10 - i) * Number(core[i]);
  const check = (11 - (sum % 11)) % 11;
  return core + (check === 10 ? "X" : String(check));
}

function pickAsin(isbnList = []) {
  // Prefer ISBN-10 (Amazon ASIN for books)
  for (const raw of isbnList) {
    const s = String(raw).replace(/[^0-9Xx]/g, "");
    if (s.length === 10) return s.toUpperCase();
  }
  for (const raw of isbnList) {
    const ten = isbn13To10(raw);
    if (ten) return ten;
  }
  return null;
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "celine-nova-bookshelf/1.0" },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

/**
 * Open Library: search → work → editions → best ISBN-10 ASIN
 */
async function resolveBook(title, author = "") {
  const q = [title, author].filter(Boolean).join(" ");
  const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=8`;
  const search = await fetchJson(searchUrl);
  const docs = search.docs || [];
  if (!docs.length) {
    throw new Error(`No Open Library results for “${q}”`);
  }

  // Prefer docs whose title roughly matches and author matches if provided
  const titleKey = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const authorKey = author.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const ranked = [...docs].sort((a, b) => {
    const at = String(a.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const bt = String(b.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const aScore =
      (at.includes(titleKey) || titleKey.includes(at) ? 5 : 0) +
      (authorKey &&
      (a.author_name || []).some((n) =>
        n.toLowerCase().includes(authorKey.split(" ")[0] || "")
      )
        ? 3
        : 0) +
      (a.ebook_access === "borrowable" ? 0 : 1);
    const bScore =
      (bt.includes(titleKey) || titleKey.includes(bt) ? 5 : 0) +
      (authorKey &&
      (b.author_name || []).some((n) =>
        n.toLowerCase().includes(authorKey.split(" ")[0] || "")
      )
        ? 3
        : 0);
    return bScore - aScore;
  });

  const best = ranked[0];
  const resolvedTitle = best.title || title;
  const resolvedAuthor = (best.author_name && best.author_name[0]) || author || "Unknown";

  // Direct ISBNs on search doc
  let asin = pickAsin(best.isbn || []);

  // Editions for better ASIN (prefer trade paperback / Vintage / etc.)
  if (!asin && best.key) {
    try {
      const workKey = best.key; // /works/OLxxxW
      const editions = await fetchJson(
        `https://openlibrary.org${workKey}/editions.json?limit=40`
      );
      const entries = editions.entries || [];
      // Prefer English print with isbn_10, skip pure audiobook when possible
      const scored = entries
        .map((e) => {
          const isbns = [
            ...(e.isbn_10 || []),
            ...(e.isbn_13 || []),
          ];
          const a = pickAsin(isbns);
          if (!a) return null;
          const pub = (e.publishers || []).join(" ").toLowerCase();
          const phys = (e.physical_format || "").toLowerCase();
          let score = 1;
          if (phys.includes("audio")) score -= 5;
          if (phys.includes("paperback") || phys.includes("hardcover")) score += 2;
          if (pub.includes("vintage") || pub.includes("penguin") || pub.includes("random"))
            score += 1;
          if ((e.covers || []).length) score += 1;
          return { asin: a, score, title: e.title };
        })
        .filter(Boolean)
        .sort((x, y) => y.score - x.score);
      if (scored[0]) asin = scored[0].asin;
    } catch {
      /* keep search-level asin */
    }
  }

  if (!asin) {
    throw new Error(
      `Found “${resolvedTitle}” but no ISBN/ASIN. Add asin manually in catalog.`
    );
  }

  return {
    title: resolvedTitle,
    source: resolvedAuthor,
    asin,
    href: `https://www.amazon.com/dp/${asin}`,
    coverHint: `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_SX500_.jpg`,
  };
}

function loadCatalog() {
  return JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
}

function saveCatalog(entries) {
  writeFileSync(CATALOG_PATH, JSON.stringify(entries, null, 2) + "\n", "utf8");
}

function titleKey(t) {
  return String(t)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function main() {
  const args = process.argv.slice(2).filter(Boolean);
  if (!args.length) usage();

  let favorite = false;
  const rest = [];
  for (const a of args) {
    if (a === "--favorite" || a === "-f") favorite = true;
    else rest.push(a);
  }
  if (!rest.length) usage();

  const title = rest[0];
  const author = rest.slice(1).join(" ");

  console.log(`Looking up: “${title}”${author ? ` by ${author}` : ""}…`);
  const resolved = await resolveBook(title, author);
  console.log(`Resolved: ${resolved.title} — ${resolved.source}`);
  console.log(`ASIN: ${resolved.asin}`);
  console.log(`Product: ${resolved.href}`);
  console.log(`Cover: ${resolved.coverHint}`);

  const catalog = loadCatalog();
  const key = titleKey(resolved.title);
  const inputKey = titleKey(title);
  const existingIdx = catalog.findIndex((e) => {
    if (e.kind !== "book") return false;
    const ek = titleKey(e.title);
    return (
      ek === key ||
      ek === inputKey ||
      ek.includes(inputKey) ||
      inputKey.includes(ek) ||
      ek.includes(key) ||
      key.includes(ek)
    );
  });

  const entry = {
    id:
      existingIdx >= 0
        ? catalog[existingIdx].id
        : slugId(resolved.title, resolved.source),
    kind: "book",
    title: resolved.title,
    source: resolved.source,
    loggedAt: new Date().toISOString().slice(0, 10),
    href: resolved.href,
    asin: resolved.asin,
  };
  if (favorite) {
    // Faves = only personal 5-star ratings
    entry.favorite = true;
    entry.rating = 5;
    entry.favoriteWhy =
      (existingIdx >= 0 && catalog[existingIdx].favoriteWhy) ||
      "Shout-out title.";
  } else if (existingIdx >= 0) {
    if (catalog[existingIdx].favorite) {
      entry.favorite = catalog[existingIdx].favorite;
      if (catalog[existingIdx].favoriteWhy) {
        entry.favoriteWhy = catalog[existingIdx].favoriteWhy;
      }
    }
    // Keep prior personal rating when re-adding / refreshing metadata
    if (catalog[existingIdx].rating != null) {
      entry.rating = catalog[existingIdx].rating;
    }
  }

  if (existingIdx >= 0) {
    const prev = catalog[existingIdx];
    // Keep a hand-picked product ASIN if already set (e.g. your Titan link)
    if (prev.asin && prev.asin !== entry.asin) {
      console.log(
        `Note: keeping existing ASIN ${prev.asin} (lookup suggested ${entry.asin}). Pass --replace-asin to override.`
      );
      if (!process.argv.includes("--replace-asin")) {
        entry.asin = prev.asin;
        entry.href = `https://www.amazon.com/dp/${prev.asin}`;
      }
    }
    catalog[existingIdx] = {
      ...prev,
      ...entry,
      title: prev.title.length >= entry.title.length ? prev.title : entry.title,
      id: prev.id,
    };
    console.log(`Updated existing entry: ${prev.id}`);
  } else {
    catalog.unshift(entry);
    console.log(`Added new entry: ${entry.id}`);
  }

  saveCatalog(catalog);
  console.log(`Saved ${catalog.length} entries → ${path.relative(ROOT, CATALOG_PATH)}`);
}

main().catch((err) => {
  console.error("Failed:", err.message || err);
  process.exit(1);
});
