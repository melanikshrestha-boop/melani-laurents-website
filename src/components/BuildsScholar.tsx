import {
  googleScholarUrl,
  publicationProfile,
  publications,
} from "@/data/publications";

/**
 * Scholar block inside Builds — profile + patents (LinkedIn-style proof section).
 * No boxes / no hairline dividers; single-spaced density.
 */
export function BuildsScholar() {
  const patents = publications.filter((p) => p.kind === "patent");
  const articles = publications.filter((p) => p.kind === "article");
  const rows = [...patents, ...articles];

  return (
    <section className="bs-scholar" aria-label="Google Scholar">
      <div className="bs-scholar__profile">
        <div className="bs-scholar__who">
          <h2 className="bs-scholar__name">{publicationProfile.name}</h2>
          <p className="bs-scholar__aff">{publicationProfile.affiliation}</p>
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

      {rows.length > 0 ? (
        <ul className="bs-scholar__list">
          {rows.map((pub) => (
            <li key={`${pub.year}-${pub.title.slice(0, 48)}`} className="bs-scholar__item">
              <p className="bs-scholar__title">{pub.title}</p>
              <p className="bs-scholar__meta">
                {[pub.kind === "patent" ? "Patent" : "Article", pub.venue, String(pub.year)]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {pub.authors ? (
                <p className="bs-scholar__authors">{pub.authors}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
