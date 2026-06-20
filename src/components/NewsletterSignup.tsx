"use client";

import { useState } from "react";
import { NEWSLETTER_TOPICS, type NewsletterTopic } from "@/lib/newsletter-shared";

const TOPIC_COPY: Record<
  NewsletterTopic,
  { label: string; description: string }
> = {
  daily: {
    label: "Daily",
    description: "Podcasts, things learned, memory solidification.",
  },
  research: {
    label: "Research",
    description: "Papers, experiments, med-tech notes.",
  },
  art: {
    label: "Art",
    description: "Photography, visual work, creative drops.",
  },
};

interface NewsletterSignupProps {
  variant?: "default" | "compact" | "footer";
  className?: string;
}

export function NewsletterSignup({
  variant = "default",
  className = "",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState<NewsletterTopic[]>(["daily"]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  const toggleTopic = (topic: NewsletterTopic) => {
    setTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      setStatus("error");
      return;
    }
    if (topics.length === 0) {
      setError("Pick at least one topic.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, topics }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        className={`newsletter-signup newsletter-signup--success newsletter-signup--${variant} ${className}`}
      >
        <p className="newsletter-signup__success-title">You&apos;re in.</p>
        <p className="newsletter-signup__success-note">
          Only the topics you chose — no noise.
        </p>
      </div>
    );
  }

  const isCompact = variant === "compact";
  const isFooter = variant === "footer";

  return (
    <form
      onSubmit={handleSubmit}
      className={`newsletter-signup newsletter-signup--${variant} ${className}`}
      noValidate
    >
      {isCompact ? (
        <p className="newsletter-signup__compact-lede">
          Get updates on what you care about.
        </p>
      ) : (
        <div className="newsletter-signup__intro">
          <p className="newsletter-signup__eyebrow">Newsletter</p>
          <p
            className={
              isFooter
                ? "newsletter-signup__lede newsletter-signup__lede--footer"
                : "newsletter-signup__lede"
            }
          >
            {isFooter
              ? "Pick the topics you want — I only write when it fits."
              : "A small letter from me — daily posts on podcasts I'm listening to, things I'm learning, conversations with experts. Pick what you want; I'll only write when it fits."}
          </p>
        </div>
      )}

      <fieldset className="newsletter-signup__topics">
        <legend className="newsletter-signup__legend">Topics</legend>
        <div className="newsletter-signup__topic-grid">
          {NEWSLETTER_TOPICS.map((topic) => (
            <label key={topic} className="newsletter-signup__topic">
              <input
                type="checkbox"
                name="topics"
                value={topic}
                checked={topics.includes(topic)}
                onChange={() => toggleTopic(topic)}
                className="newsletter-signup__checkbox"
              />
              <span className="newsletter-signup__topic-label">
                {TOPIC_COPY[topic].label}
              </span>
              {!isCompact ? (
                <span className="newsletter-signup__topic-desc">
                  {TOPIC_COPY[topic].description}
                </span>
              ) : null}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="newsletter-signup__row">
        <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
          Email
        </label>
        <input
          id={`newsletter-email-${variant}`}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          autoComplete="email"
          required
          className="newsletter-signup__input"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="newsletter-signup__submit"
        >
          {status === "loading" ? "…" : "Subscribe"}
        </button>
      </div>

      {status === "error" && error ? (
        <p className="newsletter-signup__error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
