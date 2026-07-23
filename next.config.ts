import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

// Pin turbopack root to this repo (avoids picking parent lockfiles)
const rootDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {
    root: rootDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
