import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SiteBackground } from "@/components/SiteBackground";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CinemaProvider } from "@/components/cinema/CinemaProvider";
import { MainShell } from "@/components/MainShell";

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
        <Footer />
      </SmoothScroll>
    </CinemaProvider>
  );
}
