/** Open-state copy for blog author folders. Only words Melani dictated. */

import type { ShelfBlog } from "./shelfBlogs";

export type BlogAuthorOpen = {
  /** One paragraph. Only words Melani dictated. */
  note: string;
  /** 1-indexed range of posts to link when the folder is open. */
  linkFrom: number;
  linkTo: number;
};

export function visibleBlogItems(
  groupId: string,
  items: ShelfBlog[],
  edit: boolean,
): { blog: ShelfBlog; n: number }[] {
  if (edit) return items.map((blog, i) => ({ blog, n: i + 1 }));
  const open = BLOG_AUTHOR_OPEN[groupId];
  if (!open) return items.map((blog, i) => ({ blog, n: i + 1 }));
  return items.slice(open.linkFrom - 1, open.linkTo).map((blog, i) => ({
    blog,
    n: open.linkFrom + i,
  }));
}

export const BLOG_AUTHOR_OPEN: Record<string, BlogAuthorOpen> = {
  "sam-altman": {
    note: "Sam Altman is one of the most polarizing tech titans of our new generation. Trying to ignore his influence and the importance of his work is extremely hard to do, and if he means what he says, he is going to be the moral leader of the AI race. Nonetheless, I've read and been updated with all of his blog posts, as they are written with brevity and a lot of great advice, as well as cliches that do need to be repeated. Here are my hand-picked favorite ones I've found useful to my life or occasionally go back to.",
    linkFrom: 23,
    linkTo: 28,
  },
};
