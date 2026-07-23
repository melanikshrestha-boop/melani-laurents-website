"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { AddToBagButton } from "@/components/ServiceCart";
import {
  CategoryMarquee,
  HeroParallaxLayers,
  HeroTitle,
  MagneticButton,
  MotionMenuRow,
  Reveal,
  Stagger,
  StaggerItem,
  StickyBookBar,
} from "@/components/LunaraMotion";
import { lunara } from "@/lib/lunara";

/**
 * Lunara home — ambitious motion system.
 * Striiike menus + Shani studio, with Lenis / Framer scroll cinema.
 */
export default function HomePage() {
  const categories = lunara.services.map((s) => s.title);

  return (
    <div className="lg-home">
      {/* ── Hero ── */}
      <section className="lg-hero">
        <HeroParallaxLayers />
        <div className="lg-wrap lg-hero-inner">
          <motion.p
            className="lg-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          >
            Astoria · {lunara.experience}
          </motion.p>

          <HeroTitle line1={lunara.shortName} line2="Studio" />

          <motion.p
            className="lg-hero-lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            Expertly done brows, lashes, waxing, and facials — a menu you can
            read, a room you can feel.
          </motion.p>

          <motion.div
            className="lg-hero-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7 }}
          >
            <MagneticButton href="/book" className="lg-btn lg-btn-light">
              Book now
            </MagneticButton>
            <MagneticButton href="/#services" className="lg-btn lg-btn-ghost">
              View menu
            </MagneticButton>
          </motion.div>

          <Stagger className="lg-hero-meta lg-hero-meta-stagger" delay={0.85} stagger={0.1}>
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">Address</p>
                <p className="lg-hero-meta-v">{lunara.address}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">Hours</p>
                <p className="lg-hero-meta-v">{lunara.hours}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">Offer</p>
                <p className="lg-hero-meta-v">{lunara.offer}</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="lg-hero-scroll" aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </section>

      {/* Moving category ribbon */}
      <CategoryMarquee labels={categories} />

      {/* ── Services ── */}
      <section id="services" className="lg-services">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">Menu</p>
            <h2 className="lg-display">Services</h2>
            <p className="lg-sub">
              Name · price · time. Add with + then book, or walk in.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <nav className="lg-jump" aria-label="Jump to category">
              {lunara.services.map((group) => (
                <a key={group.id} href={`#${group.id}`}>
                  {group.title}
                </a>
              ))}
            </nav>
          </Reveal>

          {lunara.services.map((group, gi) => (
            <article key={group.id} id={group.id} className="lg-menu-board">
              <Reveal>
                <header className="lg-menu-board-head">
                  <div className="lg-menu-board-index">
                    {String(gi + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.eyebrow}</p>
                  </div>
                </header>
              </Reveal>

              <ul className="lg-menu-list">
                {group.items.map((item, ii) => (
                  <MotionMenuRow key={`${group.id}-${item.name}`} index={ii}>
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
                  </MotionMenuRow>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Loyalty */}
      <section className="lg-strip">
        <Reveal className="lg-wrap lg-strip-inner">
          <p className="lg-strip-label">Loyalty</p>
          <p className="lg-strip-text">{lunara.loyalty}</p>
          <Link href="/new-clients" className="lg-text-link">
            New client notes
          </Link>
        </Reveal>
      </section>

      {/* Reviews */}
      <section className="lg-reviews">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">Yelp</p>
            <h2 className="lg-display">Clients</h2>
          </Reveal>
          <Stagger className="lg-review-grid" stagger={0.12}>
            {lunara.reviews.map((r) => (
              <StaggerItem key={r.author}>
                <figure className="lg-review">
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>{r.author}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.15}>
            <a
              href={lunara.yelp}
              className="lg-text-link"
              target="_blank"
              rel="noreferrer"
            >
              See all on Yelp
            </a>
          </Reveal>
        </div>
      </section>

      {/* Visit */}
      <section id="contact" className="lg-visit">
        <div className="lg-wrap lg-visit-grid">
          <Reveal>
            <p className="lg-eyebrow">Visit</p>
            <h2 className="lg-display light">Book or walk in</h2>
            <p className="lg-visit-copy">{lunara.hours}</p>
            <div className="lg-hero-cta">
              <MagneticButton href="/book" className="lg-btn lg-btn-light">
                Book online
              </MagneticButton>
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
          </Reveal>
          <Reveal delay={0.12} className="lg-map">
            <iframe
              title="Lunara Glow location"
              src="https://www.google.com/maps?q=38-02+Broadway+Astoria+NY+11103&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="lg-faq">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">FAQ</p>
            <h2 className="lg-display">Before you come</h2>
          </Reveal>
          <div className="lg-faq-list">
            {[
              {
                q: "How long is an appointment?",
                a: "Each service lists time on the menu. Combos take longer — we confirm when you book.",
              },
              {
                q: "Do I need to book ahead?",
                a: `Booking online is best. Walk-ins welcome when the chair is free — call ${lunara.phone} same day if you can.`,
              },
              {
                q: "First visit discount?",
                a: `${lunara.offer}. Mention it when you check in.`,
              },
              {
                q: "Loyalty points?",
                a: lunara.loyalty,
              },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 0.05}>
                <details>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StickyBookBar
        href="/book"
        phone={lunara.phone}
        phoneDial={lunara.phoneDial}
      />
    </div>
  );
}
