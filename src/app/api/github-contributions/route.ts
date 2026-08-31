import { NextResponse } from "next/server";
import { getGithubContributionsLive } from "@/lib/github-contributions";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const maxDuration = 60;

export async function GET() {
  const calendar = await getGithubContributionsLive();
  if (!calendar) {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
  return NextResponse.json(calendar, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
