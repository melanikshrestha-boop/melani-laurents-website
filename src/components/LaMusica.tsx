"use client";

import { MUSICA_TRACKS, type MusicaTrack } from "@/data/musica";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "@/styles/la-musica.css";

/* Coverflow math from aayushkapoor.me/vinyl. */
function coverTransform(i: number, current: number) {
  if (i === current) {
    return "translateX(0px) translateZ(300px) rotateY(0deg)";
  }
  if (i < current) {
    return `translateX(${(i - current) * 120 - 50}px) translateZ(0px) rotateY(45deg)`;
  }
  return `translateX(${(i - current) * 120 + 50}px) translateZ(0px) rotateY(-45deg)`;
}

function clickTick() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 190;
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
    window.setTimeout(() => void ctx.close(), 80);
  } catch {
    /* ignore */
  }
}

export function LaMusica() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const spinRef = useRef<number | null>(null);
  const timers = useRef<number[]>([]);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [entered, setEntered] = useState(false);
  const [on, setOn] = useState(false);
  const [focus, setFocus] = useState(0);
  const [platterIndex, setPlatterIndex] = useState(0);
  const [discOn, setDiscOn] = useState(true);
  const [removing, setRemoving] = useState(false);
  const [inserting, setInserting] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [pitch, setPitch] = useState(0);
  const [spin, setSpin] = useState(0);
  const [progress, setProgress] = useState(0);
  const tracks = MUSICA_TRACKS;
  const track: MusicaTrack | undefined = tracks[platterIndex];
  const hide = pathname.startsWith("/kids-book");
  const rate = 1 + pitch / 100;
  /* Vinyl 45: one turn every 1.3s (Aayush). Angle locked to audio.currentTime. */
  const REV_SECS = 1.3;

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const cueStart = () => {
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    setProgress(0);
    setSpin(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track?.src) return;
    const next = new URL(track.src, window.location.href).href;
    if (audio.src !== next) {
      audio.src = next;
      audio.currentTime = 0;
      setProgress(0);
      setSpin(0);
    }
  }, [platterIndex, track?.src]);

  /* Volume / pitch / power never rewind. play() only if already paused.
     New track (src change above) starts at 0 and runs to ended — no loop. */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = false;
    audio.volume = volume;
    try {
      if (Math.abs(audio.playbackRate - rate) > 0.001) {
        audio.playbackRate = rate;
      }
    } catch {
      /* some AAC previews reject rate */
    }
    if (on && discOn && track?.src) {
      const next = new URL(track.src, window.location.href).href;
      if (audio.src !== next) {
        audio.src = next;
        audio.currentTime = 0;
      }
      if (audio.paused) void audio.play().catch(() => setOn(false));
    } else if (!audio.paused) {
      audio.pause();
    }
  }, [discOn, on, rate, track?.src, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const syncVinyl = () => {
      const dur = audio.duration;
      const t = audio.currentTime;
      if (dur > 0 && Number.isFinite(dur)) {
        setProgress(Math.min(1, Math.max(0, t / dur)));
        setSpin(((t * (audio.playbackRate || 1)) / REV_SECS) * 360);
      }
    };
    const onEnded = () => {
      setOn(false);
      setProgress(1);
    };
    audio.addEventListener("timeupdate", syncVinyl);
    audio.addEventListener("loadedmetadata", syncVinyl);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", syncVinyl);
      audio.removeEventListener("loadedmetadata", syncVinyl);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  /* Real-time platter: sample the element every frame so grooves + arm
     track the file from 0:00 to the last sample, not a fake RPM clock. */
  useEffect(() => {
    if (!on) {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
      spinRef.current = null;
      return;
    }
    const tick = () => {
      const audio = audioRef.current;
      if (audio) {
        const dur = audio.duration;
        const t = audio.currentTime;
        if (dur > 0 && Number.isFinite(dur)) {
          setProgress(Math.min(1, Math.max(0, t / dur)));
          setSpin(((t * (audio.playbackRate || 1)) / REV_SECS) * 360);
        }
      }
      spinRef.current = requestAnimationFrame(tick);
    };
    spinRef.current = requestAnimationFrame(tick);
    return () => {
      if (spinRef.current) cancelAnimationFrame(spinRef.current);
    };
  }, [on]);

  const closeSheet = () => {
    setEntered(false);
    setOn(false);
    window.setTimeout(() => {
      setSheet(false);
      setOpen(false);
    }, 2300);
  };

  const toggleSheet = () => {
    if (open) {
      closeSheet();
      return;
    }
    setOpen(true);
    setSheet(true);
  };

  useEffect(() => {
    if (!sheet) {
      document.documentElement.classList.remove("la-musica-open");
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeSheet();
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("la-musica-open");
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [sheet]);

  useEffect(() => {
    if (!discOn && on) setOn(false);
  }, [discOn, on]);

  useEffect(() => () => clearTimers(), []);

  const loadTrack = (i: number) => {
    if (i !== platterIndex) setPlatterIndex(i);
  };

  const insertDisc = () => {
    clearTimers();
    setInserting(true);
    setDiscOn(true);
    timers.current.push(window.setTimeout(() => setInserting(false), 2000));
  };

  const removeDisc = () => {
    if (on || !discOn || removing) return;
    clearTimers();
    setRemoving(true);
    timers.current.push(
      window.setTimeout(() => {
        setDiscOn(false);
        setRemoving(false);
      }, 2000),
    );
  };

  /* First click focuses the jacket. Second click on the facing jacket loads it / plays. */
  const onCoverClick = (i: number) => {
    if (i !== focus) {
      setFocus(i);
      return;
    }
    if (i === platterIndex && discOn) {
      if (!on) {
        cueStart();
        setOn(true);
      }
      return;
    }
    loadTrack(i);
    cueStart();
    if (discOn) {
      if (!on) setOn(true);
    } else {
      insertDisc();
    }
  };

  const skip = (dir: -1 | 1) => {
    if (tracks.length === 0) return;
    const i = (focus + dir + tracks.length) % tracks.length;
    setFocus(i);
    loadTrack(i);
    cueStart();
  };

  const togglePower = () => {
    if (!discOn) return;
    clickTick();
    setOn((v) => {
      if (!v) cueStart();
      return !v;
    });
  };

  if (hide) return null;

  return (
    <>
      <button
        type="button"
        className={`la-musica-tab${open ? " is-open" : ""}`}
        aria-expanded={open}
        aria-controls="la-musica-deck"
        onClick={toggleSheet}
      >
        la musica
      </button>

      {sheet ? (
        <div
          className={`la-musica${entered ? " is-in" : ""}`}
          id="la-musica-deck"
          role="dialog"
          aria-label="la musica"
        >
          <div className="la-musica__head">
            <h2 className="la-musica__title">Top 10</h2>
            <p className="la-musica__kicker">the top 10 everchanging</p>
          </div>
          <div className="la-musica__stage">
            <div className="la-musica-deck-slot">
            <div className="la-musica-deck">
              <div className={`la-musica-deck__platter-wrap${on ? " is-live" : ""}`}>
                <span className="la-musica-mat-ring la-musica-mat-ring--a" />
                <span className="la-musica-mat-ring la-musica-mat-ring--b" />
                <span className="la-musica-mat-ring la-musica-mat-ring--c" />
                <div
                  className={`la-musica-platter${removing ? " is-removing" : ""}${
                    inserting ? " is-inserting" : ""
                  }${discOn ? "" : " is-off"}`}
                  onClick={removeDisc}
                  aria-hidden
                >
                  <div
                    className="la-musica-platter__rotor"
                    style={{ transform: `rotate(${spin}deg)` }}
                  >
                    {Array.from({ length: 15 }, (_, ring) => (
                      <span
                        key={ring}
                        className="la-musica-platter__ring"
                        style={{
                          inset: `${8 + 5.5 * ring}%`,
                          borderWidth: ring % 3 === 0 ? 1 : 0.5,
                        }}
                      />
                    ))}
                    <span
                      className="la-musica-platter__label"
                      style={{
                        backgroundImage: track?.cover
                          ? `url(${track.cover})`
                          : undefined,
                      }}
                    />
                    <span
                      className="la-musica-platter__playhead"
                      style={{
                        inset: `${7 + progress * 30}%`,
                      }}
                    />
                  </div>
                </div>
                <Tonearm down={on && discOn} progress={progress} />
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
                  disabled={!discOn}
                  onClick={togglePower}
                >
                  <span className="la-musica-power__well" />
                  <span className="la-musica-power__rocker" />
                  <span className="la-musica-power__led" />
                </button>
              </div>

              <div className="la-musica-deck__right">
                <VolumeKnob value={volume} onChange={setVolume} />
                <TempoFader value={pitch} onChange={setPitch} />
              </div>
            </div>
            </div>

            {tracks.length > 0 ? (
              <div
                className="la-musica-coverflow"
                aria-label="albums"
                onWheel={(event) => {
                  event.preventDefault();
                  const next =
                    (focus + (event.deltaY > 0 ? 1 : -1) + tracks.length) %
                    tracks.length;
                  setFocus(next);
                }}
              >
                <div className="la-musica-coverflow__scene">
                  {tracks.map((item, i) => (
                    <button
                      key={`${item.title}-${item.artist}`}
                      type="button"
                      className={`la-musica-cover${
                        i === focus ? " is-current" : ""
                      }`}
                      style={{
                        transform: coverTransform(i, focus),
                        zIndex: i === focus ? 50 : 10,
                      }}
                      onClick={() => onCoverClick(i)}
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
                        {i === focus ? (
                          <span className="la-musica-cover__note" aria-hidden>
                            {discOn ? "♪" : "+"}
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
        </div>
      ) : null}
      <audio ref={audioRef} preload="auto" />
    </>
  );
}

function Tonearm({ down, progress }: { down: boolean; progress: number }) {
  /* Rest off the record (−90). Song start = outer groove. End = inner label. */
  const p = Math.min(1, Math.max(0, progress));
  const deg = down ? -80 + p * 38 : -90;
  return (
    <div className="la-musica-arm" aria-hidden>
      <div
        className={`la-musica-arm__swing${down ? " is-down" : ""}`}
        style={{
          transform: `rotate(${deg}deg)`,
          transition: down ? "none" : "transform 1000ms ease-in-out",
        }}
      >
        <span className="la-musica-arm__counter" />
        <span className={`la-musica-arm__bar${down ? " is-down" : ""}`}>
          <span className={`la-musica-arm__head${down ? " is-down" : ""}`} />
          <span className={`la-musica-arm__needle${down ? " is-down" : ""}`} />
        </span>
        <span className="la-musica-arm__pivot" />
      </div>
    </div>
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
  const min = -30;
  const max = 30;

  const fromPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const t = 1 - (event.clientY - rect.top) / rect.height;
    const next = min + Math.min(1, Math.max(0, t)) * (max - min);
    onChange(Number(next.toFixed(1)));
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
