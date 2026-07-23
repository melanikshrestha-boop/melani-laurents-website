"use client";

/**
 * Lunara home — highest level: shine promo, process drawers, photos, end video,
 * EN/ES/HI, tight spacing. Striiike menus + Shani studio energy.
 */

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AddToBagButton } from "@/components/ServiceCart";
import {
  ServiceDetailDrawer,
  MoreInfoButton,
  type DrawerService,
} from "@/components/ServiceDetailDrawer";
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
import { useI18n } from "@/lib/i18n";
import { lunara } from "@/lib/lunara";

/** Expectation gallery — real photography (what clients walk into) */
const EXPECT_PHOTOS = [
  {
    src: "/photography/index/portraits-hero.jpeg",
    alt: "Studio portrait energy — polished close look",
    label: "Brows & finish",
  },
  {
    src: "/photography/portraits/_DSC2685.JPG",
    alt: "Soft light portrait — clean skin finish",
    label: "Facial glow",
  },
  {
    src: "/photography/portraits/_DSC2228.jpeg",
    alt: "Editorial portrait — calm studio mood",
    label: "Lash detail",
  },
  {
    src: "/photography/portraits/DSC02047.jpeg",
    alt: "Natural light portrait",
    label: "Wax & shape",
  },
  {
    src: "/photography/vision/image00003.jpeg",
    alt: "Vision study — texture and light",
    label: "The room",
  },
  {
    src: "/photography/index/vision-hero.jpg",
    alt: "Studio vision still",
    label: "Atmosphere",
  },
] as const;

