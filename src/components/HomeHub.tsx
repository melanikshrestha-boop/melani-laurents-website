"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { HubHeroQuote } from "./HubHeroQuote";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";
import { MelaniSignature } from "./MelaniSignature";
import { MotionScrollToggle } from "./MotionScrollToggle";
import { NeurotechBrainField } from "./NeurotechBrainField";
import { SocialIcons } from "./SocialIcons";

const HUB_HINT_KEY = "hub-interacted";

/** Carlo Doroff–style editorial hub — dark void hero morphs to cream on scroll. */
export function HomeHub() {
  const [hintVisible, setHintVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(HUB_HINT_KEY)) return;
    setHintVisible(true);

    const dismiss = () => {
      sessionStorage.setItem(HUB_HINT_KEY, "1");
      setHintVisible(false);
    };

    window.addEventListener("mousemove", dismiss, { once: true, passive: true });
    window.addEventListener("scroll", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", dismiss, { once: true });

    return () => {
      window.removeEventListener("mousemove", dismiss);
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("touchstart", dismiss);
      window.removeEventListener("keydown", dismiss);
    };
  }, []);

  return (
    <section className="hub-page">
      <NeurotechBrainField variant="hub" active />
      <div className="hub-page__rail hub-page__rail--left" aria-hidden />
      <div className="hub-page__rail hub-page__rail--right" aria-hidden />

      {hintVisible ? (
        <p className="hub-page__hint" aria-live="polite">
          <span className="hub-page__hint-move">move to interact</span>
          <span className="hub-page__hint-sep" aria-hidden>
            {" "}
            ·{" "}
          </span>
          <span className="hub-page__hint-scroll">scroll to explore</span>
        </p>
      ) : null}

      <header className="hub-page__header">
        <div className="hub-page__brand">
          <MelaniSignature variant="ink" />
          <div className="hub-page__brand-meta">
            <p className="hub-page__brand-tag">podcast · research · daily · art</p>
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
        <HubHeroQuote />
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
              <Link href={portal.href}>{portal.label}</Link>
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
    </section>
  );
}
