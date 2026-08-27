import { isValidEmail } from "@/lib/newsletter-shared";

export const CONTACT_TOPICS = [
  "Building / collaboration",
  "Research",
  "Business",
  "Photography",
  "Speaking / podcast",
  "Site bug",
  "Personal / hello",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export interface ContactMessage {
  name: string;
  email: string;
  topic: ContactTopic;
  subject: string;
  message: string;
  link?: string;
}

type ParsedContact =
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: ContactMessage }
  | { ok: false; error: string };

export function parseContactMessage(body: unknown): ParsedContact {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, topic, subject, message, link, company } = body as Record<
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
  if (typeof topic !== "string" || !CONTACT_TOPICS.includes(topic as ContactTopic)) {
    return { ok: false, error: "Please choose a topic." };
  }
  if (
    typeof subject !== "string" ||
    !subject.trim() ||
    subject.trim().length > 160
  ) {
    return { ok: false, error: "Please add a short subject." };
  }
  if (
    typeof message !== "string" ||
    !message.trim() ||
    message.trim().length > 5000
  ) {
    return { ok: false, error: "Please write a message under 5,000 characters." };
  }

  let normalizedLink: string | undefined;
  if (typeof link === "string" && link.trim()) {
    if (link.trim().length > 500) {
      return { ok: false, error: "That link is too long." };
    }

    try {
      const url = new URL(link.trim());
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        return { ok: false, error: "Please use an http or https link." };
      }
      normalizedLink = url.toString();
    } catch {
      return { ok: false, error: "Please enter a complete link." };
    }
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      topic: topic as ContactTopic,
      subject: subject.trim(),
      message: message.trim(),
      link: normalizedLink,
    },
  };
}
