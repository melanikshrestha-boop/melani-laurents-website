"use client";

import { useEffect, useState } from "react";
import {
  GITHUB_PROFILE_URL,
  githubDayTitle,
  type ContributionCalendar,
  type ContributionDay,
} from "@/lib/github-contributions";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;

/** GitHub labels a week by Wednesday so the first dangling Sunday is still Sep. */
function monthLabels(weeks: ContributionDay[][]): { index: number; label: string }[] {
  const labels: { index: number; label: string }[] = [];
  let last = -1;
  weeks.forEach((week, index) => {
    const mid = week[3]?.date ? week[3] : week.find((day) => day.date);
    if (!mid?.date) return;
    const month = new Date(`${mid.date}T12:00:00Z`).getUTCMonth();
    const previous = labels[labels.length - 1];
    if (month !== last && (!previous || index - previous.index >= 2)) {
      labels.push({ index, label: MONTHS[month] });
      last = month;
    }
  });
  return labels;
}

export function BuildsGithubCalendar({
  initial,
}: {
  initial: ContributionCalendar | null;
}) {
  const [calendar, setCalendar] = useState(initial);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch("/api/github-contributions", {
          cache: "no-store",
        });
        if (!response.ok || cancelled) return;
        const next = (await response.json()) as ContributionCalendar;
        if (!cancelled && next?.weeks?.length) setCalendar(next);
      } catch {
        /* keep the server snapshot */
      }
    };
    void load();
    const id = window.setInterval(load, 120_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (!calendar) return null;

  const labels = monthLabels(calendar.weeks);

  return (
    <section className="builds-github" aria-labelledby="builds-github-title">
      <header className="builds-github__head">
        <h2 id="builds-github-title" className="builds-github__title">
          GitHub
        </h2>
        <a
          href={GITHUB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="builds-surface__scholar"
        >
          melanikshrestha-boop ↗
        </a>
      </header>
      <p className="builds-github__count">
        {calendar.total.toLocaleString("en-US")} contributions in the last year
      </p>
      <div className="builds-github__scroll">
        <div
          className="builds-github__calendar"
          style={{ ["--gh-weeks" as string]: String(calendar.weeks.length) }}
        >
          <div className="builds-github__months" aria-hidden>
            {labels.map((label) => (
              <span
                key={`${label.label}-${label.index}`}
                style={{ gridColumn: label.index + 1 }}
              >
                {label.label}
              </span>
            ))}
          </div>
          <div className="builds-github__wdays" aria-hidden>
            {WEEKDAYS.map((label, index) => (
              <span key={`d${index}`}>{label}</span>
            ))}
          </div>
          <div
            className="builds-github__grid"
            role="img"
            aria-label="Contribution calendar"
          >
            {calendar.weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="builds-github__week">
                {week.map((day, dayIndex) => (
                  <span
                    key={`${weekIndex}-${dayIndex}`}
                    className={`builds-github__day builds-github__day--${day.level}${day.date ? "" : " is-pad"}`}
                    title={githubDayTitle(day)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="builds-github__legend" aria-hidden>
        Less
        <span className="builds-github__day builds-github__day--0" />
        <span className="builds-github__day builds-github__day--1" />
        <span className="builds-github__day builds-github__day--2" />
        <span className="builds-github__day builds-github__day--3" />
        <span className="builds-github__day builds-github__day--4" />
        More
      </p>
    </section>
  );
}
