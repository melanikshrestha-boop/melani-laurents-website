"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/config/site";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";
import "./cinema-nav.css";

/** Art + Contact carry the home-hub gold accent. */
function isGoldNavItem(item: NavItem): boolean {
  const label = item.label.trim().toLowerCase();
  if (label === "art" || label === "contact") return true;
  const href = item.href;
  if (href === "/contact" || href.startsWith("/contact/")) return true;
  // Home hub “Art” points at photography
  if (href === "/photography" || href.startsWith("/photography/")) return true;
  if (href.startsWith("/art")) return true;
  return false;
}

function NavLink({
  item,
  paper = false,
  gold = false,
}: {
  item: NavItem;
  paper?: boolean;
  gold?: boolean;
}) {
  // Share Tech Mono via .cinema-nav__link — same DNA as home hub
  const className = [
    "cinema-nav__link",
    paper ? "cinema-nav__link--paper" : "cinema-nav__link--cinema",
    gold ? "cinema-nav__link--gold" : "",
  ]
    .filter(Boolean)
    .join(" ");

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
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/");

  const bookshelf =
    pathname === "/bookshelf" || pathname.startsWith("/bookshelf/");

  if (pathname === "/") return null;

  /** Home hub stagger: 1.15 + i*0.18 — top bar is snappier but same motion curve */
  const revealDelay = (i: number) => `${0.12 + i * 0.14}s`;

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
            {siteConfig.nav.map((item, i) => (
              <li
                key={item.href}
                className="cinema-nav__item"
                style={{ animationDelay: revealDelay(i) }}
              >
                <NavLink
                  item={item}
                  paper={paper}
                  gold={isGoldNavItem(item)}
                />
              </li>
            ))}
          </ul>

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
              {siteConfig.nav.map((item, i) => (
                <div
                  key={item.href}
                  className="cinema-nav__item px-4 py-2"
                  style={{ animationDelay: revealDelay(i) }}
                >
                  <NavLink
                    item={item}
                    paper={paper}
                    gold={isGoldNavItem(item)}
                  />
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
