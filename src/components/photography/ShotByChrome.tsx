"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SHOTBY_BASE,
  SHOTBY_EMAIL,
  SHOTBY_INSTAGRAM,
  SHOTBY_PHONE,
} from "@/data/shotby-catalog";

export function ShotByChrome({
  overlay = false,
}: {
  overlay?: boolean;
}) {
  const pathname = usePathname();
  const onPortfolio =
    pathname === SHOTBY_BASE ||
    pathname.startsWith(`${SHOTBY_BASE}/portraits`) ||
    pathname.startsWith(`${SHOTBY_BASE}/vision`) ||
    pathname.startsWith(`${SHOTBY_BASE}/scenery`);
  const onAbout = pathname.startsWith(`${SHOTBY_BASE}/about`);

  return (
    <header className={`shotby-bar${overlay ? " shotby-bar--overlay" : ""}`}>
      <Link href={SHOTBY_BASE} className="shotby-bar__logo">
        SHOTBYCELINE
      </Link>
      <nav className="shotby-bar__nav" aria-label="Photography">
        <Link
          href={SHOTBY_BASE}
          className={`shotby-bar__link${onPortfolio && !onAbout ? " is-current" : ""}`}
        >
          Portfolio
        </Link>
        <Link
          href={`${SHOTBY_BASE}/about`}
          className={`shotby-bar__link${onAbout ? " is-current" : ""}`}
        >
          About
        </Link>
        <a
          href={SHOTBY_INSTAGRAM}
          className="shotby-bar__ig"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <rect
              x="3.5"
              y="3.5"
              width="17"
              height="17"
              rx="5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle
              cx="12"
              cy="12"
              r="4.1"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
          </svg>
        </a>
        <Link href="/photography/book" className="shotby-bar__book">
          BOOK NOW
        </Link>
      </nav>
    </header>
  );
}

export function ShotByFooter() {
  return (
    <footer className="shotby-foot">
      <p className="shotby-foot__handle">@SHOTBYCELINE</p>
      <div className="shotby-foot__col">
        <p className="shotby-foot__label">LOCATION</p>
        <p>Based in Los Angeles, California</p>
      </div>
      <div className="shotby-foot__col">
        <p className="shotby-foot__label">CONTACT</p>
        <p>
          <a href={`mailto:${SHOTBY_EMAIL}`}>{SHOTBY_EMAIL}</a>
        </p>
        <p>
          <a href={`tel:${SHOTBY_PHONE.replace(/[^\d]/g, "")}`}>{SHOTBY_PHONE}</a>
        </p>
      </div>
    </footer>
  );
}
