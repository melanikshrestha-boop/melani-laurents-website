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
    pathname.startsWith("/podcast/");
  if (paper) return null;
  return <InterstellarField enabled />;
}
