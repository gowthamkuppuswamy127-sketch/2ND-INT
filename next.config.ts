import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Photography is supplied later via `src` in lib/media.ts and
     * content/projects.ts.
     *
     * Files placed in /public work with no config — reference them as
     * "/drawing-room.jpg".
     *
     * Images hosted elsewhere must have their host listed here first, or
     * next/image will refuse to optimise them. Add one entry per host:
     *
     *   remotePatterns: [
     *     { protocol: "https", hostname: "images.example.com" },
     *   ],
     */
    remotePatterns: [],
  },
};

export default nextConfig;
