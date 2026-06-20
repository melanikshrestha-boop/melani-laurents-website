import Link from "next/link";
import type { PhotoCollection } from "@/data/photography-meta";

interface PortfolioPaginationProps {
  prev?: PhotoCollection;
  next?: PhotoCollection;
}

function PaginationArrow({ direction }: { direction: "prev" | "next" }) {
  return (
    <svg
      className={`portfolio-pagination-icon portfolio-pagination-icon--${direction}`}
      viewBox="0 0 9 16"
      aria-hidden="true"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeMiterlimit={10}
        points={direction === "next" ? "1.6,1.2 6.5,7.9 1.6,14.7" : "7.4,1.2 2.5,7.9 7.4,14.7"}
      />
    </svg>
  );
}

export function PortfolioPagination({ prev, next }: PortfolioPaginationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="portfolio-pagination" aria-label="Collection navigation">
      {prev ? (
        <Link
          href={`/photography/${prev.slug}`}
          className="portfolio-pagination-link portfolio-pagination-link--prev"
        >
          <PaginationArrow direction="prev" />
          <div className="portfolio-pagination-copy">
            <span className="portfolio-pagination-label">Previous</span>
            <h2 className="portfolio-pagination-title">{prev.title}</h2>
          </div>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/photography/${next.slug}`}
          className="portfolio-pagination-link portfolio-pagination-link--next"
        >
          <div className="portfolio-pagination-copy">
            <span className="portfolio-pagination-label">Next</span>
            <h2 className="portfolio-pagination-title">{next.title}</h2>
          </div>
          <PaginationArrow direction="next" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
