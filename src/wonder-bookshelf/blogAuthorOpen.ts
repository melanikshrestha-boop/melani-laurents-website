/** Open-state copy for blog author folders. Only words Melani dictated. */

import type { ShelfBlog } from "./shelfBlogs";

export type BlogAuthorOpen = {
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
    note: "I think Sam Altman is one of the most polarizing tech titan of our generation. However, trying to ignore his influence and importance of work is extremely hard to do, and if he means what he says, he wants to be one of the more moral guide to the AI race. Nonetheless, I've read and been updated with all of his blog posts as it is very easy to read with a lot of great as well as sometimes cliche advices that does need to be repeated. Here are my favorite ones that I've found useful to my life:",
    linkFrom: 23,
    linkTo: 28,
  },
};
