import type { BlogPost } from "./consume-types";
import { listConsume } from "./consume-log";

/**
 * Interactive essays — each post is a thesis others can push on.
 * Opinions live in data/discussions/ via the API (not in this file).
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "consume-to-claim",
    title: "Consume to claim — not to scroll",
    date: "2026-07-28",
    lede:
      "If you cannot write one honest sentence about what you just took in, you did not consume it. You were used by it.",
    thesis:
      "Public tracking of consumption + opinion is the only way to stay mindful and invite real disagreement.",
    stance: "building-on",
    body: [
      "Most feeds train you to forget. You finish a paper, a film, a product page — and the only residue is a vague mood. That is not learning. That is anesthesia with better branding.",
      "I am building this archive so that everything I take in leaves a mark: what it was, what I think, and why it cost me time. If I cannot defend the take, I should not have spent the hour.",
      "The second half is harder: other people get to answer. Not with likes — with stances. Agree, disagree, curious, rethinking. A blog that cannot be argued with is a brochure.",
      "This is not a wellness diary. It is an open lab notebook for attention. If you read something I logged and think I am wrong, say so under the post. That is the point.",
    ],
    consumeIds: ["c-2026-07-28-neuroplasticity"],
    tags: ["attention", "writing", "culture"],
  },
  {
    slug: "status-vs-signal",
    title: "Status is not signal",
    date: "2026-08-01",
    lede:
      "Platforms reward the appearance of progress. Engineering rewards the work that still exists when the tab is closed.",
    thesis:
      "If your public narrative is louder than your artifacts, you are optimizing for the wrong physics.",
    stance: "disagree",
    body: [
      "I do not hate storytelling. I hate story without payload. A launch post with no repo, no demo, no data is cosplay.",
      "The fix is boring and public: show the input log, show the builds, show the takes. Let strangers pressure-test the claim.",
      "If you are here to network, leave. If you are here to think in public with me, pick a stance on the thesis and write it clean.",
    ],
    consumeIds: ["c-2026-08-01-yc-linkedin"],
    tags: ["startups", "building", "attention"],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function listBlogPosts(): BlogPost[] {
  return [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
}

export function consumeForPost(post: BlogPost) {
  return (post.consumeIds || [])
    .map((id) => listConsume().find((c) => c.id === id))
    .filter(Boolean);
}

export function threadIdForBlog(slug: string): string {
  return `blog:${slug}`;
}

export function threadIdForConsume(id: string): string {
  return `consume:${id}`;
}
