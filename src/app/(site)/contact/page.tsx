import Link from "next/link";
import { lunara } from "@/lib/lunara";

export default function ContactPage() {
  return (
    <div className="section py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-panel p-6 sm:p-8">
          <p className="eyebrow">Contact</p>
          <h1 className="heading mt-4 text-5xl sm:text-6xl">
            Book faster. Feel calmer.
          </h1>
          <p className="mt-5 lead">
            If someone does not know how to use the internet well, this page keeps it
            plain: one button to book, one button to call.
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="/book"
              className="block rounded-[1.5rem] border border-[rgba(124,72,86,0.12)] bg-white/75 px-5 py-4 text-sm font-semibold text-[var(--text)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
            >
              Book online ↗
            </a>
            <a
              href={`tel:${lunara.phoneDial}`}
              className="block rounded-[1.5rem] border border-[rgba(124,72,86,0.12)] bg-white/75 px-5 py-4 text-sm font-semibold text-[var(--text)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
            >
              Call: {lunara.phone}
            </a>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                Address
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{lunara.address}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                Hours
              </p>
              <p className="mt-2 text-sm leading-7 text-[var(--text-soft)]">{lunara.hours}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel overflow-hidden p-4 sm:p-5">
          <div className="rounded-[2rem] border border-[rgba(124,72,86,0.1)] bg-white/80 p-4">
            <iframe
              title="Lunara Glow map"
              src="https://www.google.com/maps?q=38-02+Broadway+Astoria+NY+11103&z=15&output=embed"
              className="h-[30rem] w-full rounded-[1.5rem] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                Instagram
              </p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{lunara.instagram}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                Email
              </p>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{lunara.email}</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                Yelp
              </p>
              <Link
                href={lunara.yelp}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm text-[var(--text-soft)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
              >
                Leave a review ↗
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
