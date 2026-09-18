import type { MetadataRoute } from "next";
import { siteUrl } from "./layout";

/**
 * Without this, crawlers get a 404 for /robots.txt and no pointer to the
 * sitemap, so discovery of the project pages depends entirely on them being
 * linked from somewhere already crawled.
 *
 * /_next/ is excluded because build output is not content: it is only ever
 * noise in an index, and the optimiser endpoint underneath it will answer an
 * unbounded number of distinct URLs for the same photograph.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl.origin,
  };
}
