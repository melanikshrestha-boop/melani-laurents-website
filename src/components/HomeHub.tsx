"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";

/**
 * Spring St master (Art scenery).
 * One viewport cover crop only — no full-photo scroll pan when extended.
 * CELINE NOVA dead-centered over the still.
 */
export const HUB_HERO_PHOTO = {
  src: "/photography/scenery/DSC01775.jpeg",
  alt: "Spring Street, New York — shot by Celine Nova",
  width: 2624,
  height: 3936,
} as const;

export function HomeHub() {
  return (
    <>
      <section
        className="hub-page hub-page--locked hub-page--photo"
        aria-label="Celine Nova home"
      >
        <div className="hub-page__photo" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HUB_HERO_PHOTO.src}
            alt=""
            className="hub-page__photo-img"
            decoding="async"
            fetchPriority="high"
            width={HUB_HERO_PHOTO.width}
            height={HUB_HERO_PHOTO.height}
          />
        </div>

        <div className="hub-page__sticky-ui">
          <header className="hub-page__header hub-page__header--locked">
            <div className="hub-page__brand hub-page__brand--locked">
              <MelaniSignature variant="light" />
              <p className="hub-page__brand-loc">
                <span className="hub-page__dot-inline" aria-hidden />
                currently in Los Angeles
              </p>
            </div>

            <nav
              className="hub-page__socials hub-page__socials--locked"
              aria-label="Social links"
            >
              <SocialIcons size="hub" className="hub-page__social-icons" />
            </nav>
          </header>

          <div className="hub-page__center hub-page__center--locked">
            <InteractiveTitleLetters
              variant="hub"
              className="hub-page__title"
              lineClassName="hub-page__title-line"
            />
            <p className="hub-page__tagline">open sourcing my mind.</p>
          </div>

          <footer className="hub-page__footer hub-page__footer--locked">
            <nav
              className="hub-page__nav hub-page__nav--locked"
              aria-label="Sections"
            >
              {siteConfig.hubPortals.map((portal, i) => {
                const isContact = portal.href === "/contact";
                const isArt = portal.href === "/photography";
                return (
                  <span
                    key={portal.href}
                    className={[
                      "hub-page__nav-item",
                      isContact ? "hub-page__nav-item--contact" : "",
                      isArt ? "hub-page__nav-item--art" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{ animationDelay: `${1.15 + i * 0.18}s` }}
                  >
                    {i > 0 ? (
                      <span className="hub-page__sep" aria-hidden>
                        {" "}
                        ·{" "}
                      </span>
                    ) : null}
                    {"external" in portal && portal.external ? (
                      <a
                        href={portal.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {portal.label}
                      </a>
                    ) : (
                      <Link
                        href={portal.href}
                        className={
                          isContact
                            ? "hub-page__nav-contact"
                            : isArt
                              ? "hub-page__nav-art"
                              : undefined
                        }
                      >
                        {portal.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          </footer>
        </div>
      </section>
      {/* Document height for fixed photo — crossfade runs over this scroll */}
      <div className="hero-scroll-space" aria-hidden />
    </>
  );
}
