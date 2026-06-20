import { promises as fs } from "fs";
import path from "path";
import type { NewsletterSubscriber, NewsletterTopic } from "./newsletter-shared";

const DATA_DIR = path.join(process.cwd(), "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "newsletter-subscribers.json");

async function ensureDataFile(): Promise<NewsletterSubscriber[]> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(SUBSCRIBERS_FILE, "utf-8");
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as NewsletterSubscriber[];
  } catch {
    return [];
  }
}

async function writeSubscribers(subscribers: NewsletterSubscriber[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2) + "\n", "utf-8");
}

export async function subscribeToNewsletter(
  email: string,
  topics: NewsletterTopic[],
): Promise<{ updated: boolean; subscriber: NewsletterSubscriber }> {
  const normalizedEmail = email.trim().toLowerCase();
  const uniqueTopics = [...new Set(topics)];
  const subscribers = await ensureDataFile();
  const existingIndex = subscribers.findIndex((s) => s.email === normalizedEmail);
  const now = new Date().toISOString();

  if (existingIndex >= 0) {
    const updated: NewsletterSubscriber = {
      ...subscribers[existingIndex],
      topics: uniqueTopics,
      subscribedAt: now,
    };
    subscribers[existingIndex] = updated;
    await writeSubscribers(subscribers);
    return { updated: true, subscriber: updated };
  }

  const subscriber: NewsletterSubscriber = {
    email: normalizedEmail,
    topics: uniqueTopics,
    subscribedAt: now,
  };
  subscribers.push(subscriber);
  await writeSubscribers(subscribers);
  return { updated: false, subscriber };
}
