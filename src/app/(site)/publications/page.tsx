import type { Metadata } from "next";
import Link from "next/link";
import {
  publicationProfile,
  publications,
} from "@/data/publications";

export const metadata: Metadata = {
  title: "Publications",
  description:
    "Patents and publications by Melani Laurent S. — in-ear EEG and neurotech research.",
};

export default function PublicationsPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <h1 className="font-sans text-3xl font-semibold text-foreground md:text-4xl">
            Publications
          </h1>
          <p className="mt-4 text-muted leading-relaxed">
            {publicationProfile.affiliation}
          </p>
          <a
            href={publicationProfile.scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block font-mono-label text-accent hover:underline underline-offset-4"
          >
            Full profile on Google Scholar ↗
          </a>
        </header>

        <ol className="flex flex-col gap-8">
          {publications.map((pub, index) => (
            <li
              key={`${pub.venue}-${pub.year}`}
              className="border-l-2 border-accent/30 pl-5"
            >
              <p className="font-mono-label text-[10px] text-muted-foreground mb-2">
                {pub.kind === "patent" ? "Patent" : "Article"} · {pub.year}
              </p>
              <p className="text-base font-medium leading-snug text-foreground">
                {pub.title}
              </p>
              <p className="mt-2 font-mono-label text-[10px] text-muted-foreground leading-relaxed">
                {pub.authors}
              </p>
              <p className="mt-1 font-mono-label text-[10px] text-accent/90">
                {pub.venue}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-sm text-muted">
          <Link href="/about" className="text-accent hover:underline underline-offset-4">
            About
          </Link>
          {" · "}
          <a
            href="https://www.linkedin.com/in/melanilaurents/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline underline-offset-4"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </div>
  );
}
