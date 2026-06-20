"use client";

import { useState } from "react";

type FormStatus = "idle" | "loading" | "success" | "error";

const initialFields = {
  firstName: "",
  lastName: "",
  email: "",
  message: "",
};

export function PhotographyBookingForm() {
  const [fields, setFields] = useState(initialFields);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setStatus("loading");

    try {
      const response = await fetch("/api/photography/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setFields(initialFields);
      setStatus("success");
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="photography-form-success" role="status">
        Sent — I&apos;ll reply within 24 hours
      </p>
    );
  }

  return (
    <form className="photography-form" onSubmit={handleSubmit} noValidate>
      <div className="photography-form-row">
        <div>
          <label htmlFor="booking-first-name">First name</label>
          <input
            id="booking-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            required
            value={fields.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="booking-last-name">Last name</label>
          <input
            id="booking-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            required
            value={fields.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label htmlFor="booking-email">Email</label>
        <input
          id="booking-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          value={fields.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="booking-message">Message</label>
        <textarea
          id="booking-message"
          name="message"
          required
          placeholder="Preferred date, preferred location (or let me choose), any vibe or look you want to portray — or note if you'd like to consult beforehand."
          value={fields.message}
          onChange={handleChange}
        />
      </div>

      {status === "error" && error ? (
        <p className="photography-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send inquiry"}
      </button>
    </form>
  );
}
