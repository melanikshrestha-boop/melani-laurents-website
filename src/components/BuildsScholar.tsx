import {
  googleScholarUrl,
  publications,
} from "@/data/publications";

/**
 * Patent record inside Builds. The overview stays compact while the legal titles
 * and application numbers remain visible without turning into resume copy.
 */
export function BuildsScholar() {
  const patents = publications.filter((p) => p.kind === "patent");

  return (
    <section className="bs-scholar" aria-labelledby="builds-patents-title">
      <div className="bs-scholar__profile">
        <div className="bs-scholar__who">
          <p className="bs-scholar__eyebrow">Patents</p>
          <h2 id="builds-patents-title" className="bs-scholar__name">
            {patents.length} US patent applications
          </h2>
          <p className="bs-scholar__aff">
            In-ear EEG hardware for sensing, electrodes, and real-time monitoring.
          </p>
        </div>
        <a
          href={googleScholarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bs-scholar__link"
        >
          View on Google Scholar ↗
        </a>
      </div>

      {patents.length > 0 ? (
        <ol className="bs-scholar__list">
          {patents.map((pub, index) => (
            <li key={`${pub.year}-${pub.title.slice(0, 48)}`} className="bs-scholar__item">
              <span className="bs-scholar__index" aria-hidden>
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="bs-scholar__title">{pub.title}</h3>
                <p className="bs-scholar__meta">
                  {[pub.venue, String(pub.year)].filter(Boolean).join(" · ")}
                </p>
                <p className="bs-scholar__authors">M Shrestha · co-inventor</p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
