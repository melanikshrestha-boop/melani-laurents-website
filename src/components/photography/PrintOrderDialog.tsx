"use client";

import Image from "next/image";
import { PaperPlaneTilt, X } from "@phosphor-icons/react";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import type { Photo } from "@/data/photography-meta";

type SubmitState =
  | { kind: "idle"; message: "" }
  | { kind: "sending"; message: "Sending..." }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string; mailFallback?: boolean };

interface PrintOrderDialogProps {
  photo: Photo;
  onClose: () => void;
}

export function PrintOrderDialog({ photo, onClose }: PrintOrderDialogProps) {
  const print = photo.print;
  const [selectedSize, setSelectedSize] = useState(print?.sizes[0]?.label ?? "");
  const [submitState, setSubmitState] = useState<SubmitState>({
    kind: "idle",
    message: "",
  });

  const selected = print?.sizes.find((size) => size.label === selectedSize);
  const mailto = useMemo(() => {
    if (!print || !selected) return `mailto:${siteConfig.email}`;
    const subject = `Print request: ${print.title} (${selected.label})`;
    const body = [
      `I would like to order ${print.title}.`,
      `Catalog: ${print.catalogId}`,
      `Size: ${selected.label}`,
      `Price: $${selected.priceUsd} USD plus shipping`,
    ].join("\n");
    return `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [print, selected]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!print || !selected) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!print || !selected) return;
    const formData = new FormData(event.currentTarget);
    const shipTo = String(formData.get("shipTo") ?? "").trim();

    setSubmitState({ kind: "sending", message: "Sending..." });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          topic: "Photography",
          subject: `Print request: ${print.title} (${selected.label})`,
          message: [
            "Scenery print order request",
            `Photograph: ${print.title}`,
            `Catalog: ${print.catalogId}`,
            `Size: ${selected.label}`,
            `Print price: $${selected.priceUsd} USD`,
            `Shipping destination: ${shipTo}`,
          ].join("\n"),
        }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        code?: string;
      };

      if (!response.ok) {
        setSubmitState({
          kind: "error",
          message: result.error ?? "Your request could not be sent.",
          mailFallback: result.code === "MAIL_NOT_CONFIGURED",
        });
        return;
      }

      setSubmitState({
        kind: "success",
        message: "Request received. I’ll email you with shipping and a secure payment link.",
      });
    } catch {
      setSubmitState({
        kind: "error",
        message: "Your request could not be sent. Please try again.",
        mailFallback: true,
      });
    }
  }

  return (
    <div
      className="print-order-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="print-order-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-order-title"
      >
        <button
          type="button"
          className="print-order-close"
          onClick={onClose}
          aria-label="Close print order"
          autoFocus
        >
          <X size={20} weight="bold" aria-hidden />
        </button>

        <div className="print-order-preview">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 700px) 100vw, 38vw"
          />
        </div>

        <div className="print-order-content">
          <p className="print-order-kicker">{print.catalogId} · open edition</p>
          <h2 id="print-order-title">{print.title}</h2>
          <p className="print-order-material">
            Archival giclée on natural white matte paper. Unframed.
          </p>

          <form className="print-order-form" onSubmit={handleSubmit}>
            <div className="print-order-honeypot" aria-hidden>
              <label htmlFor="print-company">Company</label>
              <input
                id="print-company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <fieldset>
              <legend>Print size</legend>
              <div className="print-order-sizes">
                {print.sizes.map((size) => (
                  <label key={size.label}>
                    <input
                      type="radio"
                      name="size"
                      value={size.label}
                      checked={selectedSize === size.label}
                      onChange={() => setSelectedSize(size.label)}
                    />
                    <span>
                      {size.label}
                      <strong>${size.priceUsd}</strong>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="print-order-fields">
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
              <span>Ship to</span>
              <input
                name="shipTo"
                type="text"
                placeholder="City, state / region, country"
                required
              />
            </label>

            <p className="print-order-shipping">
              Shipping is quoted separately before payment.
            </p>

            <div className="print-order-submit">
              <button type="submit" disabled={submitState.kind === "sending"}>
                <PaperPlaneTilt size={17} weight="bold" aria-hidden />
                {submitState.kind === "sending"
                  ? "Sending..."
                  : `Request print · $${selected.priceUsd}`}
              </button>
              <p
                className={`print-order-status print-order-status--${submitState.kind}`}
                role="status"
                aria-live="polite"
              >
                {submitState.message}
                {submitState.kind === "error" && submitState.mailFallback ? (
                  <>
                    {" "}
                    <a href={mailto}>Email the request.</a>
                  </>
                ) : null}
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
