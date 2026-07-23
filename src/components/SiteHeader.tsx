"use client";

import Link from "next/link";
import { BookNowWithBag } from "@/components/ServiceCart";
import { lunara } from "@/lib/lunara";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "New clients", href: "/new-clients" },
  { label: "Contact", href: "/#contact" },
  { label: "Book", href: "/book" },
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="promo-strip">
        <span>{lunara.offer}</span>
        <span className="promo-sep" aria-hidden>
          ·
        </span>
        <span>{lunara.hours}</span>
      </div>

      <div className="header-bar section">
        <Link href="/" className="brand-wordmark">
          {lunara.shortName}
        </Link>

        <nav className="header-nav" aria-label="Main">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href={`tel:${lunara.phoneDial}`}>
            {lunara.phone}
          </a>
          <BookNowWithBag />

          <details className="header-menu">
            <summary>Menu</summary>
            <div className="header-menu-panel">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href={`tel:${lunara.phoneDial}`}>Call</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
