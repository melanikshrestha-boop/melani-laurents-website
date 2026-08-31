import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import "@/styles/contact.css";

export const metadata: Metadata = {
  title: "Contact",
};

const EMAIL = "mshresth@usc.edu";
const INSTAGRAM = "https://www.instagram.com/melanilaurents/";

export default function ContactPage() {
  return (
    <main className="contact-page contact-page--hi">
      <div className="contact-hi">
        <h1 className="contact-hi__title">Say hi,</h1>
        <p className="contact-hi__line">
          I&apos;m always interested in meeting new people, building new
          things, breaking new frontiers, strange internet projects, internet
          posting, even shit posting, and ideas that sound bizarre.
        </p>
        <p className="contact-hi__links">
          <a href={siteConfig.linkedinUrl} target="_blank" rel="noopener noreferrer">
            [ linkedin ]
          </a>{" "}
          <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
            [ instagram ]
          </a>{" "}
          <a href={`mailto:${EMAIL}`}>[ email ]</a>
        </p>
      </div>
    </main>
  );
}
