import type { Metadata } from "next";
import { erenTabIcons } from "@/lib/eren-tab";
import "@/styles/kids-book.css";

export const metadata: Metadata = {
  title: "Luna and the Tiny Spark — Interactive Kids Neuroscience Book",
  description:
    "An interactive storybook for kids about the brain. Press any key or tap to turn the page — meet neurons, sparks, memory, sleep, and kindness with Luna.",
  icons: erenTabIcons,
  openGraph: {
    title: "Luna and the Tiny Spark",
    description: "Press any key to turn the page of this kids neuroscience adventure.",
  },
};

/** Full-screen kids book — no site nav, just the story. */
export default function KidsBookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
