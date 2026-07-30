"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";

/**
 * Production home landing — clean full-bleed frame.
 * No layout editor. No motion-scroll gadget.
 */
export function HomeHub() {
  return (
    <section className="hub-page hub-page--locked" aria-label="Celine Nova home">
      <header className="hub-page__header hub-page__header--locked">
        <div className="hub-page__brand hub-page__brand--locked">
          <MelaniSignature variant="light" />
          <p className="hub-page__brand-loc">
            <span className="hub-page__dot-inline" aria-hidden />
            currently in Los Angeles
          </p>
        </div>

        <nav className="hub-page__socials hub-page__socials--locked" aria-label="Social links">
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

      {/* Bottom-left edge — original stagger reveal (hub-nav-reveal) */}
      <footer className="hub-page__footer hub-page__footer--locked">
        <nav className="hub-page__nav hub-page__nav--locked" aria-label="Sections">
          {siteConfig.hubPortals.map((portal, i) => (
            <span
              key={portal.href}
              className="hub-page__nav-item"
              style={{ animationDelay: `${1.15 + i * 0.18}s` }}
            >
              {i > 0 ? <span className="hub-page__sep" aria-hidden> · </span> : null}
              {"external" in portal && portal.external ? (
                <a href={portal.href} target="_blank" rel="noopener noreferrer">
                  {portal.label}
                </a>
              ) : (
                <Link href={portal.href}>{portal.label}</Link>
              )}
            </span>
          ))}
          <span
            className="hub-page__nav-item hub-page__nav-item--contact"
            style={{
              animationDelay: `${1.15 + siteConfig.hubPortals.length * 0.18}s`,
            }}
          >
            <span className="hub-page__sep" aria-hidden> · </span>
            <Link href="/contact" className="hub-page__nav-contact">
              Contact
            </Link>
          </span>
        </nav>
      </footer>
    </section>
  );
}
