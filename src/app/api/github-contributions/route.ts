import { NextResponse } from "next/server";
import { getGithubContributions } from "@/lib/github-contributions";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const calendar = await getGithubContributions();
  if (!calendar) {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }
  return NextResponse.json(calendar, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
