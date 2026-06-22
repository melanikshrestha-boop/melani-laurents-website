"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ResearchPost } from "@/lib/research";

interface ResearchListProps {
  posts: ResearchPost[];
}

export function ResearchList({ posts }: ResearchListProps) {
  const reduced = useReducedMotion();
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort();
  const filtered = activeTag
    ? posts.filter((post) => post.tags.includes(activeTag))
    : posts;

  return (
    <div className="research-list-shell">
      {allTags.length > 1 && (
        <div className="research-filters" aria-label="Filter research by topic">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={activeTag === null ? "is-active" : undefined}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={activeTag === tag ? "is-active" : undefined}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <div className="research-list">
        {filtered.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.035, duration: 0.3 }}
          >
            <Link href={`/research/${post.slug}`} className="research-entry">
              <span className="research-entry__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="research-entry__date">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
                <span>{post.readingTime}</span>
              </div>
              <div className="research-entry__content">
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <span className="research-entry__arrow" aria-hidden>
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
