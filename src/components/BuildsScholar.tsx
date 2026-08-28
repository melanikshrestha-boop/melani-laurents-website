import Image from "next/image";
import {
  googleScholarUrl,
  publications,
} from "@/data/publications";

export function BuildsScholar() {
  const patents = publications.filter((p) => p.kind === "patent");

  return (
    <section className="bs-scholar" aria-labelledby="builds-patents-title">
      <div className="bs-scholar__profile">
        <div className="bs-scholar__who">
          <p className="bs-scholar__eyebrow">Patent folio</p>
          <h2 id="builds-patents-title" className="bs-scholar__name">
            Patents
          </h2>
          <p className="bs-scholar__aff">{patents.length} published US applications</p>
        </div>
        <a
          href={googleScholarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bs-scholar__link"
        >
          Google Scholar ↗
        </a>
      </div>

      {patents.length > 0 ? (
        <ol className="bs-scholar__list">
          {patents.map((pub, index) => (
            <li key={`${pub.year}-${pub.title.slice(0, 48)}`} className="bs-scholar__item">
              <a
                href={pub.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bs-scholar__document"
                aria-label={`Open published filing: ${pub.title}`}
              >
                <figure className="bs-scholar__figure">
                  <div className="bs-scholar__page">
                    {pub.previewImage ? (
                      <Image
                        src={pub.previewImage}
                        alt={`First page of ${pub.publicationNumber ?? pub.venue}`}
                        width={1280}
                        height={1657}
                        sizes="(max-width: 720px) 92vw, 46vw"
                        loading="eager"
                        className="bs-scholar__preview"
                      />
                    ) : null}
                    <span className="bs-scholar__reveal" aria-hidden>
                      <span>Published filing</span>
                      <strong>Open PDF ↗</strong>
                    </span>
                  </div>
                  <figcaption className="bs-scholar__caption">
                    <span className="bs-scholar__index" aria-hidden>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="bs-scholar__caption-copy">
                      <h3 className="bs-scholar__title">{pub.title}</h3>
                      <p className="bs-scholar__meta">
                        {pub.publicationNumber ?? pub.venue}
                        {pub.publicationDate ? ` · ${pub.publicationDate}` : ""}
                      </p>
                      <p className="bs-scholar__authors">M Shrestha · co-inventor</p>
                    </div>
                  </figcaption>
                </figure>
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
