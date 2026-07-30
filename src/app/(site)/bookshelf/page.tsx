import type { Metadata } from "next";
import Link from "next/link";
import { WonderBookshelfClient } from "@/wonder-bookshelf/WonderBookshelfClient";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Bookshelf",
  description: siteConfig.bookshelfDescription,
};

export default function BookshelfPage() {
  return (
    <div className="bookshelf-page bookshelf-page--wonder">
      {/* Top chrome — never float alone in a cream void under the content */}
      <div className="bookshelf-page__home">
        <Link href="/">← Back home</Link>
      </div>
      <WonderBookshelfClient />
    </div>
  );
}
