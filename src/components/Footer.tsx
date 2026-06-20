"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandWordmark } from "./BrandWordmark";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-white/8 bg-black/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <BrandWordmark size="sm" />
          <p className="mt-2 font-mono-label text-[10px] tracking-[0.28em] text-amber/50 uppercase">
            always creating · art · med-tech
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <Link
            href="/art"
            className="font-mono-label text-[10px] tracking-[0.22em] text-white/40 uppercase transition-colors hover:text-amber/80"
          >
            Art →
          </Link>
          <Link
            href="/"
            className="font-mono-label text-[10px] tracking-[0.2em] text-white/25 uppercase hover:text-white/50"
          >
            ← Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
