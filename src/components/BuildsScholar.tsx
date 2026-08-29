import Image from "next/image";
import { publications } from "@/data/publications";

export function BuildsScholar() {
  const patents = publications.filter((p) => p.kind === "patent");

  return (
    <section className="bs-scholar" aria-labelledby="builds-patents-title">
      {patents.length > 0 ? (
        <ol className="bs-scholar__list">
          {patents.map((pub, index) => (
            <li key={`${pub.year}-${pub.title.slice(0, 48)}`} className="bs-scholar__item">
              <a
                href={pub.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bs-scholar__document"
                aria-label={`${pub.title}, published filing`}
              >
                <figure className="bs-scholar__figure">
                  <div className="bs-scholar__page">
                    {pub.previewImage ? (
                      <Image
                        src={pub.previewImage}
                        alt={`First page of ${pub.publicationNumber ?? pub.venue}`}
                        width={1280}
                        height={1657}
                        sizes="(max-width: 560px) calc(100vw - 2rem), (max-width: 1120px) 46vw, 23vw"
                        loading="eager"
                        unoptimized
                        className="bs-scholar__preview"
                      />
                    ) : null}
                    {pub.nameHighlights?.map((highlight, highlightIndex) => (
                      <span
                        key={highlightIndex}
                        className="bs-scholar__name-marker"
                        aria-hidden="true"
                        style={highlight}
                      />
                    ))}
                    <span className="bs-scholar__reveal">
                      <span className="bs-scholar__reveal-index" aria-hidden>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <strong className="bs-scholar__reveal-title">
                        {pub.title} <span aria-hidden>↗</span>
                      </strong>
                      <span className="bs-scholar__reveal-footer">
                        <span className="bs-scholar__reveal-meta">
                          {pub.publicationNumber ?? pub.venue}
                          {pub.publicationDate ? ` · ${pub.publicationDate}` : ""}
                        </span>
                        <span className="bs-scholar__reveal-role">
                          <span>Co-author</span>
                          <strong>Melani Shrestha</strong>
                        </span>
                      </span>
                    </span>
                  </div>
                </figure>
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
