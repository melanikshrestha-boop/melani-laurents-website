"use client";

import { useEffect, useState } from "react";
import { BooksLibrary } from "./BooksLibrary";

/**
 * Exact Wonder Bookshelf UI (BooksLibrary.tsx).
 * Client-only mount avoids SSR vs localStorage hydration mismatches.
 * Read → Amazon / store link. No PDF or EPUB delivery.
 */
export function WonderBookshelfClient() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="bl-public-wrap">
        <div
          className="bl"
          data-books-theme="light"
          style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}
        >
          <p style={{ opacity: 0.55, fontSize: 13, letterSpacing: "0.06em" }}>
            Opening bookshelf…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bl-public-wrap">
      <BooksLibrary onGo={() => undefined} workspacePages={[]} />
    </div>
  );
}
