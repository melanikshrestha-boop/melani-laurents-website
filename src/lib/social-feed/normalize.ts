import type {
  SocialContentType,
  SocialPillar,
  SocialPlatform,
  SocialPost,
} from "./types";

const PILLAR_MARKERS: ReadonlyArray<{
  pillar: SocialPillar;
  markers: readonly string[];
}> = [
  {
    pillar: "essays",
    markers: ["#essay", "#essays", "[essay]", "essay:"],
  },
  {
    pillar: "books",
    markers: [
      "#book",
      "#books",
      "#booknotes",
      "#bookshelf",
      "#reading",
      "[book]",
      "[books]",
    ],
  },
  {
    pillar: "builds",
    markers: ["#build", "#builds", "#building", "[build]", "build log:"],
  },
  {
    pillar: "daily",
    markers: ["#daily", "#dailies", "[daily]"],
  },
];

const VALID_PILLARS = new Set<SocialPillar>([
  "essays",
  "books",
  "daily",
  "builds",
]);

function providerDefaultPillar(platform: SocialPlatform): SocialPillar {
  const key = `SOCIAL_${platform.toUpperCase()}_DEFAULT_PILLAR`;
  const configured = process.env[key]?.toLowerCase() as SocialPillar | undefined;

  return configured && VALID_PILLARS.has(configured) ? configured : "daily";
}

export function inferPillar(
  platform: SocialPlatform,
  ...textParts: Array<string | null | undefined>
): SocialPillar {
  const text = textParts.filter(Boolean).join(" ").toLowerCase();

  for (const { pillar, markers } of PILLAR_MARKERS) {
    if (markers.some((marker) => text.includes(marker))) return pillar;
  }

  return providerDefaultPillar(platform);
}

export function normalizeDate(value: string | number | null | undefined) {
  const date =
    typeof value === "number"
      ? new Date(value > 10_000_000_000 ? value : value * 1000)
      : new Date(value ?? 0);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function normalizePost(input: {
  externalId: string;
  platform: SocialPlatform;
  url: string;
  publishedAt: string | number | null | undefined;
  title?: string | null;
  body?: string | null;
  thumbnailUrl?: string | null;
  mediaUrl?: string | null;
  author?: string | null;
  contentType?: SocialContentType;
}): SocialPost | null {
  const publishedAt = normalizeDate(input.publishedAt);
  const externalId = input.externalId.trim();
  const url = input.url.trim();

  if (!externalId || !url || !publishedAt) return null;

  const title = input.title?.trim() || undefined;
  const body = input.body?.trim() || undefined;
  const thumbnailUrl = input.thumbnailUrl?.trim() || undefined;
  const mediaUrl = input.mediaUrl?.trim() || undefined;

  return {
    id: `${input.platform}:${externalId}`,
    externalId,
    platform: input.platform,
    pillar: inferPillar(input.platform, title, body),
    contentType: input.contentType ?? (mediaUrl ? "image" : "text"),
    url,
    publishedAt,
    title,
    body,
    thumbnailUrl,
    mediaUrl,
    author: input.author?.trim() || undefined,
  };
}

export function summarize(text: string | null | undefined, max = 88) {
  if (!text) return undefined;
  const compact = text.replace(/\s+/g, " ").trim();
  if (compact.length <= max) return compact;
  return `${compact.slice(0, max - 1).trimEnd()}…`;
}

export function decodeXml(value: string | undefined) {
  if (!value) return undefined;
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
}

export function tagValue(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = xml.match(
    new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"),
  );
  return decodeXml(match?.[1]);
}

export function attributeValue(
  xml: string,
  tag: string,
  attribute: string,
) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedAttribute = attribute.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
  const tagMatch = xml.match(new RegExp(`<${escapedTag}\\b[^>]*>`, "i"));
  const attributeMatch = tagMatch?.[0].match(
    new RegExp(`${escapedAttribute}=(?:"([^"]*)"|'([^']*)')`, "i"),
  );
  return decodeXml(attributeMatch?.[1] ?? attributeMatch?.[2]);
}
