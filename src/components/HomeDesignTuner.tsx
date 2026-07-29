"use client";

import { useEffect, useState } from "react";

/* Bump when defaults change so old local compositions don't stick forever */
const STORAGE_KEY = "celine-home-design-v2";

type TitleFont = "oswald" | "archivo" | "syne" | "serif" | "mono";

interface DesignSettings {
  pageScale: number;
  titleSize: number;
  titleTracking: number;
  titleFont: TitleFont;
  taglineSize: number;
  signatureSize: number;
  locSize: number;
  brandGap: number;
  headerPad: number;
  sidePad: number;
  socialSize: number;
  socialGap: number;
  navSize: number;
  heroX: number;
  heroY: number;
}

const DEFAULTS: DesignSettings = {
  pageScale: 100,
  /* Fill the frame — less dead space left/right of CELINE NOVA */
  titleSize: 14.5,
  titleTracking: -0.045,
  titleFont: "oswald",
  taglineSize: 3.6,
  signatureSize: 2.75,
  locSize: 0.95,
  brandGap: 1.1,
  headerPad: 1.35,
  sidePad: 2.5,
  socialSize: 1.35,
  socialGap: 0.95,
  navSize: 0.58,
  heroX: 0,
  heroY: 0,
};

const FONT_VALUES: Record<TitleFont, string> = {
  oswald: "var(--font-oswald), sans-serif",
  archivo: "var(--font-archivo-narrow), sans-serif",
  syne: "var(--font-syne), sans-serif",
  serif: "var(--font-instrument-serif), Georgia, serif",
  mono: "var(--font-jetbrains-mono), monospace",
};

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="home-tuner__control">
      <span>
        {label}
        <output>
          {value}
          {unit}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

/** Local, persistent live controls for composing the home landing frame.
 *  Temporary “Figma keys” panel — remove HomeDesignTuner from HomeHub when done. */
