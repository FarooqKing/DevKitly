import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, priority: 1 },
    { url: `${siteConfig.url}/about`, lastModified: now, priority: 0.4 },
    ...tools.map((t) => ({ url: `${siteConfig.url}/tools/${t.slug}`, lastModified: now, priority: 0.8 })),
  ];
}
