import type { MetadataRoute } from "next";
import { getAbsoluteProductUrl, getPublishedProducts, siteUrl } from "@/lib/products";

const lastModified = new Date("2026-05-24T00:00:00+09:00");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/characters.html`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/tips.html`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/terms.html`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];

  const productPages = getPublishedProducts().map((product) => ({
    url: getAbsoluteProductUrl(product),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...productPages];
}
