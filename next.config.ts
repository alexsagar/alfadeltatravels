import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // `*.dev.tsx` routes (local draft preview) exist only under `next dev`.
  pageExtensions: process.env.NODE_ENV === "development" ? ["dev.tsx", "tsx", "ts"] : ["tsx", "ts"],
  // CMS images come from Sanity's CDN (already width-capped and format-negotiated in map.ts).
  images: { remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
