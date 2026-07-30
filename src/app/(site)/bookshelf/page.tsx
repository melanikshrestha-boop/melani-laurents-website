import type { Metadata } from "next";
import Link from "next/link";
import { BookshelfView } from "@/components/BookshelfView";
import { getBookshelfEntries } from "@/data/bookshelf";

export const metadata: Metadata = {
  title: "Bookshelf",
  description:
    "Research papers, physical books, blogs, and podcasts — with notes and how I applied them.",
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
