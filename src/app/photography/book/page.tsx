import type { Metadata } from "next";
import { PortraitBookForm } from "@/components/photography/PortraitBookForm";
import { erenTabIcons } from "@/lib/eren-tab";

export const metadata: Metadata = {
  title: "Book a shoot | shotbyceline",
  icons: erenTabIcons,
};

export default function PhotographyBookPage() {
  return (
    <main className="portrait-book-page">
      <PortraitBookForm titleTag="h1" />
    </main>
  );
}
