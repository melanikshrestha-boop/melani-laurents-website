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
  async redirects() {
    return [
      { source: "/link", destination: "/links", permanent: true },
      { source: "/linktree", destination: "/links", permanent: true },
      { source: "/bio", destination: "/links", permanent: true },
    ];
  },
};

export default nextConfig;
