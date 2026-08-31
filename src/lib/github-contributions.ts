/** Live contribution calendar for Builds. Login matches siteConfig GitHub. */
export const GITHUB_LOGIN = "melanikshrestha-boop";
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_LOGIN}`;

/** Refresh every minute. GitHub’s own graph can still lag a bit behind pushes. */
const REVALIDATE_SECONDS = 60;

const GRAPHQL_URL = "https://api.github.com/graphql";
const CONTRIBUTIONS_HTML_URL = `https://github.com/users/${GITHUB_LOGIN}/contributions`;

const CALENDAR_QUERY = /* GraphQL */ `
  query ($login: String!, $from: DateTime!, $to: DateTime!) {
    viewer {
      login
    }
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const VIEWER_CALENDAR_QUERY = /* GraphQL */ `
  query ($from: DateTime!, $to: DateTime!) {
    viewer {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

function lastYearWindow(): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to.getTime() - 365 * 24 * 60 * 60 * 1000);
  return { from: from.toISOString(), to: to.toISOString() };
}

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ContributionCalendar = {
  total: number;
  weeks: ContributionDay[][];
};

type GraphqlLevel =
  | "NONE"
  | "FIRST_QUARTILE"
  | "SECOND_QUARTILE"
  | "THIRD_QUARTILE"
  | "FOURTH_QUARTILE";

type GraphqlDay = {
  date: string;
  contributionCount: number;
  contributionLevel: GraphqlLevel | string;
};

type GraphqlWeek = { contributionDays: GraphqlDay[] };

type GraphqlCalendar = {
  totalContributions: number;
  weeks: GraphqlWeek[];
};

const LEVEL_FROM_GITHUB: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function githubToken(): string {
  return (
    process.env.GH_CONTRIBUTIONS_TOKEN?.trim() ||
    process.env.GITHUB_TOKEN?.trim() ||
    ""
  );
}

function toLevel(value: number): ContributionDay["level"] {
  if (value <= 0) return 0;
  if (value >= 4) return 4;
  return value as 1 | 2 | 3;
}

function mapGraphqlDay(day: GraphqlDay): ContributionDay {
  const named = LEVEL_FROM_GITHUB[day.contributionLevel];
  return {
    date: day.date,
    count: Number(day.contributionCount) || 0,
    level: named ?? toLevel(Number(day.contributionCount) || 0),
  };
}

/** GitHub’s HTML table is row-major (all Sundays, then Mondays…). Always sort. */
export function chronologicalDays(days: ContributionDay[]): ContributionDay[] {
  const byDate = new Map<string, ContributionDay>();
  for (const day of days) {
    if (!day.date) continue;
    byDate.set(day.date, day);
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/** Pack a year of days into GitHub-style weeks (Sun → Sat columns). */
export function weeksFromDays(days: ContributionDay[]): ContributionDay[][] {
  const ordered = chronologicalDays(days);
  if (ordered.length === 0) return [];
  const weeks: ContributionDay[][] = [];
  let week: ContributionDay[] = [];
  const firstWeekday = new Date(`${ordered[0].date}T12:00:00Z`).getUTCDay();
  for (let i = 0; i < firstWeekday; i += 1) {
    week.push({ date: "", count: 0, level: 0 });
  }
  for (const day of ordered) {
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

function calendarFromGraphql(calendar: GraphqlCalendar): ContributionCalendar | null {
  const days = calendar.weeks.flatMap((week) =>
    (week.contributionDays ?? []).map(mapGraphqlDay),
  );
  if (days.length === 0) return null;
  return {
    total: Number(calendar.totalContributions) || days.reduce((n, d) => n + d.count, 0),
    weeks: weeksFromDays(days),
  };
}

async function fetchGraphqlCalendar(): Promise<ContributionCalendar | null> {
  const token = githubToken();
  if (!token) return null;

  const headers = {
    accept: "application/json",
    authorization: `Bearer ${token}`,
    "content-type": "application/json",
    "user-agent": "celine-nova-builds",
  };

  const window = lastYearWindow();
  const viewerResponse = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: VIEWER_CALENDAR_QUERY,
      variables: window,
    }),
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github-contributions"] },
  });
  if (viewerResponse.ok) {
    const payload = (await viewerResponse.json()) as {
      data?: {
        viewer?: {
          login?: string;
          contributionsCollection?: { contributionCalendar?: GraphqlCalendar };
        };
      };
    };
    const login = payload.data?.viewer?.login;
    const calendar = payload.data?.viewer?.contributionsCollection?.contributionCalendar;
    if (login === GITHUB_LOGIN && calendar) {
      return calendarFromGraphql(calendar);
    }
  }

  const userResponse = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: CALENDAR_QUERY,
      variables: { login: GITHUB_LOGIN, ...window },
    }),
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github-contributions"] },
  });
  if (!userResponse.ok) return null;
  const payload = (await userResponse.json()) as {
    data?: {
      user?: {
        contributionsCollection?: { contributionCalendar?: GraphqlCalendar };
      };
    };
  };
  const calendar = payload.data?.user?.contributionsCollection?.contributionCalendar;
  return calendar ? calendarFromGraphql(calendar) : null;
}

function parseContributionsHtml(html: string): ContributionCalendar | null {
  const flat = html.replace(/\s+/g, " ");
  const heading = flat.match(
    /([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i,
  );
  const dayTags = [
    ...html.matchAll(/<td\b([^>]*\bdata-date="\d{4}-\d{2}-\d{2}"[^>]*)>/gi),
  ];
  if (dayTags.length === 0) return null;

  const days: ContributionDay[] = [];
  for (const match of dayTags) {
    const attrs = match[1] ?? "";
    const date = attrs.match(/data-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    if (!date) continue;
    const level = toLevel(Number(attrs.match(/data-level="(\d)"/)?.[1] ?? 0));
    const after = html.slice(match.index ?? 0, (match.index ?? 0) + 900);
    const tip = after.match(
      /<tool-tip\b[^>]*>\s*(\d+)\s+contribution/i,
    );
    days.push({
      date,
      count: tip ? Number(tip[1]) : 0,
      level,
    });
  }
  if (days.length === 0) return null;
  const summed = days.reduce((n, d) => n + d.count, 0);
  const total = heading
    ? Number(heading[1].replace(/,/g, "")) || summed
    : summed;
  return { total, weeks: weeksFromDays(days) };
}

async function fetchHtmlCalendar(): Promise<ContributionCalendar | null> {
  const response = await fetch(CONTRIBUTIONS_HTML_URL, {
    next: { revalidate: REVALIDATE_SECONDS, tags: ["github-contributions"] },
    headers: {
      accept: "text/html",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  });
  if (!response.ok) return null;
  return parseContributionsHtml(await response.text());
}

export async function getGithubContributions(): Promise<ContributionCalendar | null> {
  try {
    const fromGithub = await fetchGraphqlCalendar();
    if (fromGithub) return fromGithub;
    return await fetchHtmlCalendar();
  } catch {
    try {
      return await fetchHtmlCalendar();
    } catch {
      return null;
    }
  }
}
