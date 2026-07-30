"use client";

import { usePathname } from "next/navigation";
import { InterstellarField } from "@/components/cinema/InterstellarField";

export function SiteBackground() {
  const pathname = usePathname();
  const paper =
    pathname === "/" ||
    pathname === "/daily" ||
    pathname.startsWith("/daily/") ||
    pathname === "/research" ||
    pathname.startsWith("/research/") ||
    pathname === "/podcast" ||
    pathname.startsWith("/podcast/") ||
    pathname === "/youtube" ||
    pathname.startsWith("/youtube/") ||
    // Bookshelf is a flat cream reading surface — no black space field under it
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/");
  if (paper) return null;
  return <InterstellarField enabled />;
}
