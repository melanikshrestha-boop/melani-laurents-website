import { NextResponse } from "next/server";
import { parseContactMessage } from "@/lib/contact";
import { isMailConfigured, sendContactMessage } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseContactMessage(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.spam) {
    return NextResponse.json({ ok: true });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      { error: "The contact form is not connected yet.", code: "MAIL_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  try {
    await sendContactMessage(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Your message could not be sent. Please try again." },
      { status: 500 },
    );
  }
}
