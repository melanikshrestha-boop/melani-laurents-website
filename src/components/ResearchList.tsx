"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ResearchPost } from "@/lib/research";

interface ResearchListProps {
  posts: ResearchPost[];
}

export function ResearchList({ posts }: ResearchListProps) {
  const reduced = useReducedMotion();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags))).sort();
  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <div>
      {allTags.length > 1 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`rounded-md px-3 py-1 font-mono-label text-[10px] transition-colors ${
                activeTag === tag
                  ? "bg-accent text-background"
                  : "bg-surface text-muted hover:text-foreground"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {filtered.map((post, i) => (
          <motion.div
            key={post.slug}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
          >
            <Link
              href={`/research/${post.slug}`}
              className="group grid gap-4 border-b border-border/40 py-7 transition-colors hover:bg-surface/30 md:grid-cols-[7rem_1fr]"
            >
              <div className="font-mono-label text-[11px] text-muted-foreground leading-relaxed">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
                <br />
                {post.readingTime}
              </div>
              <div>
                <h3 className="font-sans text-lg font-medium text-foreground group-hover:text-accent transition-colors md:text-xl">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {post.summary}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import { useState } from "react";
