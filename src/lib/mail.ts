import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import type { ContactMessage } from "@/lib/contact";

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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
