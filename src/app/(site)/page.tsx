import Link from "next/link";
import { AddToBagButton } from "@/components/ServiceCart";
import { lunara } from "@/lib/lunara";

/**
 * Home — inspired by Striiike service menus + Shani Darden studio calm.
 * Dark studio hero, light menu board, clean price rows.
 */
export default function HomePage() {
  return (
    <div className="lg-home">
      {/* Dark studio band — Shani-like */}
      <section className="lg-hero">
        <div className="lg-wrap lg-hero-inner">
          <p className="lg-eyebrow">Astoria · {lunara.experience}</p>
          <h1 className="lg-hero-title">
            {lunara.shortName}
            <em>Studio</em>
          </h1>
          <p className="lg-hero-lead">
            Expertly done brows, lashes, waxing, and facials — with a menu you
            can actually read.
          </p>
          <div className="lg-hero-cta">
            <Link href="/book" className="lg-btn lg-btn-light">
              Book now
            </Link>
            <Link href="/#services" className="lg-btn lg-btn-ghost">
              View menu
            </Link>
          </div>
          <dl className="lg-hero-meta">
            <div>
              <dt>Address</dt>
              <dd>{lunara.address}</dd>
            </div>
            <div>
              <dt>Hours</dt>
              <dd>{lunara.hours}</dd>
            </div>
            <div>
              <dt>Offer</dt>
              <dd>{lunara.offer}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Service menu — Striiike-style boards */}
      <section id="services" className="lg-services">
        <div className="lg-wrap">
          <header className="lg-services-head">
            <p className="lg-eyebrow dark">Menu</p>
            <h2 className="lg-display">Services</h2>
            <p className="lg-sub">
              Name · price · time. Add with + then book, or walk in.
            </p>
          </header>

          <nav className="lg-jump" aria-label="Jump to category">
            {lunara.services.map((group) => (
              <a key={group.id} href={`#${group.id}`}>
                {group.title}
              </a>
            ))}
          </nav>

          {lunara.services.map((group) => (
            <article key={group.id} id={group.id} className="lg-menu-board">
              <header className="lg-menu-board-head">
                <h3>{group.title}</h3>
                <p>{group.eyebrow}</p>
              </header>

              <ul className="lg-menu-list">
                {group.items.map((item) => (
                  <li key={`${group.id}-${item.name}`}>
                    <div className="lg-menu-main">
                      <span className="lg-menu-name">{item.name}</span>
                      {"description" in item && item.description ? (
                        <span className="lg-menu-desc">{item.description}</span>
                      ) : null}
                    </div>
                    <div className="lg-menu-meta">
                      <span className="lg-menu-price">{item.price}</span>
                      <span className="lg-menu-sep" aria-hidden>
                        /
                      </span>
                      <span className="lg-menu-time">{item.time}</span>
                      <AddToBagButton
                        name={item.name}
                        categoryId={group.id}
                        categoryTitle={group.title}
                        price={item.price}
                        time={item.time}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Loyalty strip */}
      <section className="lg-strip">
        <div className="lg-wrap lg-strip-inner">
          <p className="lg-strip-label">Loyalty</p>
          <p className="lg-strip-text">{lunara.loyalty}</p>
          <Link href="/new-clients" className="lg-text-link">
            New client notes
          </Link>
        </div>
      </section>

      {/* Reviews — static cards, not marquee */}
      <section className="lg-reviews">
        <div className="lg-wrap">
          <header className="lg-services-head">
            <p className="lg-eyebrow dark">Yelp</p>
            <h2 className="lg-display">Clients</h2>
          </header>
          <div className="lg-review-grid">
            {lunara.reviews.map((r) => (
              <figure key={r.author} className="lg-review">
                <blockquote>“{r.quote}”</blockquote>
                <figcaption>{r.author}</figcaption>
              </figure>
            ))}
          </div>
          <a
            href={lunara.yelp}
            className="lg-text-link"
            target="_blank"
            rel="noreferrer"
          >
            See all on Yelp
          </a>
        </div>
      </section>

      {/* Visit / book — dark close like Shani studio */}
      <section id="contact" className="lg-visit">
        <div className="lg-wrap lg-visit-grid">
          <div>
            <p className="lg-eyebrow">Visit</p>
            <h2 className="lg-display light">Book or walk in</h2>
            <p className="lg-visit-copy">{lunara.hours}</p>
            <div className="lg-hero-cta">
              <Link href="/book" className="lg-btn lg-btn-light">
                Book online
              </Link>
              <a
                href={`tel:${lunara.phoneDial}`}
                className="lg-btn lg-btn-ghost"
              >
                Call {lunara.phone}
              </a>
            </div>
            <address className="lg-address">
              {lunara.address}
              <br />
              <a href={`mailto:${lunara.email}`}>{lunara.email}</a>
              <br />
              {lunara.instagram}
            </address>
          </div>
          <div className="lg-map">
            <iframe
              title="Lunara Glow location"
              src="https://www.google.com/maps?q=38-02+Broadway+Astoria+NY+11103&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ — Striiike pattern */}
      <section className="lg-faq">
        <div className="lg-wrap">
          <header className="lg-services-head">
            <p className="lg-eyebrow dark">FAQ</p>
            <h2 className="lg-display">Before you come</h2>
          </header>
          <div className="lg-faq-list">
            <details>
              <summary>How long is an appointment?</summary>
              <p>
                Each service lists time on the menu. Combos take longer — we’ll
                confirm when you book.
              </p>
            </details>
            <details>
              <summary>Do I need to book ahead?</summary>
              <p>
                Booking online is best. Walk-ins welcome when the chair is free
                — call {lunara.phone} same day if you can.
              </p>
            </details>
            <details>
              <summary>First visit discount?</summary>
              <p>{lunara.offer}. Mention it when you check in.</p>
            </details>
            <details>
              <summary>Loyalty points?</summary>
              <p>{lunara.loyalty}</p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}
