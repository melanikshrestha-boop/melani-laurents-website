import { DesignLive } from "@/components/DesignLive";
import { DesignPeek } from "@/components/DesignPeek";
import { designs } from "@/data/designs";

export function BuildsDesigns() {
  if (designs.length === 0) return null;

  return (
    <ol className="builds-designs__list">
      {designs.map((site) => (
        <li key={site.id} className="builds-designs__item">
          <figure className="bs-scholar__figure">
            <div
              className={
                site.live
                  ? "bs-scholar__page bs-scholar__page--site bs-scholar__page--live"
                  : "bs-scholar__page bs-scholar__page--site"
              }
            >
              {site.live ? (
                <DesignLive
                  src={site.href}
                  title={site.title}
                  previewImage={site.previewImage}
                />
              ) : (
                <a
                  href={site.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bs-scholar__document"
                  aria-label={`${site.title} ↗`}
                >
                  <DesignPeek
                    src={site.previewImage}
                    title={site.title}
                    story={site.story}
                  />
                </a>
              )}
            </div>
            {site.live ? (
              <a
                href={site.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bs-scholar__open"
                aria-label={`${site.title} ↗`}
              >
                ↗
              </a>
            ) : null}
          </figure>
        </li>
      ))}
    </ol>
  );
}
