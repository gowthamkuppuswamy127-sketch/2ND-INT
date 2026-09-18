import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { siteUrl } from "./layout";

/**
 * Generated from the same `projects` array the routes are, so a project added
 * to content/projects.ts appears here without anyone having to remember to
 * list it — the failure mode a hand-written sitemap always eventually has.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();
  const lastModified = new Date();

  return [
    { url: url("/"), lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: url("/projects"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: url("/studio"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: url("/contact"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    ...projects.map((project) => ({
      url: url(`/projects/${project.slug}`),
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
