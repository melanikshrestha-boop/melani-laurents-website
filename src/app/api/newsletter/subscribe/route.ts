import { NextResponse } from "next/server";
import {
  isNewsletterTopic,
  isValidEmail,
  subscribeToNewsletter,
  type NewsletterTopic,
} from "@/lib/newsletter";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, topics } = body as { email?: unknown; topics?: unknown };

  if (typeof email !== "string" || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    return NextResponse.json(
      { error: "Select at least one topic." },
      { status: 400 },
    );
  }

  const validTopics: NewsletterTopic[] = [];
  for (const topic of topics) {
    if (typeof topic !== "string" || !isNewsletterTopic(topic)) {
      return NextResponse.json({ error: "Invalid topic selection." }, { status: 400 });
    }
    validTopics.push(topic);
  }

  try {
    const result = await subscribeToNewsletter(email, validTopics);
    return NextResponse.json({
      ok: true,
      updated: result.updated,
      topics: result.subscriber.topics,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not save subscription. Try again later." },
      { status: 500 },
    );
  }
}
