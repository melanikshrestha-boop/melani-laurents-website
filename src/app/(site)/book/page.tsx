"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { lunara } from "@/lib/lunara";

type BookingChoice = {
  title: string;
  duration: string;
  price: string;
  summary: string;
  description?: string;
};

const categories: Array<{
  id: string;
  title: string;
  subtitle: string;
  choices: BookingChoice[];
}> = [
  {
    id: "waxing",
    title: "Waxing",
    subtitle: "Face, body, and bikini — clear and direct.",
    choices: [
      { title: "Brow Wax", duration: "15 min", price: "$40", summary: "Clean, classic brow shaping." },
      { title: "Brow Tweeze", duration: "20 min", price: "$50", summary: "Gentle shaping by hand." },
      { title: "Brow Threading", duration: "15 min", price: "$25", summary: "Precise threading for tidy edges." },
      { title: "Lip", duration: "5 min", price: "$15", summary: "Quick upper lip wax." },
      { title: "Chin", duration: "10 min", price: "$15", summary: "Simple chin clean-up." },
      { title: "Underarms", duration: "15 min", price: "$25", summary: "Fast and polished." },
      { title: "Half Arm", duration: "20 min", price: "$55", summary: "From shoulder to elbow." },
      { title: "Full Arm", duration: "30 min", price: "$70", summary: "Smooth from shoulder to wrist." },
      { title: "Lower Leg", duration: "30 min", price: "$55", summary: "Lower leg waxing." },
      { title: "Upper Leg", duration: "30 min", price: "$70", summary: "Upper leg waxing." },
      { title: "Bikini", duration: "20 min", price: "$35+", summary: "Women only." },
    ],
  },
  {
    id: "brows",
    title: "Brows",
    subtitle: "Soft glow, soft shape, no overload.",
    choices: [
      { title: "Brow Tint", duration: "15 min", price: "$30", summary: "Adds subtle depth and definition." },
      { title: "Brow Lamination + Shaping", duration: "45 min", price: "$100", summary: "Creates a fuller, polished brow." },
      {
        title: "Brow Lamination + Shaping + Color Boost",
        duration: "60 min",
        price: "$125",
        summary: "Full sculpt plus added color.",
      },
      { title: "Brow Center", duration: "5 min", price: "$10", summary: "Tiny cleanup between brows." },
    ],
  },
  {
    id: "lashes",
    title: "Lashes",
    subtitle: "Natural lift or fuller clusters, depending on the look.",
    choices: [
      { title: "Lash Lift + Tint", duration: "60 min", price: "$70", summary: "Lifted lashes with deeper color." },
      { title: "Lash Tint", duration: "20 min", price: "$45", summary: "Adds depth without extensions." },
      { title: "Classic Lash Extensions", duration: "120 min", price: "$150", summary: "Traditional one-by-one set." },
      {
        title: "Lash Clusters",
        duration: "30–45 min",
        price: "Price varies",
        summary: "Short, natural, or fuller cluster sets.",
      },
    ],
  },
  {
    id: "facials",
    title: "Facials",
    subtitle: "Glass-skin glow with honest details.",
    choices: [
      {
        title: "Express Facial",
        duration: "30 min",
        price: "$75",
        summary: "Quick refresh with a soft finish.",
      },
      {
        title: "Classic Facial",
        duration: "60 min",
        price: "$145",
        summary: "Deeper cleansing and a longer reset.",
      },
      {
        title: "Hydra Dew",
        duration: "50 min",
        price: "$80",
        summary: "Hydration-focused glow treatment.",
      },
      {
        title: "Hydra Medic",
        duration: "50 min",
        price: "$95",
        summary: "Targeted treatment for balance and clarity.",
      },
      {
        title: "Gold / Deep Clean",
        duration: "45 min",
        price: "$65",
        summary: "Deep clean with a brighter finish.",
      },
      {
        title: "Seaweed",
        duration: "50 min",
        price: "$80",
        summary: "Purifying facial with calming minerals.",
      },
      {
        title: "Herbal Facial",
        duration: "30 min",
        price: "$45",
        summary: "Botanical cleanse with a relaxing touch.",
      },
      {
        title: "Eye Optimum",
        duration: "30 min",
        price: "$35",
        summary: "Gentle eye-area treatment.",
      },
      {
        title: "Four Layer",
        duration: "50 min",
        price: "$80",
        summary: "Layered cleanse, massage, mask, and hydration.",
        description:
          "Click here to know more: a classic layered facial with deep cleansing, exfoliation, massage, mask, and hydration. Good when skin feels dull, dry, or tired.",
      },
      {
        title: "Biolight Anti-Aging",
        duration: "50 min",
        price: "$100",
        summary: "Firming treatment for smoother-looking skin.",
      },
    ],
  },
];

