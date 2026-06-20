"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

type Phase = "idle" | "scanning" | "open" | "sent";

const PROMPTS = [
  "Who are you?",
  "What are you building?",
  "Why me — right now?",
] as const;

export function ContactExperience() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [signal, setSignal] = useState(0);
  const [fields, setFields] = useState({ name: "", build: "", why: "" });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openChannel = useCallback(() => {
    setPhase("scanning");
    window.setTimeout(() => setPhase("open"), 1400);
  }, []);

  useEffect(() => {
    if (phase === "idle") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const nodes = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random(),
      p: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
    };
    resize();

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const intensity = phase === "scanning" ? 0.5 : phase === "open" ? 1 : 0.3;

      for (const n of nodes) {
        n.p += 0.02;
        const x = n.x * w;
        const y = n.y * h;
        const r = 2 + Math.sin(n.p) * 1.5;
        ctx.fillStyle = `rgba(232, 184, 106, ${0.35 * intensity})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d > 0.22) continue;
          ctx.strokeStyle = `rgba(126, 184, 218, ${(1 - d / 0.22) * 0.25 * intensity})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
          ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
          ctx.stroke();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  useEffect(() => {
    const filled = [fields.name, fields.build, fields.why].filter(Boolean).length;
    setSignal(Math.min(100, filled * 28 + fields.why.length * 0.4));
  }, [fields]);

  function transmit() {
    const body = encodeURIComponent(
      `Name: ${fields.name}\nBuilding: ${fields.build}\nWhy now: ${fields.why}`,
    );
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent("Signal from melanikirstein.com")}&body=${body}`;
    setPhase("sent");
  }

  return (
    <div className="contact-xp relative min-h-[calc(100svh-3.5rem)] overflow-hidden bg-[#030508] px-6 py-16">
      <canvas
        ref={canvasRef}
        className="contact-xp__canvas pointer-events-none absolute inset-0 h-full w-full opacity-60"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-xl">
        <p className="font-mono-label text-[10px] tracking-[0.4em] text-amber/70 uppercase">
          Open channel
        </p>

        {phase === "idle" && (
          <div className="mt-12">
            <h1 className="font-serif text-3xl leading-snug text-white sm:text-4xl">
              You made it here.
              <br />
              <span className="text-amber/90">Say something worth answering.</span>
            </h1>
            <p className="mt-6 text-sm leading-relaxed text-white/45">
              No forms buried in a footer. Open a signal — I read what lands
              with intent. LinkedIn gets the fastest reply.
            </p>
            <button
              type="button"
              onClick={openChannel}
              className="contact-xp__pulse mt-10 font-mono-label text-[10px] tracking-[0.32em] text-amber uppercase"
            >
              Establish connection →
            </button>
            <a
              href={siteConfig.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block font-mono-label text-[10px] tracking-[0.22em] text-white/35 uppercase hover:text-amber/80"
            >
              Or skip straight to LinkedIn ↗
            </a>
          </div>
        )}

        {phase === "scanning" && (
          <div className="mt-16 font-mono-label text-sm text-amber/80">
            <p className="contact-xp__blink">Scanning for intent…</p>
            <p className="mt-4 text-[10px] tracking-[0.3em] text-white/30 uppercase">
              Signal lock in progress
            </p>
          </div>
        )}

        {(phase === "open" || phase === "sent") && (
          <div className="mt-10">
            <div className="mb-8 flex items-center gap-3">
              <div className="contact-xp__meter flex-1">
                <div
                  className="contact-xp__meter-fill"
                  style={{ width: `${signal}%` }}
                />
              </div>
              <span className="font-mono-label text-[10px] tabular-nums text-amber/70">
                {Math.round(signal)}%
              </span>
            </div>

            {phase === "sent" ? (
              <p className="font-serif text-xl text-white/85">
                Signal sent. I&apos;ll be in touch if it resonates.
              </p>
            ) : (
              <div className="flex flex-col gap-6">
                {PROMPTS.map((label, i) => {
                  const key = (["name", "build", "why"] as const)[i];
                  return (
                    <label key={label} className="block">
                      <span className="font-mono-label text-[10px] tracking-[0.2em] text-white/40 uppercase">
                        {label}
                      </span>
                      <input
                        type="text"
                        value={fields[key]}
                        onChange={(e) =>
                          setFields((f) => ({ ...f, [key]: e.target.value }))
                        }
                        className="contact-xp__input mt-2 w-full"
                        autoFocus={i === 0}
                      />
                    </label>
                  );
                })}

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={transmit}
                    disabled={signal < 40}
                    className="contact-xp__transmit font-mono-label text-[10px] tracking-[0.28em] uppercase disabled:opacity-30"
                  >
                    Transmit signal
                  </button>
                  <a
                    href={siteConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-label text-[10px] tracking-[0.22em] text-amber uppercase hover:text-amber/80"
                  >
                    LinkedIn — fastest path ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        <Link
          href="/"
          className="mt-16 inline-block font-mono-label text-[10px] tracking-[0.2em] text-white/25 uppercase hover:text-white/50"
        >
          ← Back home
        </Link>
      </div>
    </div>
  );
}
