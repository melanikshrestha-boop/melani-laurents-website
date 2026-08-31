import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { GITHUB_PROFILE_URL } from "@/lib/github-contributions";
import { googleScholarUrl } from "@/data/publications";
import { BuildsGithub } from "./BuildsGithub";

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LINKEDIN_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SCHOLAR_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
  </svg>
);

function PresenceLink({
  href,
  label,
  mark,
  id,
}: {
  href: string;
  label: string;
  mark: ReactNode;
  id?: string;
}) {
  return (
    <a
      id={id}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="builds-presence__link"
    >
      <span className="builds-presence__mark">{mark}</span>
      <span className="builds-presence__name">{label}</span>
    </a>
  );
}

export async function BuildsPresence() {
  return (
    <div className="builds-presence">
      <PresenceLink
        href="https://melanilaurents.com"
        label="Personal Website"
        mark={
          // Square Eren — never a C, never circled.
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/icon-eren.png" alt="" />
        }
      />
      <section className="builds-presence__github" aria-labelledby="builds-github-title">
        <PresenceLink
          id="builds-github-title"
          href={GITHUB_PROFILE_URL}
          label="GitHub"
          mark={GITHUB_ICON}
        />
        <BuildsGithub />
      </section>
      <PresenceLink
        href={siteConfig.linkedinUrl}
        label="LinkedIn"
        mark={LINKEDIN_ICON}
      />
      <PresenceLink
        href={googleScholarUrl}
        label="Google Scholar"
        mark={SCHOLAR_ICON}
      />
    </div>
  );
}
