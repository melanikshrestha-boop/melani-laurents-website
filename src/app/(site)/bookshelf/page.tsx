import type { Metadata } from "next";
import Link from "next/link";
import { BookshelfView } from "@/components/BookshelfView";
import { getBookshelfEntries } from "@/data/bookshelf";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Bookshelf",
  description: siteConfig.bookshelfDescription,
};

export default function BookshelfPage() {
  const entries = getBookshelfEntries();

  return (
    <div className="bookshelf-page">
      <BookshelfView entries={entries} />
      <div className="bookshelf-page__home">
        <Link href="/">← Back home</Link>
      </div>
    </div>
  );
}
