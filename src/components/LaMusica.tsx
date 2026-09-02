"use client";

import { MUSICA_TRACKS, type MusicaTrack } from "@/data/musica";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "@/styles/la-musica.css";

export function LaMusica() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const [tempo, setTempo] = useState(1);
  const tracks = MUSICA_TRACKS;
  const track: MusicaTrack | undefined = tracks[index];

  const hide = pathname.startsWith("/kids-book");

  const applyAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.playbackRate = tempo;
    if (on && track?.src) {
      void audio.play().catch(() => {
        setOn(false);
      });
    } else {
      audio.pause();
    }
  }, [on, tempo, track?.src, volume]);

  useEffect(() => {
    applyAudio();
  }, [applyAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.src) return;
    if (audio.src !== new URL(track.src, window.location.href).href) {
      audio.src = track.src;
      if (on) void audio.play().catch(() => setOn(false));
    }
  }, [index, on, track?.src]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("la-musica-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("la-musica-open");
    };
  }, [open]);

  if (hide) return null;

  const skip = (dir: -1 | 1) => {
    if (tracks.length === 0) return;
    setIndex((i) => (i + dir + tracks.length) % tracks.length);
  };

  return (
    <>
      <button
        type="button"
        className={`la-musica-tab${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="la-musica-deck"
        onClick={() => setOpen((v) => !v)}
      >
        la musica
      </button>

      {open ? (
        <div
          className="la-musica"
          id="la-musica-deck"
          role="dialog"
          aria-label="la musica"
        >
          <div className="la-musica__stage">
            <div className="la-musica-deck">
              <div className="la-musica-deck__platter-wrap">
                <div
                  className={`la-musica-platter${on ? " is-spinning" : ""}`}
                  aria-hidden
                >
                  <span className="la-musica-platter__grooves" />
                  <span
                    className="la-musica-platter__label"
                    style={
                      track?.cover
                        ? { backgroundImage: `url(${track.cover})` }
                        : undefined
                    }
                  />
                  <span className="la-musica-platter__spindle" />
                </div>
                <div
                  className={`la-musica-arm${on ? " is-down" : ""}`}
                  aria-hidden
                >
                  <span className="la-musica-arm__pivot" />
                  <span className="la-musica-arm__bar" />
                  <span className="la-musica-arm__head" />
                </div>
              </div>

              <div className="la-musica-deck__controls">
                <button
                  type="button"
                  className={`la-musica-power${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  aria-label={on ? "power off" : "power on"}
                  onClick={() => setOn((v) => !v)}
                />

                <div className="la-musica-track">
                  <button
                    type="button"
                    className="la-musica-track__prev"
                    aria-label="previous"
                    onClick={() => skip(-1)}
                  />
                  <span>TRACK</span>
                  <button
                    type="button"
                    className="la-musica-track__next"
                    aria-label="next"
                    onClick={() => skip(1)}
                  />
                </div>

                <VolumeKnob value={volume} onChange={setVolume} />

                <TempoFader value={tempo} onChange={setTempo} />
              </div>
            </div>

            {tracks.length > 0 ? (
              <ul className="la-musica-stack" aria-label="records">
                {tracks.map((item, i) => (
                  <li key={`${item.title}-${item.artist}`}>
                    <button
                      type="button"
                      className={`la-musica-disc${
                        i === index ? " is-current" : ""
                      }`}
                      onClick={() => setIndex(i)}
                    >
                      <span
                        className="la-musica-disc__art"
                        style={
                          item.cover
                            ? { backgroundImage: `url(${item.cover})` }
                            : undefined
                        }
                      />
                      <span className="la-musica-disc__name">{item.title}</span>
                      <span className="la-musica-disc__artist">
                        {item.artist}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <audio ref={audioRef} preload="none" />
        </div>
      ) : null}
    </>
  );
}

function VolumeKnob({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const rotating = useRef(false);

  const fromPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
    /* Map -135°…+135° to 0…1 */
    let deg = (angle * 180) / Math.PI + 90;
    if (deg < -135) deg = -135;
    if (deg > 135) deg = 135;
    onChange(Number(((deg + 135) / 270).toFixed(3)));
  };

  return (
    <label className="la-musica-volume">
      <button
        type="button"
        className="la-musica-knob"
        aria-label="volume"
        style={{ transform: `rotate(${value * 270 - 135}deg)` }}
        onPointerDown={(event) => {
          rotating.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!rotating.current) return;
          fromPointer(event);
        }}
        onPointerUp={() => {
          rotating.current = false;
        }}
      />
      <span>VOLUME</span>
    </label>
  );
}

function TempoFader({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const dragging = useRef(false);
  const min = 0.7;
  const max = 1.3;

  const fromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const t = 1 - (event.clientY - rect.top) / rect.height;
    const next = min + Math.min(1, Math.max(0, t)) * (max - min);
    onChange(Number(next.toFixed(3)));
  };

  return (
    <label className="la-musica-tempo">
      <div
        className="la-musica-fader"
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          fromPointer(event);
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          fromPointer(event);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        <span
          className="la-musica-fader__cap"
          style={{ top: `${((max - value) / (max - min)) * 100}%` }}
        />
      </div>
      <span>TEMPO</span>
    </label>
  );
}
