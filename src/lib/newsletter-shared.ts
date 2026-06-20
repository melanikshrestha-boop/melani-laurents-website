export const NEWSLETTER_TOPICS = ["daily", "research", "art"] as const;
export type NewsletterTopic = (typeof NEWSLETTER_TOPICS)[number];

export interface NewsletterSubscriber {
  email: string;
  topics: NewsletterTopic[];
  subscribedAt: string;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isNewsletterTopic(value: string): value is NewsletterTopic {
  return (NEWSLETTER_TOPICS as readonly string[]).includes(value);
}
