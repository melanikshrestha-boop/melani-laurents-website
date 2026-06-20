import type { ResumeData } from "@/data/mk-page";

interface ResumeSectionProps {
  data: ResumeData;
}

function ExternalScholarLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent-muted/40 px-4 py-2.5 font-mono-label text-[11px] text-accent transition-colors hover:border-accent hover:bg-accent-muted/60"
    >
      {label}
      <span aria-hidden className="text-muted-foreground">
        ↗
      </span>
    </a>
  );
}

function PlaceholderNote() {
  return (
    <p className="font-mono-label text-[10px] text-muted-foreground">
      {"// fill in — edit src/data/mk-page.ts"}
    </p>
  );
}

export function ResumeSection({ data }: ResumeSectionProps) {
  const { scholar, publications, experience, education, skills } = data;

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-6">
        <div className="max-w-xl space-y-2">
          <p className="font-mono-label text-[10px] text-muted-foreground">
            scholar.profile
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {scholar.affiliation}
          </p>
        </div>
        <ExternalScholarLink
          href={scholar.url}
          label="Patents & publications on Google Scholar"
        />
      </div>

      <div>
        <h3 className="font-sans text-lg font-medium text-foreground">
          Patents & publications
        </h3>
        <p className="mt-1 font-mono-label text-[10px] text-muted-foreground">
          sourced from Google Scholar · in-ear EEG / neurotech
        </p>
        <ol className="mt-6 space-y-5">
          {publications.map((pub, index) => (
            <li
              key={`${pub.venue}-${pub.year}-${index}`}
              className="border-l-2 border-accent/25 pl-5"
            >
              <p className="text-sm font-medium leading-snug text-foreground">
                {pub.title}
              </p>
              <p className="mt-1.5 font-mono-label text-[10px] text-muted-foreground leading-relaxed">
                {pub.authors}
              </p>
              <p className="mt-1 font-mono-label text-[10px] text-accent/90">
                {pub.kind === "patent" ? "US patent application" : pub.kind}{" "}
                · {pub.venue} · {pub.year}
                {pub.citations != null && pub.citations > 0
                  ? ` · cited ${pub.citations}×`
                  : null}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <h3 className="font-sans text-lg font-medium text-foreground">
            Experience
          </h3>
          {experience.length > 0 ? (
            <ul className="mt-5 space-y-5">
              {experience.map((entry) => (
                <li key={`${entry.organization}-${entry.role ?? "role"}`}>
                  <p className="text-sm font-medium text-foreground">
                    {entry.role ?? "Role"}
                    {entry.role ? null : (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        (placeholder)
                      </span>
                    )}
                  </p>
                  <p className="font-mono-label text-[10px] text-accent/90">
                    {entry.organization}
                    {entry.period ? ` · ${entry.period}` : null}
                  </p>
                  {entry.detail && (
                    <p className="mt-1.5 text-sm text-muted leading-relaxed">
                      {entry.detail}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <PlaceholderNote />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-sans text-lg font-medium text-foreground">
            Education
          </h3>
          <ul className="mt-5 space-y-4">
            {education.map((entry) => (
              <li key={entry.organization}>
                <p className="text-sm font-medium text-foreground">
                  {entry.organization}
                </p>
                {entry.detail && (
                  <p className="mt-1 font-mono-label text-[10px] text-muted-foreground">
                    {entry.detail}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-sans text-lg font-medium text-foreground">
          Skills
        </h3>
        <dl className="mt-5 flex flex-col gap-4">
          {skills.map((group) => (
            <div
              key={group.label}
              className="rounded-lg border border-border/60 bg-surface/50 px-4 py-3"
            >
              <dt className="font-mono-label text-[10px] text-accent">
                {group.label}
              </dt>
              <dd className="mt-2 text-sm text-muted leading-relaxed">
                {group.items.join(" · ")}
              </dd>
            </div>
          ))}
        </dl>
        {skills.some((g) => g.placeholder) && (
          <div className="mt-3">
            <PlaceholderNote />
          </div>
        )}
      </div>
    </div>
  );
}
