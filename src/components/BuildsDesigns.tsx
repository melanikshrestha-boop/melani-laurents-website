import { designWorks } from "@/data/designs";

export function BuildsDesigns() {
  return (
    <section className="builds-designs" aria-labelledby="builds-designs-title">
      <h2 id="builds-designs-title" className="builds-products__title">
        Designs
      </h2>
      <p className="builds-designs__line">Have designed, built like that.</p>
      <ul className="builds-designs__list">
        {designWorks.map((work) => {
          const inner = (
            <>
              <span className="builds-designs__still">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={work.still} alt="" />
              </span>
              <span className="builds-designs__copy">
                <span className="builds-designs__name">{work.title}</span>
                <span className="builds-designs__note">{work.note}</span>
              </span>
            </>
          );
          return (
            <li key={work.id} className="builds-designs__item">
              {work.href ? (
                <a href={work.href} className="builds-designs__card">
                  {inner}
                </a>
              ) : (
                <div className="builds-designs__card">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
