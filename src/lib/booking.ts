import { isValidEmail } from "@/lib/newsletter-shared";

export interface BookingInquiry {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export function parseBookingInquiry(body: unknown):
  | { ok: true; data: BookingInquiry }
  | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const { firstName, lastName, email, message } = body as Record<string, unknown>;

  if (typeof firstName !== "string" || !firstName.trim()) {
    return { ok: false, error: "First name is required." };
  }
  if (typeof lastName !== "string" || !lastName.trim()) {
    return { ok: false, error: "Last name is required." };
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    return { ok: false, error: "A valid email is required." };
  }
  if (typeof message !== "string" || !message.trim()) {
    return { ok: false, error: "Message is required." };
  }

  const trimmedMessage = message.trim();
  if (trimmedMessage.length > 5000) {
    return { ok: false, error: "Message is too long." };
  }

  return {
    ok: true,
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      message: trimmedMessage,
    },
  };
}
