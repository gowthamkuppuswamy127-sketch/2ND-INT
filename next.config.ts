import type { NextConfig } from "next";

/**
 * Response headers applied to every route.
 *
 * The site previously sent none of these, which left it accepting framing by
 * any origin, leaking full referrer URLs cross-site, and placing no limit at
 * all on what a script injected into a page could then load or talk to.
 *
 * On `script-src`: a nonce-based policy is the stronger form, but it requires
 * middleware to stamp a fresh nonce per response, which would turn every page
 * here from statically prerendered into dynamically rendered — a real cost for
 * a brochure site, paid on every request. Next also emits its own inline
 * bootstrap and RSC-payload scripts whose contents change per build, so hashes
 * can't stand in. `'unsafe-inline'` is therefore kept for scripts, and the
 * directives that do the heavy lifting against injected content are the ones
 * around it: no external script origins, no plugins, no <base> rewriting, and
 * a form action that can't be redirected off-site.
 *
 * `style-src` needs `'unsafe-inline'` regardless: React writes inline `style`
 * attributes, which this site uses for aspect-ratio boxes and tonal fields.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // next/font/google downloads and self-hosts the woff2 files at build time
  // (verified in the built HTML: the preloads point at /_next/static/media),
  // so there is no runtime request to Google to allow for.
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Belt and braces with frame-ancestors above, for anything that still reads
  // the older header.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // Nothing on this site asks for any of these, so nothing here or in an
    // embed should be able to.
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
      "interest-cohort=()",
    ].join(", "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // The version banner is free reconnaissance and buys nothing.
  poweredByHeader: false,

  images: {
    /**
     * Photography is supplied via `src` in lib/media.ts and
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
    // Preferred first. Both are markedly smaller than the source jpeg/png at
    // equal quality, and the browser picks whichever it supports.
    formats: ["image/avif", "image/webp"],
    // A year, immutable: optimised variants are addressed by a URL that
    // already encodes the source, the width and the quality, so a changed
    // photo is a changed URL.
    minimumCacheTTL: 31536000,
    // An <img> rendered from an SVG source would otherwise be able to carry
    // script. Nothing here needs next/image to process SVG — app/icon.svg is
    // served directly — so it stays off.
    dangerouslyAllowSVG: false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Hashed build output is immutable by construction; the videos and
        // photos in /public are not hashed, so they get a shorter life with
        // revalidation rather than a year of staleness.
        source: "/:file*.(mp4|webm|jpg|jpeg|png|webp|avif|svg)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
