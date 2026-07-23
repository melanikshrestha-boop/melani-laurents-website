import Link from "next/link";
import { AddToBagButton } from "@/components/ServiceCart";
import { lunara } from "@/lib/lunara";

export default function HomePage() {
  return (
    <div className="home">
      <section className="section hero">
        <p className="kicker">Astoria · {lunara.experience}</p>
        <h1 className="hero-title">{lunara.shortName}</h1>
        <p className="hero-lead">
          Brows, lashes, waxing, facials. Clear prices. Walk in or book ahead.
        </p>
        <div className="hero-actions">
          <Link href="/book" className="button-primary">
            Book
          </Link>
          <Link href="/#services" className="button-secondary">
            Menu &amp; prices
          </Link>
          <a href={`tel:${lunara.phoneDial}`} className="button-secondary">
            Call {lunara.phone}
          </a>
        </div>
        <ul className="hero-facts">
          <li>
            <strong>Address</strong>
            <span>{lunara.address}</span>
          </li>
          <li>
            <strong>Hours</strong>
            <span>{lunara.hours}</span>
          </li>
          <li>
            <strong>Offer</strong>
            <span>{lunara.offer}</span>
          </li>
          <li>
            <strong>Loyalty</strong>
            <span>{lunara.loyalty}</span>
          </li>
        </ul>
      </section>

      <section id="services" className="section services">
        <div className="section-head">
          <div>
            <p className="kicker">Menu</p>
            <h2>Services &amp; prices</h2>
          </div>
          <p className="section-side">
            Tap + to add services, then Book. Or call and walk in.
          </p>
        </div>

        <nav className="service-jump" aria-label="Jump to category">
          {lunara.services.map((group) => (
            <a key={group.id} href={`#${group.id}`}>
              {group.title}
            </a>
          ))}
        </nav>

        {lunara.services.map((group) => (
          <article key={group.id} id={group.id} className="service-block">
            <header className="service-block-head">
              <h3>{group.title}</h3>
              <p>{group.eyebrow}</p>
            </header>

            <div className="service-table-wrap">
              <table className="service-table">
                <thead>
                  <tr>
                    <th scope="col">Service</th>
                    <th scope="col">Time</th>
                    <th scope="col">Price</th>
                    <th scope="col">
                      <span className="sr-only">Add</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={`${group.id}-${item.name}`}>
                      <td>
                        <span className="svc-name">{item.name}</span>
                        {"description" in item && item.description ? (
                          <span className="svc-desc">{item.description}</span>
                        ) : null}
                      </td>
                      <td className="svc-time">{item.time}</td>
                      <td className="svc-price">{item.price}</td>
                      <td className="svc-add">
                        <AddToBagButton
                          name={item.name}
                          categoryId={group.id}
                          categoryTitle={group.title}
                          price={item.price}
                          time={item.time}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </section>

      <section className="section reviews">
        <div className="section-head">
          <div>
            <p className="kicker">Yelp</p>
            <h2>What clients say</h2>
          </div>
          <Link
            href={lunara.yelp}
            className="button-secondary"
            target="_blank"
            rel="noreferrer"
          >
            All reviews
          </Link>
        </div>
        <div className="review-grid">
          {lunara.reviews.map((review) => (
            <figure key={review.author} className="review-card">
              <blockquote>“{review.quote}”</blockquote>
              <figcaption>{review.author}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="contact" className="section contact">
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="kicker">Visit</p>
            <h2>Book online or walk in</h2>
            <p className="lead">{lunara.hours}</p>
            <div className="hero-actions">
              <Link href="/book" className="button-primary">
                Book online
              </Link>
              <a
                href={`tel:${lunara.phoneDial}`}
                className="button-secondary"
              >
                Call {lunara.phone}
              </a>
            </div>
            <dl className="contact-facts">
              <div>
                <dt>Address</dt>
                <dd>{lunara.address}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${lunara.email}`}>{lunara.email}</a>
                </dd>
              </div>
              <div>
                <dt>Instagram</dt>
                <dd>{lunara.instagram}</dd>
              </div>
            </dl>
          </div>
          <div className="contact-map">
            <iframe
              title="Lunara Glow location"
              src="https://www.google.com/maps?q=38-02+Broadway+Astoria+NY+11103&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
