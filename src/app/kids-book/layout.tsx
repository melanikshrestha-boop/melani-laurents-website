import type { Metadata } from "next";
import "@/styles/kids-book.css";

// Page title and description for search / browser tab
export const metadata: Metadata = {
  title: "Luna and the Tiny Spark — Kids Neuroscience Book",
  description:
    "An interactive storybook for kids about the brain. Press any key or tap to turn the page.",
};

/**
 * Full-screen layout just for the kids book.
 * No main site nav or footer — keeps it simple for children.
 */
export default function KidsBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // only show the book itself
}
