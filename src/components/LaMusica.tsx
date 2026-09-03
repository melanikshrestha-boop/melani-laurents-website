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
  const platterRef = useRef<HTMLDivElement | null>(null);
  const sleeveRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(0.55);
  const [tempo, setTempo] = useState(1);
  const [flight, setFlight] = useState<null | {
    i: number;
    cover?: string;
    x: number;
    y: number;
    size: number;
    phase: "out" | "fly";
  }>(null);
  const tracks = MUSICA_TRACKS;
  const track: MusicaTrack | undefined = tracks[index];
  const onPlatter = !flight;

  const hide = pathname.startsWith("/kids-book");

  const applyAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.playbackRate = tempo;
    if (on && onPlatter && track?.src) {
      void audio.play().catch(() => {
        setOn(false);
      });
    } else {
      audio.pause();
    }
  }, [on, onPlatter, tempo, track?.src, volume]);

  useEffect(() => {
    applyAudio();
  }, [applyAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.src) return;
    if (audio.src !== new URL(track.src, window.location.href).href) {
      audio.src = track.src;
      if (on && onPlatter) void audio.play().catch(() => setOn(false));
    }
  }, [index, on, onPlatter, track?.src]);

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

  useEffect(() => {
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const placeAlbum = (next: number) => {
    if (tracks.length === 0 || flight) return;
    const i = (next + tracks.length) % tracks.length;
    if (i === index && !flight) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sleeve = sleeveRefs.current[i];
    const platter = platterRef.current;
    const from = sleeve?.getBoundingClientRect();
    const to = platter?.getBoundingClientRect();
    setIndex(i);
    if (reduce || !from || !to) return;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setFlight({
      i,
      cover: tracks[i].cover,
      x: from.left + from.width * 0.08,
      y: from.top + from.height * 0.04,
      size: Math.min(from.width, from.height) * 0.86,
      phase: "out",
    });
    timers.current.push(
      window.setTimeout(() => {
        setFlight((current) =>
          current
            ? {
                ...current,
                phase: "fly",
                x: to.left,
                y: to.top,
                size: to.width,
              }
            : current,
        );
      }, 480),
    );
    timers.current.push(
      window.setTimeout(() => {
        setFlight(null);
      }, 1320),
    );
  };

  if (hide) return null;

  const skip = (dir: -1 | 1) => {
    if (tracks.length === 0) return;
    placeAlbum(index + dir);
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
          <h2 className="la-musica__title">the top 10 everchanging</h2>
          <div className="la-musica__stage">
            <div className="la-musica-deck">
              <div className="la-musica-deck__platter-wrap">
                <div
                  ref={platterRef}
                  className={`la-musica-platter${
                    on && onPlatter ? " is-spinning" : ""
                  }${onPlatter ? "" : " is-waiting"}`}
                  aria-hidden
                >
                  <span className="la-musica-platter__grooves" />
                  <span
                    className="la-musica-platter__label"
                    style={
                      onPlatter && track?.cover
                        ? { backgroundImage: `url(${track.cover})` }
                        : undefined
                    }
                  />
                  <span className="la-musica-platter__spindle" />
                </div>
                <div
                  className={`la-musica-arm${
                    on && onPlatter ? " is-down" : ""
                  }`}
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
              <ul
                className="la-musica-stack"
                aria-label="albums"
                onWheel={(event) => {
                  event.preventDefault();
                  skip(event.deltaY > 0 ? 1 : -1);
                }}
              >
                {tracks.map((item, i) => {
                  const offset = i - index;
                  return (
                    <li
                      key={`${item.title}-${item.artist}`}
                      style={{
                        transform:
                          offset === 0
                            ? "translateX(0) rotateY(0deg) translateZ(24px)"
                            : `translateX(${offset * 8.4}rem) rotateY(${
                                offset > 0 ? -62 : 62
                              }deg) translateZ(${-36 * Math.abs(offset)}px)`,
                        zIndex: 30 - Math.abs(offset),
                        opacity: Math.abs(offset) > 3 ? 0 : 1,
                        pointerEvents:
                          Math.abs(offset) > 3 || flight ? "none" : "auto",
                      }}
                    >
                      <button
                        type="button"
                        ref={(node) => {
                          sleeveRefs.current[i] = node;
                        }}
                        className={`la-musica-disc${
                          i === index ? " is-current" : ""
                        }${flight?.i === i ? " is-opening" : ""}`}
                        onClick={() => placeAlbum(i)}
                      >
                        <span className="la-musica-sleeve" aria-hidden>
                          <span
                            className="la-musica-sleeve__art"
                            style={
                              item.cover
                                ? { backgroundImage: `url(${item.cover})` }
                                : undefined
                            }
                          />
                          <span className="la-musica-sleeve__peek" />
                        </span>
                        <span className="la-musica-disc__name">
                          {item.title}
                        </span>
                        <span className="la-musica-disc__artist">
                          {item.artist}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
          {flight ? (
            <span
              className={`la-musica-fly la-musica-fly--${flight.phase}`}
              style={{
                left: flight.x,
                top: flight.y,
                width: flight.size,
                height: flight.size,
              }}
              aria-hidden
            >
              <span className="la-musica-fly__grooves" />
              <span
                className="la-musica-fly__label"
                style={
                  flight.cover
                    ? { backgroundImage: `url(${flight.cover})` }
                    : undefined
                }
              />
            </span>
          ) : null}
          <audio ref={audioRef} src={track?.src} preload="metadata" />
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
