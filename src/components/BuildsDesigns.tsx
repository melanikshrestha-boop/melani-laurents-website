import { DesignLive } from "@/components/DesignLive";
import { DesignPeek } from "@/components/DesignPeek";
import { designs } from "@/data/designs";

export function BuildsDesigns() {
  if (designs.length === 0) return null;

  return (
    <ol className="bs-scholar__list">
      {designs.map((site) => (
        <li
          key={site.id}
          className={
            site.live ? "bs-scholar__item bs-scholar__item--live" : "bs-scholar__item"
          }
        >
          {site.live ? (
            <figure className="bs-scholar__figure">
              <div className="bs-scholar__page bs-scholar__page--site bs-scholar__page--live">
                <DesignLive
                  src={site.href}
                  title={site.title}
                  previewImage={site.previewImage}
                />
              </div>
              <a
                className="bs-scholar__open"
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${site.title} ↗`}
              >
                <span aria-hidden>↗</span>
              </a>
            </figure>
          ) : (
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bs-scholar__document"
              aria-label={site.title}
            >
              <figure className="bs-scholar__figure">
                <div className="bs-scholar__page bs-scholar__page--site">
                  <DesignPeek src={site.previewImage} title={site.title} />
                </div>
              </figure>
            </a>
          )}
        </li>
      ))}
    </ol>
  );
}
