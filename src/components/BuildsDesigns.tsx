import Image from "next/image";
import { designs } from "@/data/designs";

export function BuildsDesigns() {
  if (designs.length === 0) return null;

  return (
    <ol className="bs-scholar__list">
      {designs.map((site) => (
        <li key={site.id} className="bs-scholar__item">
          <a
            href={site.href}
            target="_blank"
            rel="noopener noreferrer"
            className="bs-scholar__document"
            aria-label={site.title}
          >
            <figure className="bs-scholar__figure">
              <div className="bs-scholar__page bs-scholar__page--site">
                <Image
                  src={site.previewImage}
                  alt=""
                  width={1440}
                  height={900}
                  sizes="(max-width: 560px) calc(100vw - 2rem), (max-width: 1120px) 46vw, 23vw"
                  loading="eager"
                  unoptimized
                  className="bs-scholar__preview"
                />
                <span className="bs-scholar__reveal">
                  <strong className="bs-scholar__reveal-title">
                    {site.title} <span aria-hidden>↗</span>
                  </strong>
                </span>
              </div>
            </figure>
          </a>
        </li>
      ))}
    </ol>
  );
}
