import Link from "next/link";
import { lunara } from "@/lib/lunara";

export default function HomePage() {
  return (
    <div className="pb-20">
      <section className="section grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">{lunara.experience}</p>
          <h1 className="heading mt-6 text-5xl sm:text-6xl lg:text-7xl xl:text-[6.5rem]">
            Elegance, made for your <span className="italic">Glow</span>.
          </h1>
          <p className="mt-6 max-w-xl lead">{lunara.intro}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="button-primary px-6 py-4 text-base">
              Book an appointment
              <span aria-hidden>↗</span>
            </Link>
            <Link href="/#services" className="button-secondary px-6 py-4 text-base">
              View services
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-[var(--text-soft)]">
            <span className="pill px-4 py-2 font-semibold">{lunara.offer}</span>
            <span className="pill px-4 py-2 font-semibold">{lunara.hours}</span>
            <span className="pill px-4 py-2 font-semibold">{lunara.loyalty}</span>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-x-10 top-10 h-44 rounded-full bg-[radial-gradient(circle,rgba(183,115,133,0.35),transparent_70%)] blur-2xl" />
          <div className="glass-panel relative overflow-hidden p-6 sm:p-8">
            <div className="rounded-[2rem] bg-gradient-to-br from-[#fffaf4] via-[#f6eee4] to-[#ead7d0] p-5">
              <p className="eyebrow">Ask Luna</p>
              <p className="mt-3 font-display text-3xl leading-none text-[var(--text)]">
                {lunara.bookingSlogan}
              </p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--text-soft)]">
                Clean answers, faster booking, and no front desk guessing.
              </p>

              <div className="mt-6 rounded-[1.75rem] border border-[rgba(143,77,93,0.14)] bg-white/80 p-4 shadow-[0_18px_40px_rgba(64,32,34,0.06)]">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-[var(--accent-dark)]">
                    Tell me what you need
                  </p>
                  <span className="shimmer-note inline-flex items-center rounded-full bg-[rgba(183,115,133,0.12)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                    Book faster
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-[1.4rem] border border-[rgba(124,72,86,0.12)] bg-[rgba(255,255,255,0.88)] px-4 py-3">
                  <span className="text-[var(--muted)]">Ask Luna what you need…</span>
                  <span className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                    ↑
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="section py-10 sm:py-14">
        <div className="max-w-2xl">
          <p className="eyebrow">Choose what you need</p>
          <h2 className="heading mt-4 text-4xl sm:text-5xl">
            Facials, brows, lashes, and waxing — clear prices, simple booking.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lunara.services.map((group) => (
            <article key={group.id} className="glass-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-display text-3xl text-[var(--text)]">{group.title}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-soft)]">
                    {group.eyebrow}
                  </p>
                </div>
                <span className="pill px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent-dark)]">
                  {group.items.length} options
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {group.items.slice(0, 4).map((item) => (
                  <div
                    key={item.name}
                    className="rounded-[1.25rem] border border-[rgba(124,72,86,0.1)] bg-white/70 px-4 py-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{item.name}</p>
                        <p className="mt-1 text-xs text-[var(--text-soft)]">{item.time}</p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--accent-dark)]">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/book"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-dark)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
              >
                See every service
                <span aria-hidden>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section py-10 sm:py-14">
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="glass-panel p-6 sm:p-8">
            <p className="eyebrow">What clients say</p>
            <h2 className="heading mt-4 text-4xl sm:text-5xl">
              What our clients have to say
            </h2>
            <p className="mt-4 lead">
              Honest service, polished results, and a booking flow that feels effortless.
            </p>
            <Link
              href={lunara.yelp}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[rgba(143,77,93,0.16)] bg-white/80 px-5 py-3 text-sm font-semibold text-[var(--accent-dark)]"
              target="_blank"
              rel="noreferrer"
            >
              Leave a review on Yelp
              <span aria-hidden>↗</span>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {lunara.reviews.map((review) => (
              <figure key={review.quote} className="review-card p-5">
                <div className="text-lg tracking-[0.18em] text-[var(--accent-dark)]">★★★★★</div>
                <blockquote className="mt-4 text-lg leading-8 text-[var(--text)]">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm text-[var(--text-soft)]">
                  {review.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass-panel p-6 sm:p-8">
            <p className="eyebrow">For appointments</p>
            <h2 className="heading mt-4 text-4xl sm:text-5xl">
              Book now or walk in.
            </h2>
            <p className="mt-4 lead">{lunara.hours}</p>

            <div className="mt-8 space-y-4 text-sm">
              <a
                href="/book"
                className="block rounded-[1.5rem] border border-[rgba(124,72,86,0.12)] bg-white/70 px-5 py-4 font-semibold text-[var(--text)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
              >
                Book online ↗
              </a>
              <a
                href={`tel:${lunara.phoneDial}`}
                className="block rounded-[1.5rem] border border-[rgba(124,72,86,0.12)] bg-white/70 px-5 py-4 font-semibold text-[var(--text)] underline decoration-[rgba(143,77,93,0.38)] underline-offset-4"
              >
                Call: {lunara.phone}
              </a>
            </div>

            <div className="mt-8 space-y-2 text-sm text-[var(--text-soft)]">
              <p>{lunara.address}</p>
              <p>{lunara.email}</p>
              <p>{lunara.instagram}</p>
            </div>
          </div>

          <div className="glass-panel overflow-hidden p-4 sm:p-5">
            <div className="rounded-[2rem] border border-[rgba(124,72,86,0.1)] bg-white/80 p-4">
              <iframe
                title="Lunara Glow location"
                src="https://www.google.com/maps?q=38-02+Broadway+Astoria+NY+11103&z=15&output=embed"
                className="h-[28rem] w-full rounded-[1.5rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
