"use client";

import { useEffect } from "react";

export function PhotographyMode({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add("photography-mode");
    return () => document.body.classList.remove("photography-mode");
  }, []);

  return <>{children}</>;
}
