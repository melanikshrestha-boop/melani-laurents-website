import { NextResponse } from "next/server";
import { parseBookingInquiry } from "@/lib/booking";
import { isMailConfigured, sendBookingInquiry } from "@/lib/mail";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = parseBookingInquiry(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  if (!isMailConfigured()) {
    return NextResponse.json(
      {
        error:
          "Booking email is not configured yet. Please email itsmelanilaurent@gmail.com directly.",
      },
      { status: 503 },
    );
  }

  try {
    await sendBookingInquiry(parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not send your inquiry. Please try again later." },
      { status: 500 },
    );
  }
}