export default function BookPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedService, setSelectedService] = useState<BookingChoice>(
    categories[0].choices[0],
  );
  const [selectedTime, setSelectedTime] = useState(lunara.bookingTimes[0]);
  const [loyalty, setLoyalty] = useState<"yes" | "no">("yes");
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");

  const activeCategory = useMemo(
    () => categories.find((group) => group.id === selectedCategory) ?? categories[0],
    [selectedCategory],
  );

  return (
    <div className="section py-16 sm:py-20">
      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow">Book an appointment</p>
          <h1 className="heading mt-4 text-5xl sm:text-6xl lg:text-7xl">
            {lunara.bookingSlogan}
          </h1>
          <p className="mt-5 max-w-2xl lead">
            Pick a service, choose a 30-minute interval, add your number, and tell us
            if you want the loyalty discount card.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSelectedService(category.choices[0]);
                }}
                className={`service-chip px-5 py-3 text-sm font-semibold ${
                  selectedCategory === category.id ? "service-chip--active" : ""
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-4">
            {activeCategory.choices.map((choice) => {
              const open = selectedService.title === choice.title;
              return (
                <details
                  key={choice.title}
                  open={open}
                  className="section-card rounded-[1.75rem] border border-[rgba(124,72,86,0.1)] bg-[rgba(255,252,248,0.9)] p-5"
                >
                  <summary
                    className="cursor-pointer list-none"
                    onClick={(event) => {
                      event.preventDefault();
                      setSelectedService(choice);
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-display text-3xl text-[var(--text)]">
                          {choice.title}
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-soft)]">
                          {choice.summary}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
                          {choice.price}
                        </p>
                        <p className="mt-2 text-sm text-[var(--text-soft)]">{choice.duration}</p>
                      </div>
                    </div>
                  </summary>

                  {choice.description ? (
                    <p className="mt-4 rounded-[1.25rem] border border-[rgba(124,72,86,0.1)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--text-soft)]">
                      {choice.description}
                    </p>
                  ) : null}
                </details>
              );
            })}
          </div>
        </div>

        <aside className="glass-panel h-fit p-5 sm:p-6 xl:sticky xl:top-28">
          <p className="eyebrow">Request appointment</p>
          <div className="mt-4 rounded-[1.75rem] border border-[rgba(124,72,86,0.1)] bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-dark)]">
              Selected service
            </p>
            <p className="mt-2 font-display text-3xl text-[var(--text)]">
              {selectedService.title}
            </p>
            <p className="mt-2 text-sm text-[var(--text-soft)]">
              {selectedService.duration} · {selectedService.price}
            </p>
          </div>

          <div className="mt-5">
            <label className="text-sm font-semibold text-[var(--text)]" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(347) 242-2127"
              className="mt-2 w-full rounded-[1.4rem] border border-[rgba(124,72,86,0.12)] bg-white/80 px-4 py-4 text-sm outline-none ring-0 placeholder:text-[var(--muted)] focus:border-[rgba(183,115,133,0.42)]"
            />
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--text)]">Loyalty discount card</p>
            <div className="mt-3 flex gap-3">
              {(["yes", "no"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLoyalty(option)}
                  className={`service-chip px-4 py-3 text-sm font-semibold capitalize ${
                    loyalty === option ? "service-chip--active" : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-semibold text-[var(--text)]">
              Choose a 30-minute interval
            </p>
            <div className="mt-3 grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
              {lunara.bookingTimes.map((time) => (
                <button
                  key={time}
                  type="button"
                  data-selected={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                  className="booking-slot rounded-[1.2rem] px-3 py-3 text-sm font-medium text-[var(--text)]"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[rgba(124,72,86,0.1)] bg-white/70 p-4 text-sm leading-7 text-[var(--text-soft)]">
            <p className="font-semibold text-[var(--text)]">Appointment summary</p>
            <p className="mt-2">Category: {activeCategory.title}</p>
            <p>Time: {selectedTime}</p>
            <p>Loyalty card: {loyalty === "yes" ? "Yes" : "No"}</p>
          </div>

          <button
            type="button"
            onClick={() => setSubmitted(true)}
            className="button-primary mt-5 w-full px-6 py-4 text-base"
          >
            Request appointment
            <span aria-hidden>↗</span>
          </button>

          {submitted ? (
            <p className="mt-4 rounded-[1.5rem] border border-[rgba(183,115,133,0.18)] bg-[rgba(183,115,133,0.08)] px-4 py-4 text-sm leading-7 text-[var(--text)]">
              Thanks — we have your request. If the number is correct, Luna will follow
              up with your appointment confirmation.
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link
              href="/#services"
              className="button-secondary px-5 py-3 font-semibold"
            >
              View services
            </Link>
            <Link href="/#contact" className="button-secondary px-5 py-3 font-semibold">
              Contact salon
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
