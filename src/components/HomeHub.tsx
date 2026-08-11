"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";

/**
 * ONE photograph only — Spring Street from official scenery gallery
 * (public/photography/scenery/DSC01775 — full posted master, not chat-compressed).
 * Name + chrome layout matches the original locked hub (exactly centered title).
 */
export const HUB_HERO_PHOTO = {
  src: "/photography/hero/spring-st.jpg",
  /** Prefer original gallery path as source-of-truth; hero is exported JPEG master */
  gallerySrc: "/photography/scenery/DSC01775.jpeg",
  alt: "Spring Street, New York — shot by Celine Nova",
} as const;

export function HomeHub() {
  return (
    <section
      className="hub-page hub-page--locked hub-page--photo"
      aria-label="Celine Nova home"
    >
      <div className="hub-page__photo" aria-hidden>
        <Image
          src={HUB_HERO_PHOTO.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="hub-page__photo-img"
          quality={100}
        />
        <div className="hub-page__photo-scrim" />
      </div>

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
            return (
              <span
                key={portal.href}
                className={
                  isContact
                    ? "hub-page__nav-item hub-page__nav-item--contact"
                    : "hub-page__nav-item"
                }
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
                    className={isContact ? "hub-page__nav-contact" : undefined}
                  >
                    {portal.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
      </footer>
    </section>
  );
}
