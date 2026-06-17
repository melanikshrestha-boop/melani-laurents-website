import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Melani Kirstein for research collaborations, med-tech partnerships, and speaking engagements.",
};

const respondTo = [
  "Research collaborations in med-tech and clinical signals",
  "Established startups and funded companies with clear technical scope",
  "Media outlets, journalists, and conference speaking",
  "Partnership and advisory opportunities with defined outcomes",
];

const doNotSend = [
  "Sales pitches or cold outreach",
  "Recruitment for roles I haven't applied to",
  "Link exchange or SEO requests",
  "Unsolicited product demos",
  "Generic networking without a specific ask",
];

export default function ContactPage() {
  return (
    <div className="px-6 py-20">
      <div className="mx-auto max-w-2xl">
        <header className="mb-12">
          <p className="font-mono-label text-accent mb-4">Contact</p>
          <h1 className="font-display text-4xl text-foreground">Get in touch</h1>
          <p className="mt-4 text-muted">
            I appreciate your interest in reaching out. To make sure I can
            respond to meaningful inquiries, please review the guidelines below.
          </p>
        </header>

        <section className="mb-12 rounded-xl border border-border bg-surface p-6">
          <h2 className="font-display text-xl text-foreground mb-4">
            Before you reach out
          </h2>
          <p className="text-sm text-muted leading-relaxed">
            I read every message but can&apos;t guarantee a response to all.
            Specificity helps — include context about what you&apos;re building
            and why you think I can help.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-mono-label text-accent mb-4">I respond to</h2>
          <ul className="space-y-3">
            {respondTo.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm text-muted"
              >
                <span className="text-accent mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="font-mono-label text-muted-foreground mb-4">
            Please don&apos;t send
          </h2>
          <ul className="space-y-3">
            {doNotSend.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-sm text-muted-foreground"
              >
                <span className="mt-0.5">×</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-accent/20 bg-accent-muted p-6">
          <h2 className="font-display text-xl text-foreground mb-2">
            Email
          </h2>
          <p className="text-sm text-muted mb-4">
            For legitimate inquiries, email me directly. Include your
            organization, role, and a brief description of your inquiry.
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-mono-label text-accent hover:underline underline-offset-4"
          >
            {siteConfig.email}
          </a>
        </section>
      </div>
    </div>
  );
}
