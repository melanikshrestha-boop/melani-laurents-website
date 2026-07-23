import Link from "next/link";
import { AskLuna } from "@/components/AskLuna";
import { CartProvider } from "@/components/ServiceCart";
import { SiteHeader } from "@/components/SiteHeader";
import { lunara } from "@/lib/lunara";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "New clients", href: "/new-clients" },
  { label: "Contact", href: "/#contact" },
  { label: "Book", href: "/book" },
] as const;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="page-shell">
        <SiteHeader />
        <main>{children}</main>
        <AskLuna />

        <footer className="site-footer">
          <div className="section footer-grid">
            <div>
              <p className="footer-brand">{lunara.shortName}</p>
              <p className="footer-note">
                Astoria salon for brows, lashes, waxing, and facials.
              </p>
            </div>
            <div className="footer-col">
              <p className="footer-label">Visit</p>
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
            <div className="footer-col">
              <p className="footer-label">Links</p>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="footer-link">
                  {item.label}
                </Link>
              ))}
              <a
                href={lunara.yelp}
                target="_blank"
                rel="noreferrer"
                className="footer-link"
              >
                Yelp
              </a>
            </div>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}
