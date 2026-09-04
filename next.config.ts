import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Keep Turbopack rooted on THIS project — home has extra package-lock files
// that make Next pick the wrong root and break the page (500 / client manifest).
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: projectRoot,
  },
  // Chrome hard-requests /favicon.ico. Rewrite it to the square Eren PNG.
  // Do NOT add src/app/favicon.ico — Next hashes it (?favicon.*.ico) and
  // Chrome prefers that 48px ICO, which is how the gold C comes back.
  async redirects() {
    return [
      { source: "/builds", destination: "/projects", permanent: false },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/favicon.ico", destination: "/icon-eren.png" },
        { source: "/icon.svg", destination: "/icon-eren.png" },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/icon-eren.png",
        headers: [
          { key: "Cache-Control", value: "no-store, no-cache, must-revalidate" },
        ],
      },
      {
        source: "/never-c.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/icon.svg",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
