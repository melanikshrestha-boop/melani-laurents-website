import Link from "next/link";
import { siteConfig, deadPoetsQuote } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Art",
  description: "Photography, cinema, and visual work by Melani Laurent S.",
};

export default function ArtPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f0ede5] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono-label text-[10px] tracking-[0.35em] text-[#a68b2a] uppercase">
          Art · Dead Poets Society
        </p>

        <blockquote className="mt-10 border-l-2 border-[#d4af37] pl-6">
          <p className="font-serif text-2xl leading-relaxed text-[#3d3830] sm:text-3xl">
            &ldquo;{deadPoetsQuote}&rdquo;
          </p>
          <footer className="mt-6 font-mono-label text-[10px] tracking-[0.2em] text-[#6b6358] uppercase">
            — John Keating, Dead Poets Society
          </footer>
        </blockquote>

        <p className="mt-12 font-mono-label text-xs leading-relaxed text-[#6b6358]">
          Photography and cinema live here — one category, all art.
        </p>

        <Link
          href={siteConfig.photographyPath}
          className="mt-8 inline-block font-mono-label text-[10px] tracking-[0.28em] text-[#a68b2a] uppercase transition-colors hover:text-[#d4af37]"
        >
          Enter the gallery →
        </Link>

        <Link
          href="/"
          className="mt-6 block font-mono-label text-[10px] tracking-[0.2em] text-[#6b6358]/60 uppercase hover:text-[#6b6358]"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
