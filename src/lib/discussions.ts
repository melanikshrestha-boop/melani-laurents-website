/**
 * Public opinion threads — file-backed so local + self-hosted Node works.
 * Each thread is data/discussions/{safeId}.json
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { PublicOpinion, Stance } from "@/data/consume-types";

const ROOT = path.join(process.cwd(), "data", "discussions");

const STANCES: Stance[] = [
  "building-on",
  "agree",
  "disagree",
  "curious",
  "rethinking",
  "skip",
];

export function isStance(v: unknown): v is Stance {
  return typeof v === "string" && (STANCES as string[]).includes(v);
}

function safeThreadFile(threadId: string): string {
  const safe = threadId.replace(/[^a-zA-Z0-9:_-]/g, "_").slice(0, 120);
  return path.join(ROOT, `${safe}.json`);
}

export async function listOpinions(threadId: string): Promise<PublicOpinion[]> {
  try {
    const raw = await fs.readFile(safeThreadFile(threadId), "utf8");
    const data = JSON.parse(raw) as PublicOpinion[];
    if (!Array.isArray(data)) return [];
    return data.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export type OpinionInput = {
  threadId: string;
  name: string;
  stance: Stance;
  body: string;
  link?: string;
};

export function validateOpinionInput(input: OpinionInput): string | null {
  const name = input.name.trim();
  const body = input.body.trim();
  if (name.length < 1 || name.length > 48) return "Name must be 1–48 characters.";
  if (body.length < 8 || body.length > 2000) return "Opinion must be 8–2000 characters.";
  if (!isStance(input.stance)) return "Pick a valid stance.";
  if (input.link && input.link.length > 200) return "Link is too long.";
  if (input.link && !/^https?:\/\//i.test(input.link)) return "Link must start with http(s)://";
  // Block obvious spam
  if (/(viagra|crypto airdrop|click here now)/i.test(body)) return "That looks like spam.";
  return null;
}

export async function addOpinion(input: OpinionInput): Promise<PublicOpinion> {
  const err = validateOpinionInput(input);
  if (err) throw new Error(err);

  await fs.mkdir(ROOT, { recursive: true });
  const existing = await listOpinions(input.threadId);
  const opinion: PublicOpinion = {
    id: `op_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    threadId: input.threadId,
    name: input.name.trim().slice(0, 48),
    stance: input.stance,
    body: input.body.trim().slice(0, 2000),
    createdAt: new Date().toISOString(),
    link: input.link?.trim() || undefined,
  };
  const next = [opinion, ...existing].slice(0, 500);
  const file = safeThreadFile(input.threadId);
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
  await fs.rename(tmp, file);
  return opinion;
}
