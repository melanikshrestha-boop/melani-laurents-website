import { isValidEmail } from "@/lib/newsletter-shared";

/** Public inbox for portrait bookings — same as Contact. */
export const BOOKING_INBOX = "mshresth@usc.edu";

export type PortraitBooking = {
  name: string;
  email: string;
  city: string;
  date: string;
  message: string;
};

type ParsedBooking =
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: PortraitBooking }
  | { ok: false; error: string };

export function parsePortraitBooking(body: unknown): ParsedBooking {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, city, date, message, company } = body as Record<
    string,
    unknown
  >;

  if (typeof company === "string" && company.trim()) {
    return { ok: true, spam: true };
  }

  if (typeof name !== "string" || !name.trim() || name.trim().length > 120) {
    return { ok: false, error: "Please enter your name." };
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (typeof city !== "string" || !city.trim() || city.trim().length > 120) {
    return { ok: false, error: "Please enter a city." };
  }

  let normalizedDate = "";
  if (typeof date === "string" && date.trim()) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
      return { ok: false, error: "Please use a real date." };
    }
    normalizedDate = date.trim();
  }

  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.trim().length > 5000
  ) {
    return { ok: false, error: "Please write a message under 5,000 characters." };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      date: normalizedDate,
      message: message.trim(),
    },
  };
}

export function portraitBookingMailto(booking: PortraitBooking): string {
  const subject = "Portrait booking";
  const body = [
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `City: ${booking.city}`,
    booking.date ? `Date: ${booking.date}` : null,
    "",
    booking.message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return `mailto:${BOOKING_INBOX}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
