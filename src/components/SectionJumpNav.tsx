"use client";

import { useEffect, useState } from "react";
import type { MkSection } from "@/data/mk-page";

interface SectionJumpNavProps {
  sections: MkSection[];
}

export function SectionJumpNav({ sections }: SectionJumpNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    el.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
    setActiveId(id);
    history.replaceState(null, "", href);
  };

  return (
    <nav
      aria-label="Jump to section"
      className="mt-6 flex flex-wrap items-center gap-x-1 gap-y-2"
    >
      {sections.map((section, i) => (
        <span key={section.id} className="inline-flex items-center gap-1">
          {i > 0 && (
            <span className="font-mono-label text-muted-foreground/50 select-none">
              ·
            </span>
          )}
          <a
            href={section.href}
            onClick={(e) => handleClick(e, section.href)}
            className={`font-mono-label text-[11px] transition-colors ${
              activeId === section.id
                ? "text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {section.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
