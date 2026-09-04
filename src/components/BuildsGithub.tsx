import { getGithubContributions } from "@/lib/github-contributions";
import { BuildsGithubCalendar } from "./BuildsGithubCalendar";

export async function BuildsGithub() {
  const calendar = await getGithubContributions();
  return <BuildsGithubCalendar initial={calendar} />;
}
