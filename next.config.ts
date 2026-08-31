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
  // Chrome hard-requests /favicon.ico. Serve square Eren PNG there too.
  // src/app/favicon.ico is still a 16+32+48 ICO of the full still.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/favicon.ico", destination: "/eren-stay9.png" },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/favicon.ico",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/eren-stay9.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
      {
        source: "/never-c.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];
  },
};

export default nextConfig;
