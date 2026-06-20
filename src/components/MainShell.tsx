"use client";

import { usePathname } from "next/navigation";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      className={`relative z-10 flex-1 overflow-x-hidden ${isHome ? "" : "pt-14"}`}
    >
      {children}
    </main>
  );
}
