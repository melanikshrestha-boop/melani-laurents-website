"use client";

import { BooksLibrary } from "./BooksLibrary";

/**
 * Exact Wonder Bookshelf UI (BooksLibrary.tsx), ported into the public site.
 * Read → Amazon / store link. No PDF or EPUB delivery.
 */
export function WonderBookshelfClient() {
  return (
    <div className="bl-public-wrap">
      <BooksLibrary onGo={() => undefined} workspacePages={[]} />
    </div>
  );
}
