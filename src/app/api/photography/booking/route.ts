import { NextResponse } from "next/server";
import {
  parsePortraitBooking,
  portraitBookingMailto,
} from "@/lib/booking";
import { isMailConfigured, sendPortraitBookingNotice } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parsePortraitBooking(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (parsed.spam) {
    return NextResponse.json({ ok: true });
  }

  if (!isMailConfigured()) {
    // Mail isn't wired on this host — still complete the booking via the user's mail app.
    return NextResponse.json({
      ok: true,
      mailto: portraitBookingMailto(parsed.data),
    });
  }

  try {
    await sendPortraitBookingNotice(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({
      ok: true,
      mailto: portraitBookingMailto(parsed.data),
    });
  }
}
