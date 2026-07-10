import Link from "next/link";
import { lunara } from "@/lib/lunara";

export default function NewClientsPage() {
  return (
    <div className="section py-16 sm:py-20">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">New clients</p>
          <h1 className="heading mt-4 text-5xl sm:text-6xl">
            Simple, warm, and built for repeat visits.
          </h1>
          <p className="mt-6 max-w-2xl lead">
            Start with a quick booking, keep your info in one place, and let Luna help
            you move faster every time you come back.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <article className="glass-panel p-6">
              <p className="eyebrow">Loyalty</p>
              <p className="mt-3 font-display text-3xl text-[var(--text)]">
                {lunara.loyalty}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                We keep it simple: your number, your visits, and a quick reminder when
                you’re close to a reward.
              </p>
            </article>

            <article className="glass-panel p-6">
              <p className="eyebrow">First visit</p>
              <p className="mt-3 font-display text-3xl text-[var(--text)]">
                {lunara.offer}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
                No clutter, no confusing fine print — just a clean first-visit offer.
              </p>
            </article>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/book" className="button-primary px-6 py-4 text-base">
              Request appointment
            </Link>
            <Link href="/#contact" className="button-secondary px-6 py-4 text-base">
              Contact salon
            </Link>
          </div>
        </div>

        <aside className="glass-panel p-6 sm:p-8">
          <p className="eyebrow">What to expect</p>
          <div className="mt-5 space-y-4">
            {[
              "Clear prices before you book.",
              "Friendly guidance if you’re unsure what to choose.",
              "No guesswork for brows, lashes, waxing, or facials.",
              "Texts that keep you updated on visits and rewards.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.35rem] border border-[rgba(124,72,86,0.1)] bg-white/75 px-4 py-4 text-sm leading-7 text-[var(--text)]"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-[rgba(124,72,86,0.12)] bg-[rgba(255,255,255,0.78)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
              Your contact
            </p>
            <div className="mt-4 space-y-2 text-sm text-[var(--text-soft)]">
              <p>{lunara.phone}</p>
              <p>{lunara.email}</p>
              <p>{lunara.address}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
