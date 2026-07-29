"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { HomeDesignTuner } from "./HomeDesignTuner";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { MotionScrollToggle } from "./MotionScrollToggle";
import { SocialIcons } from "./SocialIcons";

/** Carlo Doroff–style editorial hub — dark void hero morphs to cream on scroll. */
export function HomeHub() {
  return (
    <section className="hub-page">
      <header className="hub-page__header">
        <div className="hub-page__brand">
          <MelaniSignature variant="ink" />
          <div className="hub-page__brand-meta">
            <p className="hub-page__brand-loc">
              <span className="hub-page__dot-inline" aria-hidden />
              LA / SF / NYC
            </p>
          </div>
        </div>

        <nav className="hub-page__socials" aria-label="Social links">
          <SocialIcons size="hub" className="hub-page__social-icons" />
        </nav>
      </header>

      <div className="hub-page__center">
        <InteractiveTitleLetters
          variant="hub"
          className="hub-page__title"
          lineClassName="hub-page__title-line"
        />
        <div className="hub-page__thesis">
          <p className="hub-page__tagline">open sourcing my mind.</p>
        </div>
      </div>

      <footer className="hub-page__footer">
        <nav className="hub-page__nav" aria-label="Sections">
          {siteConfig.hubPortals.map((portal, i) => (
            <span
              key={portal.href}
              className="hub-page__nav-item"
              style={{ animationDelay: `${1.15 + i * 0.18}s` }}
            >
              {i > 0 ? <span className="hub-page__sep"> · </span> : null}
              {"external" in portal && portal.external ? (
                <a
                  href={portal.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {portal.label}
                </a>
              ) : (
                <Link href={portal.href}>{portal.label}</Link>
              )}
            </span>
          ))}
          <span
            className="hub-page__nav-item hub-page__nav-item--contact"
            style={{ animationDelay: `${1.15 + siteConfig.hubPortals.length * 0.18}s` }}
          >
            <span className="hub-page__sep"> · </span>
            <Link href="/contact" className="hub-page__nav-contact">
              Contact
            </Link>
          </span>
        </nav>
      </footer>

      <MotionScrollToggle />
      <HomeDesignTuner />
    </section>
  );
}
