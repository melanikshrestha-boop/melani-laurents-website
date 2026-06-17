import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const RESEARCH_DIR = path.join(process.cwd(), "content/research");

export interface ResearchPost {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  status: "draft" | "published";
  externalUrl?: string;
  content: string;
  readingTime: string;
}

function parsePost(slug: string, raw: string): ResearchPost {
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: data.summary as string,
    tags: (data.tags as string[]) ?? [],
    status: (data.status as "draft" | "published") ?? "published",
    externalUrl: data.externalUrl as string | undefined,
    content,
    readingTime: stats.text,
  };
}

export function getResearchSlugs(): string[] {
  if (!fs.existsSync(RESEARCH_DIR)) return [];
  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getResearchPosts(includeDrafts = false): ResearchPost[] {
  const slugs = getResearchSlugs();
  const posts = slugs
    .map((slug) => {
      const raw = fs.readFileSync(
        path.join(RESEARCH_DIR, `${slug}.mdx`),
        "utf-8",
      );
      return parsePost(slug, raw);
    })
    .filter((p) => includeDrafts || p.status === "published");

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getResearchPost(slug: string): ResearchPost | null {
  const filePath = path.join(RESEARCH_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  return parsePost(slug, raw);
}

export function getAllTags(posts: ResearchPost[]): string[] {
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}