export default function HomePage() {
  const { t } = useI18n();
  const [active, setActive] = useState<DrawerService | null>(null);
  const closeDrawer = useCallback(() => setActive(null), []);

  const categories = lunara.services.map((s) => s.title);

  const openService = (
    item: { name: string; price: string; time: string; description?: string },
    group: { id: string; title: string },
  ) => {
    setActive({
      name: item.name,
      categoryId: group.id,
      categoryTitle: group.title,
      price: item.price,
      time: item.time,
      description:
        "description" in item && item.description
          ? item.description
          : undefined,
    });
  };

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
            {t("heroEyebrow")}
          </motion.p>

          <HeroTitle line1={lunara.shortName} line2={t("heroLine2")} />

          <motion.p
            className="lg-hero-lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            {t("heroLead")}
          </motion.p>

          <motion.div
            className="lg-hero-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.7 }}
          >
            <MagneticButton href="/book" className="lg-btn lg-btn-light">
              {t("bookNow")}
            </MagneticButton>
            <MagneticButton href="/#services" className="lg-btn lg-btn-ghost">
              {t("viewMenu")}
            </MagneticButton>
          </motion.div>

          <Stagger
            className="lg-hero-meta lg-hero-meta-stagger"
            delay={0.85}
            stagger={0.1}
          >
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">{t("metaAddress")}</p>
                <p className="lg-hero-meta-v">{lunara.address}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">{t("metaHours")}</p>
                <p className="lg-hero-meta-v">{t("hoursDisplay")}</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="lg-hero-meta-item">
                <p className="lg-hero-meta-k">{t("metaOffer")}</p>
                <p className="lg-hero-meta-v">{t("offerDisplay")}</p>
              </div>
            </StaggerItem>
          </Stagger>
        </div>

        <div className="lg-hero-scroll" aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <CategoryMarquee labels={categories} />

      {/* ── Services ── */}
      <section id="services" className="lg-services">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">{t("menuEyebrow")}</p>
            <h2 className="lg-display">{t("menuTitle")}</h2>
            <p className="lg-sub">{t("menuSub")}</p>
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
                    {/* Whole name block is clickable → process drawer */}
                    <button
                      type="button"
                      className="lg-menu-main lg-menu-main-btn"
                      onClick={() => openService(item, group)}
                    >
                      <span className="lg-menu-name">{item.name}</span>
                      {"description" in item && item.description ? (
                        <span className="lg-menu-desc">{item.description}</span>
                      ) : (
                        <span className="lg-menu-hint">{t("clickMore")}</span>
                      )}
                    </button>
                    <div className="lg-menu-meta">
                      <span className="lg-menu-price">{item.price}</span>
                      <span className="lg-menu-sep" aria-hidden>
                        /
                      </span>
                      <span className="lg-menu-time">{item.time}</span>
                      <MoreInfoButton
                        label={t("moreInfo")}
                        onClick={() => openService(item, group)}
                      />
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
          <p className="lg-strip-label">{t("loyalty")}</p>
          <p className="lg-strip-text">{lunara.loyalty}</p>
          <Link href="/new-clients" className="lg-text-link">
            {t("newClientNotes")}
          </Link>
        </Reveal>
      </section>

      {/* ── Expectation photos ── */}
      <section id="expect" className="lg-expect">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">{t("expectEyebrow")}</p>
            <h2 className="lg-display">{t("expectTitle")}</h2>
            <p className="lg-sub">{t("expectSub")}</p>
          </Reveal>

          <div className="lg-expect-grid">
            {EXPECT_PHOTOS.map((photo, i) => (
              <Reveal key={photo.src} delay={i * 0.06} className="lg-expect-card">
                <div className="lg-expect-frame">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={720}
                    height={900}
                    className="lg-expect-img"
                    sizes="(max-width: 700px) 50vw, 33vw"
                  />
                </div>
                <p className="lg-expect-label">{photo.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="lg-reviews">
        <div className="lg-wrap">
          <Reveal className="lg-services-head">
            <p className="lg-eyebrow dark">{t("clientsEyebrow")}</p>
            <h2 className="lg-display">{t("clientsTitle")}</h2>
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
              {t("seeYelp")}
            </a>
          </Reveal>
        </div>
      </section>

      {/* Visit */}
      <section id="contact" className="lg-visit">
        <div className="lg-wrap lg-visit-grid">
          <Reveal>
            <p className="lg-eyebrow">{t("visitEyebrow")}</p>
            <h2 className="lg-display light">{t("visitTitle")}</h2>
            <p className="lg-visit-copy">{t("hoursDisplay")}</p>
            <div className="lg-hero-cta">
              <MagneticButton href="/book" className="lg-btn lg-btn-light">
                {t("bookOnline")}
              </MagneticButton>
              <a
                href={`tel:${lunara.phoneDial}`}
                className="lg-btn lg-btn-ghost"
              >
                {t("call")} {lunara.phone}
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
            <p className="lg-eyebrow dark">{t("faqEyebrow")}</p>
            <h2 className="lg-display">{t("faqTitle")}</h2>
          </Reveal>
          <div className="lg-faq-list">
            {[
              { q: t("faq1q"), a: t("faq1a") },
              { q: t("faq2q"), a: t("faq2a") },
              { q: t("faq3q"), a: t("faq3a") },
              { q: t("faq4q"), a: t("faq4a") },
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

      {/* ── End: studio video (plays on screen) ── */}
      <section id="film" className="lg-film">
        <div className="lg-wrap">
          <Reveal className="lg-services-head lg-film-head">
            <p className="lg-eyebrow">{t("videoEyebrow")}</p>
            <h2 className="lg-display light">{t("videoTitle")}</h2>
            <p className="lg-film-sub">{t("videoSub")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="lg-film-frame">
              <video
                className="lg-film-video"
                controls
                playsInline
                preload="metadata"
                poster="/photography/index/portraits-hero.jpeg"
                aria-label={t("videoTitle")}
              >
                <source src="/lunara/studio.mp4" type="video/mp4" />
                Your browser does not support video.
              </video>
            </div>
          </Reveal>
        </div>
      </section>

      <StickyBookBar
        href="/book"
        phone={lunara.phone}
        phoneDial={lunara.phoneDial}
      />

      {/* Process drawer — opens when you click a service */}
      <ServiceDetailDrawer service={active} onClose={closeDrawer} />
    </div>
  );
}
