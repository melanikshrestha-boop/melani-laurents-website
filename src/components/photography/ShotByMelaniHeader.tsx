import Link from "next/link";
import { PHOTOGRAPHY_BOOKING_PATH } from "@/lib/photography";

const nav = [
  { label: "Portfolio", href: "/photography" },
];

export function ShotByMelaniHeader() {
  return (
    <header className="photography-header">
      <div className="photography-header-inner">
        <Link href="/photography" className="photography-logo">
          shotbyceline
        </Link>

        <nav className="photography-nav" aria-label="Photography">
          {nav.map((item) => (
            <Link key={item.label} href={item.href} className="photography-nav-link">
              {item.label}
            </Link>
          ))}

          <Link
            href={PHOTOGRAPHY_BOOKING_PATH}
            className="photography-nav-cta"
          >
            Book a shoot
          </Link>
        </nav>
      </div>
    </header>
  );
}
