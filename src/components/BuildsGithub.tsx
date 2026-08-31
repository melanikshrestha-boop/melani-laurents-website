import { connection } from "next/server";
import { getGithubContributions } from "@/lib/github-contributions";
import { BuildsGithubCalendar } from "./BuildsGithubCalendar";

export async function BuildsGithub() {
  await connection();
  const calendar = await getGithubContributions();
  return <BuildsGithubCalendar initial={calendar} />;
}