export function HomeDesignTuner() {
  // Open by default so you can drag spacing/size like Figma without hunting for it
  const [open, setOpen] = useState(true);
  const [settings, setSettings] = useState<DesignSettings>(DEFAULTS);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings({ ...DEFAULTS, ...JSON.parse(saved) });
      }
    } catch {
      // A blocked localStorage should never prevent the homepage from rendering.
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${settings.pageScale}%`;
    root.style.setProperty("--tune-title-size", `${settings.titleSize}vw`);
    root.style.setProperty("--tune-title-tracking", `${settings.titleTracking}em`);
    root.style.setProperty("--tune-title-font", FONT_VALUES[settings.titleFont]);
    root.style.setProperty("--tune-tagline-size", `${settings.taglineSize}vw`);
    root.style.setProperty("--tune-signature-size", `${settings.signatureSize}rem`);
    root.style.setProperty("--tune-loc-size", `${settings.locSize}rem`);
    root.style.setProperty("--tune-brand-gap", `${settings.brandGap}rem`);
    root.style.setProperty("--tune-header-pad", `${settings.headerPad}rem`);
    root.style.setProperty("--tune-side-pad", `${settings.sidePad}vw`);
    root.style.setProperty("--tune-social-size", `${settings.socialSize}rem`);
    root.style.setProperty("--tune-social-gap", `${settings.socialGap}rem`);
    root.style.setProperty("--tune-nav-size", `${settings.navSize}rem`);
    root.style.setProperty("--tune-hero-x", `${settings.heroX}vw`);
    root.style.setProperty("--tune-hero-y", `${settings.heroY}vh`);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Keep the controls live even when persistence is unavailable.
    }
  }, [settings]);

  useEffect(
    () => () => {
      const root = document.documentElement;
      [
        "--tune-title-size",
        "--tune-title-tracking",
        "--tune-title-font",
        "--tune-tagline-size",
        "--tune-signature-size",
        "--tune-loc-size",
        "--tune-brand-gap",
        "--tune-header-pad",
        "--tune-side-pad",
        "--tune-social-size",
        "--tune-social-gap",
        "--tune-nav-size",
        "--tune-hero-x",
        "--tune-hero-y",
      ].forEach((property) => root.style.removeProperty(property));
      root.style.removeProperty("font-size");
    },
    [],
  );

  const update = <Key extends keyof DesignSettings>(
    key: Key,
    value: DesignSettings[Key],
  ) => setSettings((current) => ({ ...current, [key]: value }));

  const reset = () => {
    setSettings(DEFAULTS);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <aside className={`home-tuner${open ? " home-tuner--open" : ""}`}>
      <button
        type="button"
        className="home-tuner__toggle"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="home-design-controls"
      >
        {open ? "Hide controls" : "Design · Tune"}
      </button>

      {open ? (
        <div id="home-design-controls" className="home-tuner__panel">
          <header>
            <div>
              <span>Temporary design keys</span>
              <strong>Drag like Figma. We bake values into CSS later.</strong>
            </div>
            <button type="button" onClick={reset}>
              Reset
            </button>
          </header>

          <label className="home-tuner__select">
            <span>Name typeface</span>
            <select
              value={settings.titleFont}
              onChange={(event) =>
                update("titleFont", event.target.value as TitleFont)
              }
            >
              <option value="oswald">Oswald</option>
              <option value="archivo">Archivo Narrow</option>
              <option value="syne">Syne</option>
              <option value="serif">Instrument Serif</option>
              <option value="mono">JetBrains Mono</option>
            </select>
          </label>

          <RangeControl
            label="Name size"
            value={settings.titleSize}
            min={5}
            max={18}
            step={0.1}
            unit="vw"
            onChange={(value) => update("titleSize", value)}
          />
          <RangeControl
            label="Name spacing"
            value={settings.titleTracking}
            min={-0.12}
            max={0.18}
            step={0.002}
            unit="em"
            onChange={(value) => update("titleTracking", value)}
          />
          <RangeControl
            label="Tagline size"
            value={settings.taglineSize}
            min={1}
            max={7}
            step={0.05}
            unit="vw"
            onChange={(value) => update("taglineSize", value)}
          />
          <RangeControl
            label="Signature size (Celine Nova)"
            value={settings.signatureSize}
            min={1.4}
            max={5}
            step={0.05}
            unit="rem"
            onChange={(value) => update("signatureSize", value)}
          />
          <RangeControl
            label="Cities size (LA / SF / NYC)"
            value={settings.locSize}
            min={0.5}
            max={1.6}
            step={0.02}
            unit="rem"
            onChange={(value) => update("locSize", value)}
          />
          <RangeControl
            label="Gap · signature ↔ cities"
            value={settings.brandGap}
            min={0.2}
            max={3}
            step={0.05}
            unit="rem"
            onChange={(value) => update("brandGap", value)}
          />
          <RangeControl
            label="Header top padding"
            value={settings.headerPad}
            min={0.4}
            max={3}
            step={0.05}
            unit="rem"
            onChange={(value) => update("headerPad", value)}
          />
          <RangeControl
            label="Page side padding"
            value={settings.sidePad}
            min={0.5}
            max={8}
            step={0.1}
            unit="vw"
            onChange={(value) => update("sidePad", value)}
          />
          <RangeControl
            label="Social icon size"
            value={settings.socialSize}
            min={0.85}
            max={2.4}
            step={0.05}
            unit="rem"
            onChange={(value) => update("socialSize", value)}
          />
          <RangeControl
            label="Gap between social icons"
            value={settings.socialGap}
            min={0.35}
            max={2}
            step={0.05}
            unit="rem"
            onChange={(value) => update("socialGap", value)}
          />
          <RangeControl
            label="Bottom nav size"
            value={settings.navSize}
            min={0.4}
            max={1.25}
            step={0.01}
            unit="rem"
            onChange={(value) => update("navSize", value)}
          />
          <RangeControl
            label="Whole-page type"
            value={settings.pageScale}
            min={75}
            max={140}
            step={1}
            unit="%"
            onChange={(value) => update("pageScale", value)}
          />
          <RangeControl
            label="Move hero left / right"
            value={settings.heroX}
            min={-25}
            max={25}
            step={0.5}
            unit="vw"
            onChange={(value) => update("heroX", value)}
          />
          <RangeControl
            label="Move hero up / down"
            value={settings.heroY}
            min={-30}
            max={30}
            step={0.5}
            unit="vh"
            onChange={(value) => update("heroY", value)}
          />

          <p>
            Drag any slider — the page updates live. Saved only in this browser.
            When it looks right, tell me and I’ll lock the values into CSS and
            remove this panel.
          </p>
        </div>
      ) : null}
    </aside>
  );
}
