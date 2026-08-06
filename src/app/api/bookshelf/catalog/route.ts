import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Owner bookshelf save (local / trusted only).
 * Writes catalog + shelf-blogs JSON so edit-mode deletes persist on disk.
 */
const CATALOG = path.join(
  process.cwd(),
  "src/data/bookshelf-catalog.json"
);
const BLOGS = path.join(process.cwd(), "src/data/shelf-blogs.json");

function allowed(req: Request): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const secret = process.env.BOOKSHELF_EDIT_SECRET;
  if (!secret) return false;
  return req.headers.get("x-bookshelf-edit") === secret;
}

export async function GET() {
  try {
    const [catalog, blogs] = await Promise.all([
      readFile(CATALOG, "utf8"),
      readFile(BLOGS, "utf8"),
    ]);
    return NextResponse.json({
      catalog: JSON.parse(catalog),
      blogs: JSON.parse(blogs),
    });
  } catch (e) {
    return NextResponse.json(
      { error: String(e instanceof Error ? e.message : e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!allowed(req)) {
    return NextResponse.json(
      {
        error:
          "Save to disk only works in local dev (or with BOOKSHELF_EDIT_SECRET).",
      },
      { status: 403 }
    );
  }

  try {
    const body = (await req.json()) as {
      catalog?: unknown;
      blogs?: unknown;
    };
    if (!Array.isArray(body.catalog)) {
      return NextResponse.json(
        { error: "catalog must be an array" },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.blogs)) {
      return NextResponse.json(
        { error: "blogs must be an array" },
        { status: 400 }
      );
    }

    await writeFile(
      CATALOG,
      JSON.stringify(body.catalog, null, 2) + "\n",
      "utf8"
    );
    await writeFile(
      BLOGS,
      JSON.stringify(body.blogs, null, 2) + "\n",
      "utf8"
    );

    return NextResponse.json({
      ok: true,
      catalogCount: body.catalog.length,
      blogCount: body.blogs.length,
    });
  } catch (e) {
    return NextResponse.json(
      { error: String(e instanceof Error ? e.message : e) },
      { status: 500 }
    );
  }
}
