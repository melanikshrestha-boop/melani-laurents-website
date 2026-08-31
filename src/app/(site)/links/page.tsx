import type { Metadata } from "next";
import Link from "next/link";
import { bioLinks, siteConfig } from "@/config/site";
import "@/styles/links.css";

export const metadata: Metadata = {
  title: { absolute: siteConfig.name },
  description: siteConfig.description,
  alternates: { canonical: "/links" },
};

function isExternal(href: string) {
  return /^(https?:|mailto:)/i.test(href);
}

export default function LinksPage() {
  return (
    <div className="bio-links">
      <header>
        <Link href="/" className="bio-links__mark" aria-label="Celine Nova home">
          <span className="bio-links__photo" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-eren.png" alt="" />
          </span>
          <h1 className="bio-links__name">Celine Nova.</h1>
        </Link>
      </header>
      <nav className="bio-links__list" aria-label="Links">
        {bioLinks.map((link) =>
          isExternal(link.href) ? (
            <a
              key={`${link.label}:${link.href}`}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ) : (
            <Link key={`${link.label}:${link.href}`} href={link.href}>
              {link.label}
            </Link>
          ),
        )}
      </nav>
    </div>
  );
}
