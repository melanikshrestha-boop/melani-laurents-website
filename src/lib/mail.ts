import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import type { PortraitBooking } from "@/lib/booking";
import { BOOKING_INBOX } from "@/lib/booking";
import type { ContactMessage } from "@/lib/contact";
import type { PrintOrderRequest } from "@/lib/print-order";

/** Inbox for print-order notices. Server-only — never send this to the browser. */
const PRINT_ORDER_NOTIFY_EMAIL =
  process.env.PRINT_ORDER_NOTIFY_EMAIL?.trim() || "melanikshrestha@gmail.com";

export function isMailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendContactMessage(contact: ContactMessage): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const text = [
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Topic: ${contact.topic}`,
    `Subject: ${contact.subject}`,
    contact.link ? `Link: ${contact.link}` : "",
    "",
    contact.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = [
    "<p><strong>Name:</strong> " + escapeHtml(contact.name) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(contact.email) + "</p>",
    "<p><strong>Topic:</strong> " + escapeHtml(contact.topic) + "</p>",
    "<p><strong>Subject:</strong> " + escapeHtml(contact.subject) + "</p>",
    contact.link
      ? '<p><strong>Link:</strong> <a href="' +
        escapeHtml(contact.link) +
        '">' +
        escapeHtml(contact.link) +
        "</a></p>"
      : "",
    "<p><strong>Message:</strong></p>",
    "<p>" + escapeHtml(contact.message).replace(/\n/g, "<br>") + "</p>",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: `"Celine Nova contact" <${user}>`,
    to: siteConfig.email,
    replyTo: contact.email,
    subject: `[${contact.topic}] ${contact.subject}`,
    text,
    html,
  });
}

export async function sendPrintOrderNotice(order: PrintOrderRequest): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const subject = `Print order: ${order.title} (${order.sizeLabel})`;
  const text = [
    "A print request was submitted on the site.",
    "",
    `Photograph: ${order.title}`,
    `Catalog: ${order.catalogId}`,
    `Size: ${order.sizeLabel}`,
    `Print price: $${order.priceUsd} USD`,
    `Ship to: ${order.shipTo}`,
    "",
    `Buyer: ${order.name}`,
    `Buyer email: ${order.email}`,
  ].join("\n");

  const html = [
    "<p>A print request was submitted on the site.</p>",
    "<p><strong>Photograph:</strong> " + escapeHtml(order.title) + "</p>",
    "<p><strong>Catalog:</strong> " + escapeHtml(order.catalogId) + "</p>",
    "<p><strong>Size:</strong> " + escapeHtml(order.sizeLabel) + "</p>",
    "<p><strong>Print price:</strong> $" + escapeHtml(String(order.priceUsd)) + " USD</p>",
    "<p><strong>Ship to:</strong> " + escapeHtml(order.shipTo) + "</p>",
    "<p><strong>Buyer:</strong> " + escapeHtml(order.name) + "</p>",
    "<p><strong>Buyer email:</strong> " + escapeHtml(order.email) + "</p>",
  ].join("\n");

  await transporter.sendMail({
    from: `"Celine Nova prints" <${user}>`,
    to: PRINT_ORDER_NOTIFY_EMAIL,
    replyTo: order.email,
    subject,
    text,
    html,
  });
}

export async function sendPortraitBookingNotice(
  booking: PortraitBooking,
): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const notify =
    process.env.BOOKING_NOTIFY_EMAIL?.trim() ||
    process.env.PRINT_ORDER_NOTIFY_EMAIL?.trim() ||
    BOOKING_INBOX;

  const subject = `Portrait booking: ${booking.name} · ${booking.city}`;
  const text = [
    "A portrait booking was submitted on the site.",
    "",
    `Name: ${booking.name}`,
    `Email: ${booking.email}`,
    `City: ${booking.city}`,
    booking.date ? `Date: ${booking.date}` : "Date: (none)",
    "",
    booking.message,
  ].join("\n");

  const html = [
    "<p>A portrait booking was submitted on the site.</p>",
    "<p><strong>Name:</strong> " + escapeHtml(booking.name) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(booking.email) + "</p>",
    "<p><strong>City:</strong> " + escapeHtml(booking.city) + "</p>",
    booking.date
      ? "<p><strong>Date:</strong> " + escapeHtml(booking.date) + "</p>"
      : "",
    "<p><strong>Message:</strong></p>",
    "<p>" + escapeHtml(booking.message).replace(/\n/g, "<br>") + "</p>",
  ]
    .filter(Boolean)
    .join("\n");

  await transporter.sendMail({
    from: `"Celine Nova booking" <${user}>`,
    to: notify,
    replyTo: booking.email,
    subject,
    text,
    html,
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
