#!/usr/bin/env node
/**
 * Writes src/data/github-calendar.json from authored commits on owned repos
 * (including private). Used by GitHub Actions so production stays current
 * without putting a token on Vercel.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";

const LOGIN = "melanikshrestha-boop";
const TOKEN =
  process.env.GH_CONTRIBUTIONS_TOKEN?.trim() ||
  process.env.GITHUB_TOKEN?.trim() ||
  "";
if (!TOKEN) {
  console.error("missing GH_CONTRIBUTIONS_TOKEN");
  process.exit(1);
}

const headers = {
  accept: "application/json",
  authorization: `Bearer ${TOKEN}`,
  "user-agent": "celine-nova-builds",
};

async function githubJson(url, init) {
  const response = await fetch(url, { ...init, headers: { ...headers, ...init?.headers } });
  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }
  return response.json();
}

function ymdUTC(date) {
  return date.toISOString().slice(0, 10);
}

function lastYearDates() {
  const end = new Date();
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - 365);
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());
  const dates = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    dates.push(ymdUTC(cursor));
  }
  return dates;
}

function weeksFromDays(days) {
  const ordered = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const weeks = [];
  let week = [];
  const firstWeekday = new Date(`${ordered[0].date}T12:00:00Z`).getUTCDay();
  for (let i = 0; i < firstWeekday; i += 1) week.push({ date: "", count: 0, level: 0 });
  for (const day of ordered) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push({ date: "", count: 0, level: 0 });
    weeks.push(week);
  }
  return weeks;
}

const me = await githubJson("https://api.github.com/user");
if (me.login !== LOGIN) {
  console.error("token is not", LOGIN);
  process.exit(1);
}
const repos = await githubJson(
  "https://api.github.com/user/repos?per_page=100&affiliation=owner&sort=updated",
);
const dates = lastYearDates();
const since = `${dates[0]}T00:00:00Z`;
const counts = {};
const query = `
  query ($owner: String!, $name: String!, $since: GitTimestamp!, $authorId: ID!, $after: String) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, since: $since, author: { id: $authorId }, after: $after) {
              pageInfo { hasNextPage endCursor }
              nodes { committedDate }
            }
          }
        }
      }
    }
  }
`;

for (const repo of repos) {
  if (!repo.name || repo.fork) continue;
  let after = null;
  for (let page = 0; page < 20; page += 1) {
    const payload = await githubJson("https://api.github.com/graphql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query,
        variables: {
          owner: LOGIN,
          name: repo.name,
          since,
          authorId: me.node_id,
          after,
        },
      }),
    });
    const history = payload?.data?.repository?.defaultBranchRef?.target?.history;
    if (!history) break;
    for (const node of history.nodes ?? []) {
      const date = node?.committedDate?.slice(0, 10);
      if (!date) continue;
      counts[date] = (counts[date] ?? 0) + 1;
    }
    if (!history.pageInfo?.hasNextPage || !history.pageInfo.endCursor) break;
    after = history.pageInfo.endCursor;
  }
}

const nonzero = dates.map((d) => counts[d] ?? 0).filter((n) => n > 0).sort((a, b) => a - b);
const at = (p) =>
  nonzero.length === 0
    ? 1
    : nonzero[Math.min(nonzero.length - 1, Math.floor(p * (nonzero.length - 1)))];
const q1 = Math.max(1, at(0.25));
const q2 = Math.max(q1, at(0.5));
const q3 = Math.max(q2, at(0.75));
const level = (count) => {
  if (count <= 0) return 0;
  if (count <= q1) return 1;
  if (count <= q2) return 2;
  if (count <= q3) return 3;
  return 4;
};
const days = dates.map((date) => ({
  date,
  count: counts[date] ?? 0,
  level: level(counts[date] ?? 0),
}));
const calendar = {
  total: days.reduce((n, day) => n + day.count, 0),
  weeks: weeksFromDays(days),
  fetchedAt: new Date().toISOString(),
};

const out = path.join(process.cwd(), "src/data/github-calendar.json");
await writeFile(out, JSON.stringify(calendar));
console.log("wrote", out, "total", calendar.total, "weeks", calendar.weeks.length);
