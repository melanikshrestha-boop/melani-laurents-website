import Link from "next/link";
import { AskLuna } from "@/components/AskLuna";
import { CartProvider } from "@/components/ServiceCart";
import { SiteHeader } from "@/components/SiteHeader";
import { lunara } from "@/lib/lunara";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "New clients", href: "/new-clients" },
  { label: "Visit", href: "/#contact" },
  { label: "Book", href: "/book" },
] as const;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="lg-shell">
        <SiteHeader />
        <main>{children}</main>
        <AskLuna />

        <footer className="lg-footer">
          <div className="lg-wrap lg-footer-grid">
            <div>
              <p className="lg-footer-brand">{lunara.shortName}</p>
              <p className="lg-footer-note">
                Facial studio energy. Clear menu. Astoria.
              </p>
            </div>
            <div className="lg-footer-col">
              <p className="lg-footer-label">Visit</p>
              <p>{lunara.address}</p>
              <p>{lunara.hours}</p>
              <p>
                <a href={`tel:${lunara.phoneDial}`}>{lunara.phone}</a>
              </p>
              <p>
                <a href={`mailto:${lunara.email}`}>{lunara.email}</a>
              </p>
              <p>{lunara.instagram}</p>
            </div>
            <div className="lg-footer-col">
              <p className="lg-footer-label">Navigate</p>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <a href={lunara.yelp} target="_blank" rel="noreferrer">
                Yelp reviews
              </a>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
