import { createHash } from "node:crypto";
import { readdir, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * Same local EPUB scan as Wonder — used only to list titles for the shelf.
 * Reader URLs are never used on the public site (Amazon only).
 */

const SCAN_ROOTS = [
  path.join(os.homedir(), "Downloads"),
  path.join(os.homedir(), "Documents", "04-Books"),
  path.join(os.homedir(), "Documents", "Books"),
  path.join(os.homedir(), "Documents", "E-Books"),
];

const EPUB_RE = /\.epub$/i;
const OCEAN_RE = /^_?OceanofPDF\.com[_-](.+)\.epub$/i;

function bookIdFromPath(filePath: string) {
  return createHash("sha1").update(filePath).digest("hex").slice(0, 16);
}

function cleanTitle(value: string) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(/\b(And|Of|The|A|An|In|On|For|To|With)\b/g, (w) => w.toLowerCase())
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function parseEpubName(fileName: string) {
  const base = path.basename(fileName);
  const ocean = base.match(OCEAN_RE);
  if (ocean) {
    const body = ocean[1].replace(/_+/g, " ").replace(/\s+/g, " ").trim();
    const dash = body.match(/^(.+?)\s+-\s+(.+)$/);
    if (dash) {
      return {
        title: cleanTitle(dash[1]),
        author: cleanTitle(dash[2]),
        fromOcean: true,
      };
    }
    return { title: cleanTitle(body), author: "", fromOcean: true };
  }
  const noExt = base.replace(/\.epub$/i, "").replace(/[_-]+/g, " ").trim();
  const dash = noExt.match(/^(.+?)\s+-\s+(.+)$/);
  if (dash) {
    return {
      title: cleanTitle(dash[1]),
      author: cleanTitle(dash[2]),
      fromOcean: false,
    };
  }
  return {
    title: cleanTitle(noExt) || "Untitled EPUB",
    author: "",
    fromOcean: false,
  };
}

async function listDirSafe(dir: string) {
  try {
    return await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

async function collectEpubs(
  dir: string,
  depth = 0,
  out: string[] = []
): Promise<string[]> {
  if (depth > 3) return out;
  const entries = await listDirSafe(dir);
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await collectEpubs(full, depth + 1, out);
      continue;
    }
    if (entry.isFile() && EPUB_RE.test(entry.name)) out.push(full);
  }
  return out;
}

export async function GET() {
  try {
    const files: string[] = [];
    for (const root of SCAN_ROOTS) {
      await collectEpubs(root, 0, files);
    }
    const books = [];
    for (const filePath of files) {
      try {
        const st = await stat(filePath);
        const parsed = parseEpubName(filePath);
        const id = bookIdFromPath(filePath);
        books.push({
          id,
          title: parsed.title,
          author: parsed.author,
          fileName: path.basename(filePath),
          folder: path.basename(path.dirname(filePath)),
          size: st.size,
          mtimeMs: st.mtimeMs,
          fromOcean: parsed.fromOcean,
          // Listed for Wonder compatibility — public UI never opens this
          readerUrl: `/api/local-books/${id}/file`,
          format: "epub" as const,
          source: "local-file" as const,
        });
      } catch {
        /* skip unreadable */
      }
    }
    books.sort((a, b) => b.mtimeMs - a.mtimeMs);
    return NextResponse.json({
      source: "Local files",
      count: books.length,
      roots: SCAN_ROOTS,
      syncedAt: new Date().toISOString(),
      books,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "scan failed" },
      { status: 500 }
    );
  }
}
