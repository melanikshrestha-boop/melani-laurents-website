"use client";

type Props = { name: string; size?: number; className?: string };

/** Minimal stand-in for Wonder's icon set — enough for Bookshelf chrome. */
export function MinimalIcon({ name, size = 16, className = "" }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      {name === "books" ? (
        <path
          d="M4 4.5h6.5A2.5 2.5 0 0 1 13 7v13.5a2 2 0 0 0-2-2H4V4.5Zm16 0h-6.5A2.5 2.5 0 0 0 11 7v13.5a2 2 0 0 1 2-2H20V4.5Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ) : (
        <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="1.6" />
      )}
    </svg>
  );
}
