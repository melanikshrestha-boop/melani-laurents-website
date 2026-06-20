import Link from "next/link";
import { siteConfig, deadPoetsQuote } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Art",
  description: "Photography, cinema, and visual signal by Melani Laurent S.",
};

export default function ArtPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#030508] px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono-label text-[10px] tracking-[0.35em] text-[#7eb8da] uppercase">
          Art · visual signal
        </p>

        <blockquote className="mt-10 border-l-2 border-[#7eb8da]/40 pl-6">
          <p className="font-serif text-2xl leading-relaxed text-[#e8e6e3]/90 sm:text-3xl">
            &ldquo;{deadPoetsQuote}&rdquo;
          </p>
          <footer className="mt-6 font-mono-label text-[10px] tracking-[0.2em] text-[#8a9098] uppercase">
            — John Keating, Dead Poets Society
          </footer>
        </blockquote>

        <p className="mt-12 font-mono-label text-xs leading-relaxed text-[#8a9098]">
          Photography and cinema — visual channels alongside neurotech research.
        </p>

        <Link
          href={siteConfig.photographyPath}
          className="mt-8 inline-block font-mono-label text-[10px] tracking-[0.28em] text-[#e8b86a] uppercase transition-colors hover:text-[#7eb8da]"
        >
          Enter the gallery →
        </Link>

        <Link
          href="/"
          className="mt-6 block font-mono-label text-[10px] tracking-[0.2em] text-[#8a9098]/60 uppercase hover:text-[#8a9098]"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
