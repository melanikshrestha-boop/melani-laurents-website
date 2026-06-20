"use client";

import { usePathname } from "next/navigation";
import { InterstellarField } from "@/components/cinema/InterstellarField";

export function SiteBackground() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <InterstellarField enabled />;
}
