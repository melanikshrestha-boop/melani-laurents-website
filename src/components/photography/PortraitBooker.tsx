"use client";

import { X } from "@phosphor-icons/react";
import { type FormEvent, useEffect, useState } from "react";

type SubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "sending"; message: "Sending..." }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function PortraitBooker() {
  const [open, setOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState({ kind: "sending", message: "Sending..." });

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      city: formData.get("city"),
      date: formData.get("date"),
      message: formData.get("message"),
      company: formData.get("company"),
    };

    try {
      const response = await fetch("/api/photography/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        mailto?: string;
      };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message: result.error ?? "Your request could not be sent.",
        });
        return;
      }

      if (result.mailto) {
        window.location.href = result.mailto;
      }

      setSubmitState({ kind: "success", message: "Sent." });
      form.reset();
    } catch {
      setSubmitState({
        kind: "error",
        message: "Your request could not be sent. Please try again.",
      });
    }
  }

  return (
    <>
      <button
        type="button"
        className="portfolio-book-me"
        onClick={() => {
          setSubmitState({ kind: "idle", message: "" });
          setOpen(true);
        }}
      >
        Book a shoot
      </button>

      {open ? (
        <div
          className="print-order-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            className="print-order-dialog portrait-book-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="portrait-book-title"
          >
            <button
              type="button"
              className="print-order-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
              autoFocus
            >
              <X size={20} weight="bold" aria-hidden />
            </button>

            <div className="print-order-content">
              <h2 id="portrait-book-title">Book a shoot</h2>
              <form className="print-order-form" onSubmit={handleSubmit}>
                <div className="print-order-honeypot" aria-hidden>
                  <label htmlFor="book-company">Company</label>
                  <input
                    id="book-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="print-order-fields">
                  <label>
                    <span>Name</span>
                    <input name="name" type="text" autoComplete="name" required />
                  </label>
                  <label>
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <div className="print-order-fields">
                  <label>
                    <span>City</span>
                    <input name="city" type="text" autoComplete="address-level2" required />
                  </label>
                  <label>
                    <span>Date</span>
                    <input name="date" type="date" />
                  </label>
                </div>

                <label>
                  <span>Message</span>
                  <textarea name="message" rows={5} required />
                </label>

                <div className="print-order-submit">
                  <button type="submit" disabled={submitState.kind === "sending"}>
                    {submitState.kind === "sending"
                      ? "Sending..."
                      : "Book a shoot"}
                  </button>
                  <p
                    className={`print-order-status print-order-status--${submitState.kind}`}
                    role="status"
                    aria-live="polite"
                  >
                    {submitState.message}
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
