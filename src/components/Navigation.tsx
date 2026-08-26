"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/config/site";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";
import "./cinema-nav.css";

/** Path part of href (no hash). */
function hrefPath(href: string): string {
  return href.split("#")[0] || "/";
}

/** Hide the section you're already in. */
function isCurrentNavItem(pathname: string, item: NavItem): boolean {
  const path = hrefPath(item.href);
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
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
    <Link href={item.href} className={className} prefetch>
      {item.label}
    </Link>
  );
}

export function Navigation() {
  const pathname = usePathname();

  // Home keeps its own hub nav
  if (pathname === "/") return null;

  /** Art / photography — full-bleed profile, not cream paper product */
  const isArt =
    pathname === "/photography" || pathname.startsWith("/photography/");

  const paper =
    !isArt &&
    (pathname === "/daily" ||
      pathname.startsWith("/daily/") ||
      pathname === "/research" ||
      pathname.startsWith("/research/") ||
      pathname === "/podcast" ||
      pathname.startsWith("/podcast/") ||
      pathname === "/youtube" ||
      pathname.startsWith("/youtube/") ||
      pathname === "/bookshelf" ||
      pathname.startsWith("/bookshelf/") ||
      pathname === "/projects" ||
      pathname.startsWith("/projects/") ||
      pathname === "/blog" ||
      pathname.startsWith("/blog/") ||
      pathname === "/diary" ||
      pathname.startsWith("/diary/") ||
      pathname === "/consume" ||
      pathname.startsWith("/consume/") ||
      pathname === "/contact" ||
      pathname.startsWith("/contact/"));

  const edgePaper =
    !isArt &&
    (pathname === "/bookshelf" ||
      pathname.startsWith("/bookshelf/") ||
      pathname === "/projects" ||
      pathname.startsWith("/projects/") ||
      pathname === "/blog" ||
      pathname.startsWith("/blog/") ||
      pathname === "/diary" ||
      pathname.startsWith("/diary/") ||
      pathname === "/daily" ||
      pathname.startsWith("/daily/") ||
      pathname === "/contact" ||
      pathname.startsWith("/contact/"));

  /** Current page dropped; first + last of what's left go gold */
  const items = siteConfig.nav.filter(
    (item) => !isCurrentNavItem(pathname, item),
  );

  const revealDelay = (i: number) => `${0.12 + i * 0.14}s`;

  const headerClass = [
    "cinema-nav fixed top-0 left-0 right-0 z-[100]",
    paper ? "cinema-nav--paper" : "",
    edgePaper ? "cinema-nav--bookshelf" : "",
    isArt ? "cinema-nav--art" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <nav
        className={
          edgePaper || isArt
            ? "cinema-nav__inner--bookshelf flex h-14 w-full max-w-none items-center justify-between"
            : "mx-auto flex h-14 max-w-6xl items-center justify-between px-6"
        }
        aria-label="Primary"
      >
        <MelaniSignature
          variant={paper ? "ink" : "light"}
          className={`melani-signature--nav${edgePaper || isArt ? " melani-signature--nav-edge" : ""}`}
        />

        <div
          className={
            edgePaper || isArt
              ? "cinema-nav__end flex items-center gap-4 sm:gap-5"
              : "flex items-center gap-5"
          }
        >
          {/* Always inline — no Menu toggle. Wraps rather than collapsing so
              every section stays one click away at any width. */}
          <ul className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-4 md:gap-5">
            {items.map((item, i) => (
              <li
                key={item.href}
                className="cinema-nav__item"
                style={{ animationDelay: revealDelay(i) }}
              >
                <NavLink
                  item={item}
                  paper={paper}
                  gold={i === 0 || i === items.length - 1}
                />
              </li>
            ))}
          </ul>

          {/* Social row only on dark non-art inner pages — not on art profile */}
          {!edgePaper && !isArt ? (
            <SocialIcons className="hidden sm:flex" size="sm" />
          ) : null}

        </div>
      </nav>
    </header>
  );
}
