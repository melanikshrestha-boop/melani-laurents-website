"use client";

import { useEffect, useState } from "react";
import type { MkSection } from "@/data/mk-page";

interface SectionJumpNavProps {
  sections: MkSection[];
}

export function SectionJumpNav({ sections }: SectionJumpNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const elements = sections
      .map((s) => document.getElementById(s.id))
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
      { rootMargin: "-25% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
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
      className="mt-8 flex flex-col gap-3 border-l border-border pl-4"
    >
      {sections.map((section) => (
        <a
          key={section.id}
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
      ))}
    </nav>
  );
}
