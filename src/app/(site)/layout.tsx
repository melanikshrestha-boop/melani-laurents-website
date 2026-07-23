import { AskLuna } from "@/components/AskLuna";
import { FooterI18n } from "@/components/FooterI18n";
import { LunaraMotionRoot } from "@/components/LunaraMotion";
import { CartProvider } from "@/components/ServiceCart";
import { SiteHeader } from "@/components/SiteHeader";
import { LanguageProvider } from "@/lib/i18n";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <CartProvider>
        <LunaraMotionRoot>
          <div className="lg-shell">
            <SiteHeader />
            <main>{children}</main>
            <AskLuna />
            <FooterI18n />
          </div>
        </LunaraMotionRoot>
      </CartProvider>
    </LanguageProvider>
  );
}
