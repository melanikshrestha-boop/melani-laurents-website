import nodemailer from "nodemailer";
import { photographyBooking } from "@/data/photography-meta";
import type { BookingInquiry } from "@/lib/booking";

export function isMailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendBookingInquiry(inquiry: BookingInquiry): Promise<void> {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("MAIL_NOT_CONFIGURED");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const fullName = `${inquiry.firstName} ${inquiry.lastName}`;
  const text = [
    `Name: ${fullName}`,
    `Email: ${inquiry.email}`,
    "",
    inquiry.message,
  ].join("\n");

  const html = [
    "<p><strong>Name:</strong> " + escapeHtml(fullName) + "</p>",
    "<p><strong>Email:</strong> " + escapeHtml(inquiry.email) + "</p>",
    "<p><strong>Message:</strong></p>",
    "<p>" + escapeHtml(inquiry.message).replace(/\n/g, "<br>") + "</p>",
  ].join("\n");

  await transporter.sendMail({
    from: `"shotbymelani bookings" <${user}>`,
    to: photographyBooking.email,
    replyTo: inquiry.email,
    subject: `${photographyBooking.mailtoSubject} — ${fullName}`,
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
