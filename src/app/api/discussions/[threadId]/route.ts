import { NextResponse } from "next/server";
import {
  addOpinion,
  isStance,
  listOpinions,
  validateOpinionInput,
} from "@/lib/discussions";

type Ctx = { params: Promise<{ threadId: string }> };

function decodeThreadId(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export async function GET(_req: Request, ctx: Ctx) {
  const { threadId: raw } = await ctx.params;
  const threadId = decodeThreadId(raw);
  if (!threadId || threadId.length > 120) {
    return NextResponse.json({ error: "Invalid thread." }, { status: 400 });
  }
  const opinions = await listOpinions(threadId);
  return NextResponse.json({ threadId, opinions });
}

export async function POST(req: Request, ctx: Ctx) {
  const { threadId: raw } = await ctx.params;
  const threadId = decodeThreadId(raw);
  if (!threadId || threadId.length > 120) {
    return NextResponse.json({ error: "Invalid thread." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const { name, stance, body: text, link } = body as {
    name?: unknown;
    stance?: unknown;
    body?: unknown;
    link?: unknown;
  };

  if (typeof name !== "string" || typeof text !== "string" || !isStance(stance)) {
    return NextResponse.json(
      { error: "name, stance, and body are required." },
      { status: 400 },
    );
  }

  const input = {
    threadId,
    name,
    stance,
    body: text,
    link: typeof link === "string" ? link : undefined,
  };
  const err = validateOpinionInput(input);
  if (err) return NextResponse.json({ error: err }, { status: 400 });

  try {
    const opinion = await addOpinion(input);
    return NextResponse.json({ ok: true, opinion }, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Could not save opinion.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
