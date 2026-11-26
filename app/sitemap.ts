import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { tools, categories } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...categories.map((c) => ({ url: `${siteConfig.url}/category/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...tools.map((t) => ({ url: `${siteConfig.url}/tools/${t.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: t.popular ? 0.9 : 0.7 })),
    ...["about", "contact", "privacy", "terms"].map((p) => ({ url: `${siteConfig.url}/${p}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
