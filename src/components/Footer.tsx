"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "./BrandWordmark";

export function Footer() {
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
    <footer
      className={
        paper
          ? "site-footer--paper border-t border-black/10 bg-[var(--hub-cream)]"
          : "border-t border-white/8 bg-black/40 backdrop-blur-sm"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandWordmark size="sm" />
          <p
            className={`mt-2 font-mono-label text-[10px] tracking-[0.28em] uppercase${paper ? " text-black/45" : " text-amber/50"}`}
          >
            always creating · art · med-tech
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/art"
            className={`font-mono-label text-[10px] tracking-[0.22em] uppercase transition-colors${paper ? " text-black/50 hover:text-[var(--hub-gold)]" : " text-white/40 hover:text-amber/80"}`}
          >
            Art →
          </Link>
          <Link
            href="/"
            className={`font-mono-label text-[10px] tracking-[0.2em] uppercase${paper ? " text-black/35 hover:text-black/65" : " text-white/25 hover:text-white/50"}`}
          >
            ← Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
