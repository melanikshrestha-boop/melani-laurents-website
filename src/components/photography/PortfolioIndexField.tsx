import Image from "next/image";
import Link from "next/link";
import { LennonQuote } from "@/components/photography/LennonQuote";

const ART_CATEGORIES = [
  {
    label: "Photo",
    href: "/photography/scenery",
  },
  {
    label: "Film",
    href: "/photography/film",
  },
  {
    label: "Writing",
    href: "/photography/poem",
  },
  {
    label: "Sketches",
    href: "/photography/sketches",
  },
] as const;

/** Greene St Fendi / Spring St Loewe — the only Art index backgrounds. */
const INDEX_BACKGROUNDS = [
  {
    src: "/photography/index/scenery-hero.jpg",
    className: "portfolio-hover-bg--scenery",
  },
  {
    src: "/photography/scenery/DSC01775.jpeg",
    className: "portfolio-hover-bg--spring",
  },
] as const;

export function PortfolioIndexField() {
  return (
    <section className="portfolio-index-field" aria-label="Art">
      <div className="portfolio-index-field-sticky">
        <div className="portfolio-hover">
          <div className="portfolio-hover-backgrounds" aria-hidden>
            {INDEX_BACKGROUNDS.map((background, index) => (
              <div
                key={background.src}
                className={[
                  "portfolio-hover-bg",
                  background.className,
                  index === 0 ? "is-active" : "portfolio-hover-bg--cycle",
                ].join(" ")}
              >
                <Image
                  src={background.src}
                  alt=""
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="portfolio-hover-bg-image"
                />
                <div className="portfolio-hover-bg-overlay" />
              </div>
            ))}
          </div>

          <ul className="portfolio-hover-items-list">
            {ART_CATEGORIES.map((category) => (
              <li key={category.href}>
                <Link href={category.href} className="portfolio-hover-item">
                  <h1 className="portfolio-hover-item-title">
                    <span className="portfolio-hover-item-content">
                      {category.label}
                    </span>
                  </h1>
                </Link>
              </li>
            ))}
          </ul>

          <LennonQuote variant="ticker" />
        </div>
      </div>
    </section>
  );
}
