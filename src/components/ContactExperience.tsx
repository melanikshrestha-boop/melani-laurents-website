"use client";

import { type FormEvent, useRef, useState } from "react";
import { PaperPlaneTilt } from "@phosphor-icons/react";
import { siteConfig } from "@/config/site";
import { CONTACT_TOPICS } from "@/lib/contact";
import "@/styles/contact.css";

type SubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "sending"; message: "Sending..." }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; mailFallback?: boolean };

export function ContactExperience() {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState({ kind: "sending", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message: result.error ?? "Your message could not be sent.",
          mailFallback: result.code === "MAIL_NOT_CONFIGURED",
        });
        return;
      }

      formRef.current?.reset();
      setSubmitState({
        kind: "success",
        message: "Sent. Thank you for writing.",
      });
    } catch {
      setSubmitState({
        kind: "error",
        message: "Your message could not be sent. Please try again.",
      });
    }
  }

  return (
    <main className="contact-page">
      <div className="contact-page__shell">
        <header className="contact-page__intro">
          <p className="contact-page__kicker">Contact · Celine Nova</p>
          <h1 aria-label="Send me something.">
            <span>Send me</span>
            {" "}
            <em>something.</em>
          </h1>
          <p className="contact-page__lede">
            An idea, collaboration, paper, question, bug, photograph, or hello.
          </p>
          <a className="contact-page__email" href={`mailto:${siteConfig.email}`}>
            {siteConfig.email}
          </a>
        </header>

        <section className="contact-page__form-section" aria-label="Send a message">
          <form ref={formRef} className="contact-page__form" onSubmit={handleSubmit}>
            <div className="contact-page__honeypot" aria-hidden>
              <label htmlFor="contact-company">Company</label>
              <input
                id="contact-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="contact-page__form-row">
              <label>
                <span>Name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
            </div>

            <label>
              <span>What is this about?</span>
              <select name="topic" defaultValue="" required>
                <option value="" disabled>
                  Choose one
                </option>
                {CONTACT_TOPICS.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Subject</span>
              <input name="subject" type="text" maxLength={160} required />
            </label>

            <label>
              <span>Message</span>
              <textarea name="message" rows={7} maxLength={5000} required />
            </label>

            <label>
              <span>Link <small>optional</small></span>
              <input
                name="link"
                type="url"
                inputMode="url"
                placeholder="https://"
              />
            </label>

            <div className="contact-page__submit-row">
              <button type="submit" disabled={submitState.kind === "sending"}>
                <PaperPlaneTilt size={17} weight="bold" aria-hidden />
                {submitState.kind === "sending" ? "Sending..." : "Send message"}
              </button>
              <div
                className={`contact-page__status contact-page__status--${submitState.kind}`}
                role="status"
                aria-live="polite"
              >
                {submitState.message}
                {submitState.kind === "error" && submitState.mailFallback ? (
                  <>
                    {" "}
                    <a href={`mailto:${siteConfig.email}`}>Email me directly.</a>
                  </>
                ) : null}
              </div>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
