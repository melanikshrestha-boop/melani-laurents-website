"use client";

import Link from "next/link";
import { BookNowWithBag } from "@/components/ServiceCart";
import { lunara } from "@/lib/lunara";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "New clients", href: "/new-clients" },
  { label: "Visit", href: "/#contact" },
  { label: "Book", href: "/book" },
] as const;

export function SiteHeader() {
  return (
    <header className="lg-header">
      <div className="lg-promo">
        <span>{lunara.offer}</span>
        <span className="lg-promo-dot" aria-hidden>
          ·
        </span>
        <span>{lunara.hours}</span>
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
          <a className="lg-phone" href={`tel:${lunara.phoneDial}`}>
            {lunara.phone}
          </a>
          <BookNowWithBag />

          <details className="lg-menu">
            <summary>Menu</summary>
            <div className="lg-menu-panel">
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
