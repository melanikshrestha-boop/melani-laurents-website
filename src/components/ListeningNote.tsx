import { siteConfig } from "@/config/site";

export function ListeningNote({ context }: { context: "daily" | "art" }) {
  return (
    <aside className={`listening-note listening-note--${context}`}>
      <div className="listening-note__pointer" aria-hidden>
        <p>
          While I was writing this, this was probably what I was listening to
          while writing this.
        </p>
        <span>→</span>
      </div>
      <a href={siteConfig.spotifyUrl} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M5.25 9.15c4.75-1.35 9.59-1.06 13.55.92M6.5 13.05c3.93-1.03 8.02-.76 11.16.79M7.55 16.55c3.08-.72 6.15-.47 8.62.73"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <span>
          <strong>I&apos;m an avid music lover.</strong>
          <small>My Spotify ↗</small>
        </span>
      </a>
    </aside>
  );
}
