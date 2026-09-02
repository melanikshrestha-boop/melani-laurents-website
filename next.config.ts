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
  // Chrome hard-requests /favicon.ico. Serve the square Eren PNG there too.
  // src/app/favicon.ico MUST exist (16+32+48 RGBA of the FULL still). Next
  // injects it as rel=icon sizes=32x32; Chrome prefers that over the PNG.
  // Never a 32px face-crop (~2287 bytes) — that reads as ©. RGB PNG-in-ICO
  // 500s Turbopack — keep RGBA.
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/favicon.ico", destination: "/eren-keep15.png" },
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
        source: "/eren-keep15.png",
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
