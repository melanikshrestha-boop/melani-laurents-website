import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { storyChapters } from "@/data/story";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "About",
  description:
    "Melani · Celine Nova — founder and engineer. What I build, how I think, how to reach me.",
};

export default function AboutPage() {
  const activeBuilds = projects.filter((p) => p.status === "Active").length;

  return (
    <div className="builds-surface about-surface">
      <div className="builds-surface__inner about-surface__inner">
        <header className="builds-surface__head about-surface__head">
          <h1 className="builds-surface__title">About</h1>
          <p className="about-surface__lede">
            Melani · Celine Nova — open sourcing my mind. Building software and
            companies, not following someone else’s ladder.
          </p>
          <div className="builds-surface__meta" aria-label="At a glance">
            <span>
              <b>{siteConfig.location.split("—")[0]?.trim() || "LA"}</b>
            </span>
            <span>
              <b>{String(activeBuilds).padStart(2, "0")}</b> active builds
            </span>
            <span>
              <b>Bronx Science</b>
            </span>
          </div>
        </header>

        <section className="about-surface__story" aria-label="Story">
          {storyChapters.map((ch) => (
            <article key={ch.id} className="about-surface__chapter">
              <p className="about-surface__chapter-kicker">{ch.title}</p>
              <h2 className="about-surface__chapter-title">{ch.subtitle}</h2>
              {ch.body.map((para) => (
                <p key={para.slice(0, 48)} className="about-surface__p">
                  {para}
                </p>
              ))}
            </article>
          ))}
        </section>

        <section className="about-surface__links" aria-label="Go deeper">
          <h2 className="about-surface__links-title">Start here</h2>
          <ul className="about-surface__link-list">
            <li>
              <Link href="/projects">Builds</Link>
              <span> — what I’m shipping</span>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
              <span> — theses and public opinions</span>
            </li>
            <li>
              <Link href="/bookshelf">Bookshelf</Link>
              <span> — notes and n+1 learning</span>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
              <span> — say hello</span>
            </li>
            <li>
              <a
                href={siteConfig.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <span> — Melani Laurents</span>
            </li>
            <li>
              <a
                href={siteConfig.socialLinks.find((s) => s.id === "github")?.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <span> — code in the open</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
