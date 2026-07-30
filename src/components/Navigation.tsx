"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/config/site";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";

function NavLink({ item, paper = false }: { item: NavItem; paper?: boolean }) {
  // Match home hub (.hub-page__nav): Share Tech Mono — not IBM Plex label mono
  const className = paper
    ? "cinema-nav__link cinema-nav__link--paper"
    : "cinema-nav__link cinema-nav__link--cinema";

  if ("external" in item && item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {item.label} ↗
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const paper =
    pathname === "/daily" ||
    pathname.startsWith("/daily/") ||
    pathname === "/research" ||
    pathname.startsWith("/research/") ||
    pathname === "/podcast" ||
    pathname.startsWith("/podcast/") ||
    pathname === "/youtube" ||
    pathname.startsWith("/youtube/") ||
    // Same cream paper as the shelf — no black bar / color divide
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/");

  const bookshelf =
    pathname === "/bookshelf" || pathname.startsWith("/bookshelf/");

  if (pathname === "/") return null;

  return (
    <header
      className={`cinema-nav fixed top-0 left-0 right-0 z-50${paper ? " cinema-nav--paper" : ""}${bookshelf ? " cinema-nav--bookshelf" : ""}`}
    >
      <nav
        className={
          bookshelf
            ? "cinema-nav__inner--bookshelf flex h-14 w-full max-w-none items-center justify-between"
            : "mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
        }
      >
        {/* Logo hard-left; links hard-right (bookshelf) */}
        <MelaniSignature
          variant={paper ? "ink" : "light"}
          className={`melani-signature--nav${bookshelf ? " melani-signature--nav-edge" : ""}`}
        />

        <div
          className={
            bookshelf
              ? "cinema-nav__end flex items-center gap-4 sm:gap-5"
              : "flex items-center gap-5"
          }
        >
          <ul className="hidden items-center gap-4 sm:gap-5 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink item={item} paper={paper} />
              </li>
            ))}
          </ul>

          {/* Social icons sit between links and edge elsewhere; omit on shelf so CONTACT is true right edge */}
          {!bookshelf ? (
            <SocialIcons className="hidden sm:flex" size="sm" />
          ) : null}

          <details className="relative md:hidden">
            <summary
              className={`cinema-nav__link cursor-pointer list-none${paper ? " cinema-nav__link--paper" : " cinema-nav__link--cinema"}`}
            >
              Menu
            </summary>
            <div
              className={`cinema-hud-panel absolute right-0 top-full mt-2 w-52 py-2 shadow-xl${paper ? " cinema-hud-panel--paper" : ""}`}
            >
              {siteConfig.nav.map((item) => (
                <div key={item.href} className="px-4 py-2">
                    <NavLink item={item} paper={paper} />
                </div>
              ))}
              <div className="mt-2 px-4 pt-3">
                <SocialIcons size="sm" />
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
