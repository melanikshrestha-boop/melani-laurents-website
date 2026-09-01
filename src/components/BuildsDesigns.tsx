import { DesignPeek } from "@/components/DesignPeek";
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
              <div className="bs-scholar__page bs-scholar__page--site bs-scholar__page--live">
                <DesignPeek src={site.previewImage} title={site.title} />
              </div>
            </figure>
          </a>
        </li>
      ))}
    </ol>
  );
}
