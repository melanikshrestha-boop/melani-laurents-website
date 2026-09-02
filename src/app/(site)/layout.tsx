import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { SiteBackground } from "@/components/SiteBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CinemaProvider } from "@/components/cinema/CinemaProvider";
import { MainShell } from "@/components/MainShell";
import { erenTabIcons } from "@/lib/eren-tab";

// Nested pages (Bookshelf, Blog, …) set title without icons. Pin Eren here
// so metadata merge cannot drop the tab mark back to a cream C.
export const metadata: Metadata = {
  icons: erenTabIcons,
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CinemaProvider>
      <SiteBackground />
      <SmoothScroll>
        <Navigation />
        <MainShell>{children}</MainShell>
      </SmoothScroll>
    </CinemaProvider>
  );
}
