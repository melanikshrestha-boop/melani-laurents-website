/**
 * Live blog-block typography (Google Docs–style controls).
 * Defaults ship in code; Melani’s tweaks persist in localStorage on her machine.
 * “Export” in the UI copies JSON so we can commit permanent defaults later.
 */

export type BlogDisplayStyle = {
  fontFamily: string;
  headingSize: number;
  titleSize: number;
  metaSize: number;
  highlightSize: number;
  takeSize: number;
  headingColor: string;
  titleColor: string;
  metaColor: string;
  highlightColor: string;
  takeColor: string;
  numberColor: string;
  rowGap: number;
  lineGap: number;
  sectionTop: number;
};

export const BLOG_STYLE_KEY = "celine-blogs-display-style-v1";
export const BLOG_TEXT_KEY = "celine-blogs-text-overrides-v1";

export const BLOG_FONT_OPTIONS = [
  { label: "Times New Roman", value: '"Times New Roman", Times, serif' },
  { label: "Georgia", value: 'Georgia, "Times New Roman", serif' },
  { label: "Source Serif", value: '"Source Serif 4", Georgia, serif' },
  { label: "Garamond", value: 'Garamond, "Times New Roman", serif' },
  { label: "Palatino", value: 'Palatino, "Palatino Linotype", serif' },
  { label: "System UI", value: 'system-ui, -apple-system, sans-serif' },
  { label: "Inter / sans", value: 'ui-sans-serif, system-ui, sans-serif' },
] as const;

export const DEFAULT_BLOG_STYLE: BlogDisplayStyle = {
  fontFamily: '"Times New Roman", Times, serif',
  headingSize: 13,
  titleSize: 11,
  metaSize: 10,
  highlightSize: 10,
  takeSize: 10,
  headingColor: "#29251f",
  titleColor: "#29251f",
  metaColor: "#9a9084",
  highlightColor: "#5c534a",
  takeColor: "#3d3630",
  numberColor: "#a89f93",
  rowGap: 12,
  lineGap: 2,
  sectionTop: 14,
};

export type BlogTextOverride = {
  highlight?: string;
  take?: string;
};

export function loadBlogStyle(): BlogDisplayStyle {
  if (typeof window === "undefined") return { ...DEFAULT_BLOG_STYLE };
  try {
    const raw = localStorage.getItem(BLOG_STYLE_KEY);
    if (!raw) return { ...DEFAULT_BLOG_STYLE };
    const parsed = JSON.parse(raw) as Partial<BlogDisplayStyle>;
    return { ...DEFAULT_BLOG_STYLE, ...parsed };
  } catch {
    return { ...DEFAULT_BLOG_STYLE };
  }
}

export function saveBlogStyle(style: BlogDisplayStyle): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BLOG_STYLE_KEY, JSON.stringify(style));
}

export function loadBlogTextOverrides(): Record<string, BlogTextOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(BLOG_TEXT_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, BlogTextOverride>;
  } catch {
    return {};
  }
}

export function saveBlogTextOverrides(
  map: Record<string, BlogTextOverride>
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(BLOG_TEXT_KEY, JSON.stringify(map));
}

/** CSS custom properties for .pb-blogs */
export function blogStyleToCssVars(
  s: BlogDisplayStyle
): Record<string, string> {
  return {
    "--pb-blog-font": s.fontFamily,
    "--pb-blog-heading-size": `${s.headingSize}px`,
    "--pb-blog-title-size": `${s.titleSize}px`,
    "--pb-blog-meta-size": `${s.metaSize}px`,
    "--pb-blog-highlight-size": `${s.highlightSize}px`,
    "--pb-blog-take-size": `${s.takeSize}px`,
    "--pb-blog-heading-color": s.headingColor,
    "--pb-blog-title-color": s.titleColor,
    "--pb-blog-meta-color": s.metaColor,
    "--pb-blog-highlight-color": s.highlightColor,
    "--pb-blog-take-color": s.takeColor,
    "--pb-blog-number-color": s.numberColor,
    "--pb-blog-row-gap": `${s.rowGap}px`,
    "--pb-blog-line-gap": `${s.lineGap}px`,
    "--pb-blog-section-top": `${s.sectionTop}px`,
  };
}
