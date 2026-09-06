"use client";

import { X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { PortraitBookForm } from "@/components/photography/PortraitBookForm";

export function PortraitBooker() {
  const [open, setOpen] = useState(false);

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

  return (
    <>
      <button
        type="button"
        className="portfolio-book-me"
        onClick={() => setOpen(true)}
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
            <PortraitBookForm />
          </section>
        </div>
      ) : null}
    </>
  );
}
