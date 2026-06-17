"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { BrandWordmark } from "./BrandWordmark";
import { SocialIcons } from "./SocialIcons";

export function Navigation() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="transition-opacity hover:opacity-70"
        >
          <BrandWordmark size="md" />
        </Link>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-5 md:flex">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden h-4 w-px bg-border md:block" />

          <SocialIcons className="hidden sm:flex" />

          {/* Mobile menu — simplified nav dropdown via details */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none text-sm text-muted">
              Menu
            </summary>
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-surface py-2 shadow-xl">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-4 py-2 text-sm text-muted hover:bg-surface-elevated hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 border-t border-border px-4 pt-2">
                <SocialIcons size="sm" />
              </div>
            </div>
          </details>
        </div>
      </nav>
    </header>
  );
}
