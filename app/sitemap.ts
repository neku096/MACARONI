import type { MetadataRoute } from "next";
import { getAbsoluteProductUrl, getIndexableProducts, siteUrl } from "@/lib/products";

const lastModified = new Date("2026-05-24T00:00:00+09:00");
const characterSlugs = [
  "airi",
  "chocolat",
  "eku",
  "ichigo",
  "kumaly",
  "lasyusha",
  "lumina",
  "mafuyu",
  "manuka",
  "mayo",
  "milfy",
  "milltina",
  "moe",
  "plum",
  "ramune",
  "ririka",
  "rurune",
  "selestia",
  "shinano",
  "sio",
];

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
      url: `${siteUrl}/characters`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/links`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tips`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
  const characterPages = characterSlugs.map((slug) => ({
    url: `${siteUrl}/character-${slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const productPages = getIndexableProducts().map((product) => ({
    url: getAbsoluteProductUrl(product),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...characterPages, ...productPages];
}
