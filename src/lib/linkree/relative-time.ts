const DIVS: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
  { unit: "year", ms: 365.25 * 24 * 60 * 60 * 1000 },
  { unit: "month", ms: 30.4375 * 24 * 60 * 60 * 1000 },
  { unit: "week", ms: 7 * 24 * 60 * 60 * 1000 },
  { unit: "day", ms: 24 * 60 * 60 * 1000 },
  { unit: "hour", ms: 60 * 60 * 1000 },
  { unit: "minute", ms: 60 * 1000 },
  { unit: "second", ms: 1000 },
];

export function relativeTime(iso: string, now = Date.now()): string {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const delta = then - now;
  const abs = Math.abs(delta);
  const rtf = new Intl.RelativeTimeFormat("en", {
    numeric: "always",
    style: "narrow",
  });
  for (const { unit, ms } of DIVS) {
    if (abs >= ms || unit === "second") {
      return rtf.format(Math.round(delta / ms), unit);
    }
  }
  return "";
}
