"use client";

/**
 * Per-post comments + opinions — visitors leave a stance + take.
 * No accounts in v1: name + comment + optional link. Persisted via API.
 */
import { useCallback, useEffect, useState } from "react";
import type { PublicOpinion, Stance } from "@/data/consume-types";
import { STANCE_LABEL } from "@/data/consume-types";

const STANCES: Stance[] = [
  "agree",
  "disagree",
  "curious",
  "building-on",
  "rethinking",
  "skip",
];

type Props = {
  threadId: string;
  /** What they are reacting to — shown above the form */
  prompt: string;
  /** Initial opinions from server render (optional) */
  initial?: PublicOpinion[];
};

export function OpinionThread({ threadId, prompt, initial = [] }: Props) {
  const [opinions, setOpinions] = useState<PublicOpinion[]>(initial);
  const [name, setName] = useState("");
  const [stance, setStance] = useState<Stance>("curious");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/discussions/${encodeURIComponent(threadId)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.opinions)) setOpinions(data.opinions);
    } catch {
      /* keep initial */
    }
  }, [threadId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const res = await fetch(`/api/discussions/${encodeURIComponent(threadId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          stance,
          body,
          link: link.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not post.");
      setBody("");
      setLink("");
      setStatus("Posted — thank you for thinking out loud.");
      if (data.opinion) setOpinions((prev) => [data.opinion as PublicOpinion, ...prev]);
      else await refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Post failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="op-thread" id="discussion" aria-label="Comments and opinions">
      <header className="op-thread__head">
        <p className="op-thread__eyebrow">Discussion</p>
        <h2 className="op-thread__title">Comment &amp; voice your opinion</h2>
        <p className="op-thread__prompt">{prompt}</p>
      </header>

      <form className="op-form" onSubmit={submit}>
        <label className="op-form__field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={48}
            required
            autoComplete="nickname"
            placeholder="How you want to be known here"
          />
        </label>

        <fieldset className="op-form__stances">
          <legend>Your stance</legend>
          <div className="op-form__stance-row">
            {STANCES.map((s) => (
              <label key={s} className={`op-stance${stance === s ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="stance"
                  value={s}
                  checked={stance === s}
                  onChange={() => setStance(s)}
                />
                {STANCE_LABEL[s]}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="op-form__field">
          <span>Comment</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            minLength={8}
            maxLength={2000}
            rows={4}
            placeholder="Agree, push back, reframe, or build on the thesis — say something real."
          />
        </label>

        <label className="op-form__field">
          <span>Link (optional)</span>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
          />
        </label>

        <button type="submit" className="op-form__submit" disabled={busy}>
          {busy ? "Posting…" : "Post comment"}
        </button>
        {status ? <p className="op-form__status">{status}</p> : null}
      </form>

      <div className="op-list" aria-live="polite">
        <p className="op-list__count">
          {opinions.length === 0
            ? "No comments yet — be the first voice."
            : `${opinions.length} ${opinions.length === 1 ? "comment" : "comments"}`}
        </p>
        <ul className="op-list__items">
          {opinions.map((op) => (
            <li key={op.id} className="op-item">
              <div className="op-item__meta">
                <strong className="op-item__name">{op.name}</strong>
                <span className="op-item__stance">{STANCE_LABEL[op.stance]}</span>
                <time dateTime={op.createdAt}>
                  {new Date(op.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <p className="op-item__body">{op.body}</p>
              {op.link ? (
                <a className="op-item__link" href={op.link} target="_blank" rel="noopener noreferrer">
                  source ↗
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
