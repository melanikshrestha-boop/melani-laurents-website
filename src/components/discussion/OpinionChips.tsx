"use client";

/**
 * Quiet HUD under a post. Three chips, not a comment form.
 * Maps onto the existing discussions API + Stance type.
 */
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { PublicOpinion, Stance } from "@/data/consume-types";

const NAME_KEY = "celine-opinion-name";

type ChipId = "agree" | "unconvinced" | "opposite";

type ChipDef = {
  id: ChipId;
  stance: Stance;
  label: string;
  prompt: string;
  placeholder: string;
  defaultBody: string;
  requireNote: boolean;
};

const CHIPS: ChipDef[] = [
  {
    id: "agree",
    stance: "agree",
    label: "I agree",
    prompt: "Say it in one line, or just send.",
    placeholder: "Optional — why this landed",
    defaultBody: "I agree with this.",
    requireNote: false,
  },
  {
    id: "unconvinced",
    stance: "rethinking",
    label: "I'm not convinced",
    prompt: "What is the hole in it?",
    placeholder: "Optional — the part that does not hold",
    defaultBody: "I'm not convinced.",
    requireNote: false,
  },
  {
    id: "opposite",
    stance: "disagree",
    label: "Send the opposite take",
    prompt: "Argue the other side. That is the whole point of this chip.",
    placeholder: "The opposite take — at least one real sentence",
    defaultBody: "",
    requireNote: true,
  },
];

type Props = {
  threadId: string;
  /** What they are standing on — post title is enough */
  subject: string;
};

function countFor(opinions: PublicOpinion[], chip: ChipDef) {
  return opinions.filter((op) => op.stance === chip.stance).length;
}

export function OpinionChips({ threadId, subject }: Props) {
  const formId = useId();
  const [opinions, setOpinions] = useState<PublicOpinion[]>([]);
  const [open, setOpen] = useState<ChipId | null>(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const chip = CHIPS.find((c) => c.id === open) ?? null;

  const totals = useMemo(
    () => ({
      agree: countFor(opinions, CHIPS[0]),
      unconvinced: countFor(opinions, CHIPS[1]),
      opposite: countFor(opinions, CHIPS[2]),
    }),
    [opinions],
  );

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/discussions/${encodeURIComponent(threadId)}`, {
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.opinions)) setOpinions(data.opinions);
    } catch {
      /* keep silent — chips still work offline as a local gesture */
    }
  }, [threadId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(NAME_KEY);
      if (saved) setName(saved);
    } catch {
      /* ignore */
    }
  }, []);

  function selectChip(id: ChipId) {
    setStatus("");
    setNote("");
    setOpen((prev) => (prev === id ? null : id));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!chip || busy) return;

    const body = (note.trim() || chip.defaultBody).trim();
    if (chip.requireNote && body.length < 8) {
      setStatus("The opposite take needs a real sentence.");
      return;
    }
    if (!name.trim()) {
      setStatus("Leave a name so this is a person, not a ghost.");
      return;
    }

    setBusy(true);
    setStatus("");
    try {
      const res = await fetch(`/api/discussions/${encodeURIComponent(threadId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          stance: chip.stance,
          body,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not send.");
      try {
        window.localStorage.setItem(NAME_KEY, name.trim());
      } catch {
        /* ignore */
      }
      setNote("");
      setOpen(null);
      setStatus(
        chip.id === "opposite"
          ? "Opposite take is in. She will see it."
          : "Logged.",
      );
      if (data.opinion) setOpinions((prev) => [data.opinion as PublicOpinion, ...prev]);
      else await refresh();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setBusy(false);
    }
  }

  const recent = opinions.slice(0, 6);

  return (
    <section className="op-chips" aria-label="Opinion chips">
      <p className="op-chips__kicker">Where do you stand</p>
      <p className="op-chips__subject">{subject}</p>

      <div className="op-chips__row" role="group" aria-label="Choose a stance">
        {CHIPS.map((c) => {
          const count =
            c.id === "agree"
              ? totals.agree
              : c.id === "unconvinced"
                ? totals.unconvinced
                : totals.opposite;
          const on = open === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`op-chip${on ? " is-on" : ""}`}
              aria-pressed={on}
              aria-expanded={on}
              aria-controls={`${formId}-panel`}
              onClick={() => selectChip(c.id)}
            >
              <span className="op-chip__label">{c.label}</span>
              <span className="op-chip__count" aria-label={`${count} so far`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {chip ? (
        <form
          id={`${formId}-panel`}
          className="op-chip-panel"
          onSubmit={submit}
        >
          <p className="op-chip-panel__prompt">{chip.prompt}</p>
          <label className="op-chip-panel__field">
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
          <label className="op-chip-panel__field">
            <span>{chip.requireNote ? "Opposite take" : "Note"}</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={chip.requireNote ? 3 : 2}
              maxLength={2000}
              minLength={chip.requireNote ? 8 : undefined}
              required={chip.requireNote}
              placeholder={chip.placeholder}
            />
          </label>
          <div className="op-chip-panel__actions">
            <button type="submit" className="op-chip-panel__send" disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </button>
            <button
              type="button"
              className="op-chip-panel__cancel"
              onClick={() => {
                setOpen(null);
                setNote("");
                setStatus("");
              }}
            >
              Not now
            </button>
          </div>
        </form>
      ) : null}

      {status ? <p className="op-chips__status">{status}</p> : null}

      {recent.length > 0 ? (
        <ul className="op-chips__feed" aria-live="polite">
          {recent.map((op) => {
            const label =
              CHIPS.find((c) => c.stance === op.stance)?.label ?? op.stance;
            return (
              <li key={op.id} className="op-chips__item">
                <span className="op-chips__who">{op.name}</span>
                <span className="op-chips__did">{label}</span>
                {op.body &&
                op.body !== "I agree with this." &&
                op.body !== "I'm not convinced." ? (
                  <p className="op-chips__note">{op.body}</p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="op-chips__empty">No stances yet. Be first.</p>
      )}
    </section>
  );
}
