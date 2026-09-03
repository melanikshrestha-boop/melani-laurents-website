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

/* Coverflow math from aayushkapoor.me/vinyl: current at Z 300; left +45°, right −45°. */
function coverTransform(i: number, current: number) {
  if (i === current) {
    return "translateX(0px) translateZ(300px) rotateY(0deg)";
  }
  if (i < current) {
    return `translateX(${(i - current) * 120 - 50}px) translateZ(0px) rotateY(45deg)`;
  }
  return `translateX(${(i - current) * 120 + 50}px) translateZ(0px) rotateY(-45deg)`;
}

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
    }
  }, [index, track?.src]);

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
                  <span className="la-musica-arm__counter" />
                  <span className="la-musica-arm__pivot" />
                  <span className="la-musica-arm__bar" />
                  <span className="la-musica-arm__head" />
                </div>
                <div className="la-musica-arm-rest" aria-hidden />
                <TrackCurve
                  onPrev={() => skip(-1)}
                  onNext={() => skip(1)}
                />
              </div>

              <div className="la-musica-deck__left">
                <button
                  type="button"
                  className={`la-musica-power${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  aria-label={on ? "power off" : "power on"}
                  disabled={!onPlatter}
                  onClick={() => setOn((v) => !v)}
                >
                  <span className="la-musica-power__well" />
                  <span className="la-musica-power__rocker" />
                  <span className="la-musica-power__led" />
                </button>
              </div>

              <div className="la-musica-deck__right">
                <VolumeKnob value={volume} onChange={setVolume} />
                <TempoFader value={tempo} onChange={setTempo} />
              </div>
            </div>

            {tracks.length > 0 ? (
              <div
                className="la-musica-coverflow"
                aria-label="albums"
                onWheel={(event) => {
                  event.preventDefault();
                  skip(event.deltaY > 0 ? 1 : -1);
                }}
              >
                <div className="la-musica-coverflow__scene">
                  {tracks.map((item, i) => (
                    <button
                      key={`${item.title}-${item.artist}`}
                      type="button"
                      ref={(node) => {
                        sleeveRefs.current[i] = node;
                      }}
                      className={`la-musica-cover${
                        i === index ? " is-current" : ""
                      }${flight?.i === i ? " is-opening" : ""}`}
                      style={{
                        transform: coverTransform(i, index),
                        zIndex: i === index ? 50 : 10,
                      }}
                      onClick={() => placeAlbum(i)}
                    >
                      <span className="la-musica-cover__face">
                        <span
                          className="la-musica-cover__art"
                          style={
                            item.cover
                              ? { backgroundImage: `url(${item.cover})` }
                              : undefined
                          }
                        />
                        {i === index ? (
                          <span className="la-musica-cover__note" aria-hidden>
                            ♪
                          </span>
                        ) : null}
                      </span>
                      <span className="la-musica-cover__info">
                        <span className="la-musica-cover__name">
                          {item.title}
                        </span>
                        <span className="la-musica-cover__artist">
                          {item.artist}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
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

function TrackCurve({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="la-musica-track">
      <svg
        width="140"
        height="80"
        viewBox="0 0 140 80"
        className="la-musica-track__svg"
        aria-hidden
      >
        <defs>
          <path id="la-musica-track-curve" d="M 20 40 Q 70 80 120 40" fill="none" />
          <path id="la-musica-track-text" d="M 35 40 Q 70 55 105 37" fill="none" />
        </defs>
        <text className="la-musica-track__label">
          <textPath href="#la-musica-track-text" startOffset="50%" textAnchor="middle">
            TRACK
          </textPath>
        </text>
      </svg>
      <button
        type="button"
        className="la-musica-track__prev"
        aria-label="previous"
        onClick={onPrev}
      />
      <button
        type="button"
        className="la-musica-track__next"
        aria-label="next"
        onClick={onNext}
      />
    </div>
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
  const ticks = Array.from({ length: 101 }, (_, i) => {
    const deg = -135 + 2.7 * i;
    const rad = (deg * Math.PI) / 180;
    return {
      i,
      deg,
      major: i % 10 === 0,
      left: 64 + 58 * Math.cos(rad),
      top: 64 + 58 * Math.sin(rad),
    };
  });

  const fromPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
    let deg = (angle * 180) / Math.PI + 90;
    if (deg < -135) deg = -135;
    if (deg > 135) deg = 135;
    onChange(Number(((deg + 135) / 270).toFixed(3)));
  };

  return (
    <label className="la-musica-volume">
      <span className="la-musica-volume__dial">
        <span className="la-musica-volume__ticks" aria-hidden>
          {ticks.map((tick) => (
            <span
              key={tick.i}
              className={`la-musica-tick${tick.major ? " is-major" : ""}`}
              style={{
                left: tick.left,
                top: tick.top,
                transform: `translate(-50%, -50%) rotate(${tick.deg}deg)`,
              }}
            />
          ))}
        </span>
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
      </span>
      <span className="la-musica-volume__name">VOLUME</span>
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
      <span className="la-musica-tempo__row">
        <span className="la-musica-tempo__scale" aria-hidden>
          <span>+</span>
          <span>0</span>
          <span>−</span>
        </span>
        <span className="la-musica-tempo__marks" aria-hidden>
          {Array.from({ length: 17 }, (_, i) => (
            <span
              key={i}
              className={i % 2 === 0 ? "is-major" : undefined}
              style={{ top: `${(i / 16) * 100}%` }}
            />
          ))}
        </span>
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
          <span className="la-musica-fader__groove" />
          <span
            className="la-musica-fader__cap"
            style={{ top: `${((max - value) / (max - min)) * 100}%` }}
          />
        </div>
      </span>
      <span className="la-musica-tempo__name">TEMPO</span>
    </label>
  );
}
