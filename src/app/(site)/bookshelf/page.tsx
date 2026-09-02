import type { Metadata } from "next";
import { WonderBookshelfClient } from "@/wonder-bookshelf/WonderBookshelfClient";
import { siteConfig } from "@/config/site";
import { erenTabIcons } from "@/lib/eren-tab";

export const metadata: Metadata = {
  title: "Bookshelf",
  description: siteConfig.bookshelfDescription,
  icons: erenTabIcons,
};

export default function BookshelfPage() {
  return (
    <div className="bookshelf-page bookshelf-page--wonder">
      {/* Site nav already has Home / logo — no second “back home” stripe */}
      <WonderBookshelfClient />
    </div>
  );
}
