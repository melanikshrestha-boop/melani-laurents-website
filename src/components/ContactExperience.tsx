import { siteConfig } from "@/config/site";
import "@/styles/contact.css";

/**
 * Contact — Lex Fridman–style: short rules + clear email channels.
 * Cream paper, edge-hug, no gimmick HUD.
 */
function mail(subject: string, body?: string): string {
  const q = new URLSearchParams();
  q.set("subject", subject);
  if (body) q.set("body", body);
  return `mailto:${siteConfig.email}?${q.toString()}`;
}

const CHANNELS: {
  label: string;
  blurb: string;
  subject: string;
  href?: string;
}[] = [
  {
    label: "Building / collaboration",
    blurb:
      "You’re shipping something real and want to work together, partner, or jam on systems.",
    subject: "Building / collaboration",
  },
  {
    label: "Research",
    blurb:
      "Research, papers, patents, signals, or technical deep-dives related to my work.",
    subject: "Research",
  },
  {
    label: "Business",
    blurb: "Professional proposals, opportunities, or business introductions.",
    subject: "Business",
  },
  {
    label: "Personal",
    blurb: "A personal note, hello, or something that doesn’t fit the other channels.",
    subject: "Personal",
  },
  {
    label: "Photography",
    blurb: "Book a shoot or ask about portraits / scenery work.",
    subject: "Photography",
    href: siteConfig.photographyPath + "/about#book",
  },
  {
    label: "Speaking / podcast",
    blurb: "Invite me to speak, guest, or appear on a show.",
    subject: "Speaking / podcast",
  },
  {
    label: "Bugs",
    blurb:
      "Something broken on this site or a product I ship — technical reports help a lot.",
    subject: "Site bug",
  },
];

export function ContactExperience() {
  return (
    <div className="contact-page">
      <div className="contact-page__inner">
        <p className="contact-page__kicker">Contact</p>
        <h1 className="contact-page__title">Contact and email</h1>

        <p className="contact-page__lede">
          I&apos;m fortunate to get messages from interesting people. To keep
          the channel useful — and to maximize the chance I actually see yours —
          please follow these rules:
        </p>

        <ol className="contact-page__rules">
          <li>
            <strong>Pick the most relevant option.</strong> Use only one contact
            method that fits the nature of your message.
          </li>
          <li>
            <strong>One message.</strong> Send once, to one place — not the same
            note in five inboxes.
          </li>
          <li>
            <strong>Be clear.</strong> Who you are, what you want, and why it
            matters. Short beats vague.
          </li>
        </ol>

        <p className="contact-page__intro">
          The following are ways to contact me:
        </p>

        <section className="contact-page__section" aria-labelledby="contact-email-h">
          <h2 id="contact-email-h" className="contact-page__h2">
            Email
          </h2>
          <p className="contact-page__note">
            Please do not spam multiple subjects for the same ask. One clear
            thread is enough.
          </p>

          <ul className="contact-page__list">
            {CHANNELS.map((ch) => (
              <li key={ch.label} className="contact-page__item">
                <span className="contact-page__item-label">{ch.label}</span>
                <p>{ch.blurb}</p>
                {ch.href ? (
                  <a href={ch.href}>Open photography booking →</a>
                ) : (
                  <a href={mail(ch.subject)}>{siteConfig.email}</a>
                )}
              </li>
            ))}
          </ul>
        </section>

        <p className="contact-page__foot">
          <strong>Please note:</strong> I read what I can. I may not reply to
          everything — that doesn&apos;t mean it wasn&apos;t appreciated. If
          you&apos;re building something real, I care more than the silence
          suggests.
        </p>

        <nav className="contact-page__socials" aria-label="Social">
          {siteConfig.socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
