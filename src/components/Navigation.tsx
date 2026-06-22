"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, type NavItem } from "@/config/site";
import { MelaniSignature } from "./MelaniSignature";
import { SocialIcons } from "./SocialIcons";

function NavLink({ item, paper = false }: { item: NavItem; paper?: boolean }) {
  const className = paper
    ? "font-mono-label text-[10px] tracking-[0.22em] uppercase text-black/50 transition-colors hover:text-[var(--hub-gold)]"
    : "font-mono-label text-[10px] tracking-[0.22em] uppercase text-white/45 transition-colors hover:text-amber/90";

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
    pathname.startsWith("/podcast/");

  if (pathname === "/") return null;

  return (
    <header
      className={`cinema-nav fixed top-0 left-0 right-0 z-50${paper ? " cinema-nav--paper" : ""}`}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <MelaniSignature
          variant={paper ? "ink" : "light"}
          className="melani-signature--nav"
        />

        <div className="flex items-center gap-5">
          <ul className="hidden items-center gap-5 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <NavLink item={item} paper={paper} />
              </li>
            ))}
          </ul>

          <div
            className={`hidden h-4 w-px md:block${paper ? " bg-black/10" : " bg-white/10"}`}
          />

          <SocialIcons className="hidden sm:flex" size="sm" />

          <details className="relative md:hidden">
            <summary
              className={`cursor-pointer list-none font-mono-label text-[10px] tracking-[0.2em] uppercase${paper ? " text-black/60" : " text-white/60"}`}
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
              <div className="mt-2 border-t border-white/10 px-4 pt-3">
                <SocialIcons size="sm" />
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
