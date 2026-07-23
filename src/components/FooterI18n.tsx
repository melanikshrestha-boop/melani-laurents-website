"use client";

/**
 * Footer with translated labels (EN / ES / HI).
 */

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { lunara } from "@/lib/lunara";

export function FooterI18n() {
  const { t } = useI18n();

  const navItems = [
    { label: t("navServices"), href: "/#services" },
    { label: t("navNew"), href: "/new-clients" },
    { label: t("navVisit"), href: "/#contact" },
    { label: t("navBook"), href: "/book" },
  ] as const;

  return (
    <footer className="lg-footer">
      <div className="lg-wrap lg-footer-grid">
        <div>
          <p className="lg-footer-brand">{lunara.shortName}</p>
          <p className="lg-footer-note">{t("footerNote")}</p>
        </div>
        <div className="lg-footer-col">
          <p className="lg-footer-label">{t("footerVisit")}</p>
          <p>{lunara.address}</p>
          <p>{t("hoursDisplay")}</p>
          <p>
            <a href={`tel:${lunara.phoneDial}`}>{lunara.phone}</a>
          </p>
          <p>
            <a href={`mailto:${lunara.email}`}>{lunara.email}</a>
          </p>
          <p>{lunara.instagram}</p>
        </div>
        <div className="lg-footer-col">
          <p className="lg-footer-label">{t("footerNav")}</p>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <a href={lunara.yelp} target="_blank" rel="noreferrer">
            {t("yelpReviews")}
          </a>
        </div>
      </div>
    </footer>
  );
}
