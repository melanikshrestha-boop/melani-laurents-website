/** Live contribution calendar for Builds. Login matches siteConfig GitHub. */
export const GITHUB_LOGIN = "melanikshrestha-boop";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_LOGIN}`;

const CONTRIBUTIONS_URL = `https://github-contributions-api.jogruber.de/v4/${GITHUB_LOGIN}?y=last`;

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  total: number;
  weeks: ContributionDay[][];
};

type ApiDay = { date: string; count: number; level: number };

function toLevel(value: number): ContributionDay["level"] {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as 1 | 2 | 3;
}

/** Pack a year of days into GitHub-style weeks (Sun → Sat columns). */
function weeksFromDays(days: ContributionDay[]): ContributionDay[][] {
  if (days.length === 0) return [];
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  const firstWeekday = new Date(`${days[0].date}T12:00:00Z`).getUTCDay();
  for (let i = 0; i < firstWeekday; i += 1) {
    week.push({ date: "", count: 0, level: 0 });
  }
  for (const day of days) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) {
      week.push({ date: "", count: 0, level: 0 });
    }
    weeks.push(week);
  }
  return weeks;
}

export async function getGithubContributions(): Promise<ContributionCalendar | null> {
  try {
    const response = await fetch(CONTRIBUTIONS_URL, {
      next: { revalidate: 600 },
      headers: { accept: "application/json" },
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as {
      total?: { lastYear?: number };
      contributions?: ApiDay[];
    };
    const raw = Array.isArray(payload.contributions) ? payload.contributions : [];
    const days: ContributionDay[] = raw.map((day) => ({
      date: day.date,
      count: Number(day.count) || 0,
      level: toLevel(Number(day.level) || 0),
    }));
    if (days.length === 0) return null;
    return {
      total: Number(payload.total?.lastYear) || days.reduce((n, d) => n + d.count, 0),
      weeks: weeksFromDays(days),
    };
  } catch {
    return null;
  }
}
