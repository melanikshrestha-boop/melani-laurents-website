import { NextResponse } from "next/server";
import { parsePrintOrder } from "@/lib/print-order";
import { isMailConfigured, sendPrintOrderNotice } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parsePrintOrder(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.spam) {
    return NextResponse.json({ ok: true });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "Print requests could not be sent right now." },
      { status: 503 },
    );
  }

  try {
    await sendPrintOrderNotice(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Your request could not be sent. Please try again." },
      { status: 500 },
    );
  }
}
