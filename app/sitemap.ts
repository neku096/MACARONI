import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";
import { getAbsoluteProductUrl, getIndexableProducts, siteUrl } from "@/lib/products";

const sitemapGeneratedAt = new Date();
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

const fileLastModifiedCache = new Map<string, Date | null>();

function getSourceLastModified(...relativePaths: string[]) {
  const dates = relativePaths
    .map((relativePath) => getFileLastModified(relativePath))
    .filter((date): date is Date => Boolean(date));

  if (!dates.length) {
    return sitemapGeneratedAt;
  }

  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function getFileLastModified(relativePath: string) {
  if (!fileLastModifiedCache.has(relativePath)) {
    fileLastModifiedCache.set(relativePath, getGitLastModified(relativePath) ?? getFileStatLastModified(relativePath));
  }

  return fileLastModifiedCache.get(relativePath) ?? null;
}

function getGitLastModified(relativePath: string) {
  try {
    const safeDirectory = process.cwd().replace(/\\/g, "/");
    const isoDate = execFileSync("git", ["-c", `safe.directory=${safeDirectory}`, "log", "-1", "--format=%cI", "--", relativePath], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return parseSitemapDate(isoDate);
  } catch {
    return null;
  }
}

function getFileStatLastModified(relativePath: string) {
  const absolutePath = getSourceAbsolutePath(relativePath);

  if (!absolutePath) {
    return null;
  }

  try {
    return parseSitemapDate(statSync(absolutePath).mtime);
  } catch {
    return null;
  }
}

function getSourceAbsolutePath(relativePath: string) {
  const [directory, ...fileSegments] = relativePath.split("/");

  if (!fileSegments.length) {
    return null;
  }

  const filePath = path.join(...fileSegments);

  if (directory === "app") {
    return path.join(process.cwd(), "app", filePath);
  }

  if (directory === "data") {
    return path.join(process.cwd(), "data", filePath);
  }

  if (directory === "public") {
    return path.join(process.cwd(), "public", filePath);
  }

  return null;
}

function parseSitemapDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (date.getTime() > sitemapGeneratedAt.getTime()) {
    return sitemapGeneratedAt;
  }

  return date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const productsLastModified = getSourceLastModified("data/products.json");
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: getSourceLastModified("app/page.tsx", "data/top-cards.json"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: getSourceLastModified("app/products/page.tsx", "data/products.json"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/characters`,
      lastModified: getSourceLastModified("public/characters.html", "data/free-poses.json"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/links`,
      lastModified: getSourceLastModified("public/links.html"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tips`,
      lastModified: getSourceLastModified("public/tips.html"),
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: getSourceLastModified("public/terms.html"),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
  const characterPages = characterSlugs.map((slug) => ({
    url: `${siteUrl}/character-${slug}`,
    lastModified: getSourceLastModified(`public/character-${slug}.html`, "data/free-poses.json"),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  const productPages = getIndexableProducts().map((product) => ({
    url: getAbsoluteProductUrl(product),
    lastModified: productsLastModified,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...characterPages, ...productPages];
}
