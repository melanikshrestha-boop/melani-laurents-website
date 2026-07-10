import Link from "next/link";
import { lunara } from "@/lib/lunara";

const navItems = [
  { label: "Services", href: "/#services" },
  { label: "New Clients", href: "/new-clients" },
  { label: "Contact", href: "/#contact" },
  { label: "Book", href: "/book" },
] as const;

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell">
      <header className="sticky top-0 z-50 border-b border-[rgba(124,72,86,0.1)] bg-[rgba(255,250,244,0.86)] backdrop-blur-2xl">
        <div className="promo-strip px-4 py-3 text-center">
          <span className="promo-text">{lunara.offer}</span>
        </div>

        <div className="flex w-full items-center justify-between gap-4 px-3 py-4 sm:px-5 lg:px-6 xl:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3 lg:gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(143,77,93,0.18)] bg-white/80 font-display text-2xl text-[var(--accent-dark)]">
              L
            </span>
            <div className="leading-tight">
              <p className="font-display text-lg text-[var(--text)] sm:text-[1.35rem]">
                {lunara.name}
              </p>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--muted)] sm:text-[0.72rem]">
                {lunara.experience}
              </p>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-4 lg:gap-6 xl:gap-8">
            <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--text)] transition hover:text-[var(--accent-dark)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <Link href="/book" className="button-primary px-5 py-3 text-sm">
              Book now
            </Link>

            <details className="relative lg:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-[rgba(143,77,93,0.18)] bg-white/80 px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--text)]">
                Menu
              </summary>
              <div className="absolute right-0 mt-2 w-52 rounded-[1.5rem] border border-[rgba(124,72,86,0.12)] bg-[rgba(255,252,248,0.98)] p-2 shadow-[0_20px_60px_rgba(64,32,34,0.12)]">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl px-4 py-3 text-sm text-[var(--text)] hover:bg-[rgba(183,115,133,0.08)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-[rgba(124,72,86,0.1)] bg-[rgba(255,252,248,0.8)]">
        <div className="section grid gap-8 py-12 lg:grid-cols-[1.2fr_0.8fr_0.9fr]">
          <div>
            <p className="eyebrow">Lunara Glow Beauty Salon</p>
            <p className="mt-3 max-w-md font-display text-3xl text-[var(--text)] sm:text-4xl">
              Clear prices, soft glow, and booking that feels effortless.
            </p>
          </div>

          <div className="space-y-3 text-sm text-[var(--text-soft)]">
            <p className="eyebrow">Contact</p>
            <p>{lunara.address}</p>
            <p>{lunara.phone}</p>
            <p>{lunara.email}</p>
            <p>{lunara.instagram}</p>
          </div>

          <div className="space-y-3 text-sm">
            <p className="eyebrow">Quick links</p>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-[var(--text-soft)] underline decoration-[rgba(143,77,93,0.35)] underline-offset-4 transition hover:text-[var(--text)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
