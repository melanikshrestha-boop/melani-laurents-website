import type { Metadata } from "next";
import { erenTabIcons } from "@/lib/eren-tab";
import "@/styles/linkree.css";

export const metadata: Metadata = {
  title: { absolute: "Celine Nova" },
  robots: { index: true, follow: true },
  icons: erenTabIcons,
};

/** Full-bleed links page — no site nav. Hidden from the header. */
export default function LinksLayout({ children }: { children: React.ReactNode }) {
  return <div className="linkree">{children}</div>;
}
