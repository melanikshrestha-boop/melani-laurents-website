"use client";

export function SceneryPrints() {
  return (
    <button
      type="button"
      className="portfolio-book-me"
      onClick={() => {
        const print = document.querySelector<HTMLButtonElement>(
          ".portfolio-gallery-print-order",
        );
        print?.scrollIntoView({ block: "center", behavior: "smooth" });
        print?.click();
      }}
    >
      Buy prints
    </button>
  );
}
