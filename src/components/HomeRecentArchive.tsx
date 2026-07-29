import Link from "next/link";
import { HomeScrollExperience } from "@/components/HomeScrollExperience";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { projects } from "@/data/projects";

const SHELVES = [
  {
    number: "01",
    label: "Art",
    kind: "Visual work",
    href: "/photography",
    description: "Photography, cinema, and the visual worlds I make.",
  },
  {
    number: "02",
    label: "Essays",
    kind: "Writing",
    href: "/daily#journals",
    description: "Reflections, arguments, and predictions worth timestamping.",
  },
  {
    number: "03",
    label: "Bookshelf",
    kind: "Reading",
    href: "/daily#bookshelf",
    description: "Highlights and notes from books that changed how I think.",
  },
  {
    number: "04",
    label: "Builds",
    kind: "Making",
    href: "/projects",
    description: "Products, experiments, systems, and open-source work.",
  },
  {
    number: "05",
    label: "Daily",
    kind: "Inputs",
    href: "/daily#inputs",
    description: "What I read, watch, hear, and learn while it is still fresh.",
  },
] as const;

export function HomeRecentArchive() {
  return (
    <HomeScrollExperience>
      <section className="hub-archive" aria-label="Celine Nova open source index">
        <div className="hub-archive__inner">
          <div className="hub-archive__intro">
            <p className="hub-archive__eyebrow">Open source index</p>
            <p className="hub-archive__intro-note">
              What I make, notice, and keep.
            </p>
          </div>

          <section className="hub-open-index" aria-label="Explore the archive">
            {SHELVES.map((shelf) => (
              <Link
                key={shelf.label}
                href={shelf.href}
                className="hub-open-index__item"
              >
                <span>
                  {shelf.number} · {shelf.kind}
                </span>
                <strong>{shelf.label}</strong>
                <p>{shelf.description}</p>
              </Link>
            ))}
          </section>

          <section className="hub-builds-preview" aria-labelledby="home-builds-title">
            <header className="hub-builds-preview__header">
              <div>
                <p className="hub-archive__eyebrow">Currently building</p>
                <h2 id="home-builds-title">Things becoming real.</h2>
              </div>
              <Link href="/projects">All builds →</Link>
            </header>

            <div className="hub-builds-preview__grid">
              {projects.slice(0, 3).map((project) => (
                <article key={project.id} className="hub-builds-preview__item">
                  <span>{project.status}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.href ? (
                    <a href={project.href} target="_blank" rel="noopener noreferrer">
                      Open on GitHub ↗
                    </a>
                  ) : (
                    <Link href="/projects">View build →</Link>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="hub-archive__newsletter">
            <NewsletterSignup variant="footer" />
          </section>
        </div>
      </section>
    </HomeScrollExperience>
  );
}
