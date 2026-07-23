"use client";

/**
 * Site header — promo shine strip + nav + language switcher.
 * Why: first thing you see should literally shine (left → right glow).
 * How: overflow-hidden promo bar + CSS sheen animation (from original repo).
 */

import Link from "next/link";
import { BookNowWithBag } from "@/components/ServiceCart";
import { LANG_OPTIONS, useI18n } from "@/lib/i18n";
import { lunara } from "@/lib/lunara";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();

  // Nav labels switch with language
  const navItems = [
    { label: t("navServices"), href: "/#services" },
    { label: t("navNew"), href: "/new-clients" },
    { label: t("navVisit"), href: "/#contact" },
    { label: t("navBook"), href: "/book" },
  ] as const;

  return (
    <header className="lg-header">
      {/* Promo bar: full offer + hours, sheen sweeps left → right */}
      <div className="lg-promo" role="status" aria-live="polite">
        <span className="lg-promo-text">{t("promoFull")}</span>
      </div>

      <div className="lg-header-bar">
        <nav className="lg-nav lg-nav-left" aria-label="Main">
          {navItems.slice(0, 2).map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="lg-logo">
          {lunara.shortName}
        </Link>

        <div className="lg-header-right">
          <nav className="lg-nav lg-nav-right" aria-label="More">
            {navItems.slice(2).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher — EN / ES / HI, accessible for everyone */}
          <div
            className="lg-lang"
            role="group"
            aria-label={t("langLabel")}
          >
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`lg-lang-btn${lang === opt.id ? " is-active" : ""}`}
                onClick={() => setLang(opt.id)}
                aria-pressed={lang === opt.id}
                title={opt.label}
              >
                {opt.native}
              </button>
            ))}
          </div>

          <a className="lg-phone" href={`tel:${lunara.phoneDial}`}>
            {lunara.phone}
          </a>
          <BookNowWithBag />

          <details className="lg-menu">
            <summary>{t("navMenu")}</summary>
            <div className="lg-menu-panel">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href={`tel:${lunara.phoneDial}`}>{t("navCall")}</a>
              <div className="lg-lang lg-lang-menu" role="group" aria-label={t("langLabel")}>
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`lg-lang-btn${lang === opt.id ? " is-active" : ""}`}
                    onClick={() => setLang(opt.id)}
                    aria-pressed={lang === opt.id}
                  >
                    {opt.native}
                  </button>
                ))}
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
