"use client";

import { usePathname } from "next/navigation";
import { InterstellarField } from "@/components/cinema/InterstellarField";

export function SiteBackground() {
  const pathname = usePathname();
  // Quiet reading surfaces — solid void only, no constellation/wave HUD
  // (Consume / Blog = Apple Notes minimal; same dark base as the rest of the site)
  const quiet =
    pathname === "/" ||
    pathname === "/daily" ||
    pathname.startsWith("/daily/") ||
    pathname === "/research" ||
    pathname.startsWith("/research/") ||
    pathname === "/podcast" ||
    pathname.startsWith("/podcast/") ||
    pathname === "/youtube" ||
    pathname.startsWith("/youtube/") ||
    pathname === "/bookshelf" ||
    pathname.startsWith("/bookshelf/") ||
    pathname === "/diary" ||
    pathname.startsWith("/diary/") ||
    pathname === "/consume" ||
    pathname.startsWith("/consume/") ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/projects" ||
    pathname.startsWith("/projects/");
  if (quiet) return null;
  return <InterstellarField enabled />;
}
