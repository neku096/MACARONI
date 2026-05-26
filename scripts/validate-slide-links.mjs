import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slideLinksPath = path.join(root, "data", "slide-links.json");
const publicDir = path.join(root, "public");

const errors = [];
const warnings = [];
const slideLinks = JSON.parse(await readFile(slideLinksPath, "utf8"));

if (!Array.isArray(slideLinks)) {
  fail("data/slide-links.json must be an array.");
} else {
  await validateSlideLinks(slideLinks);
}

printResults();

if (errors.length) {
  process.exitCode = 1;
}

async function validateSlideLinks(items) {
  const urls = new Map();

  for (const [index, item] of items.entries()) {
    const label = item?.title || item?.url || `index ${index}`;

    if (!isRecord(item)) {
      error(label, "slide link must be an object.");
      continue;
    }

    checkRequiredString(item, "title", label);
    checkRequiredString(item, "description", label);
    checkRequiredString(item, "url", label);
    checkRequiredString(item, "thumbnail", label);
    checkRequiredString(item, "category", label);

    if (item.url && urls.has(item.url)) {
      error(label, `duplicate url: ${item.url} also used by ${urls.get(item.url)}`);
    }
    if (item.url) urls.set(item.url, label);

    if (typeof item.url === "string" && !isHttpUrl(item.url)) {
      error(label, "url must be an absolute http(s) URL.");
    }
    if (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      error(label, "tags must be a non-empty string array.");
    }
    if (!Number.isInteger(item.sortOrder)) {
      error(label, "sortOrder must be an integer.");
    }
    if (typeof item.published !== "boolean") {
      error(label, "published must be boolean.");
    }
    if (typeof item.openInNewTab !== "boolean") {
      error(label, "openInNewTab must be boolean.");
    }
    if (!item.published) {
      warn(label, "slide link is draft.");
    }

    await checkLocalPublicAsset(item.thumbnail, label, "thumbnail");
  }
}

function checkRequiredString(item, key, label) {
  if (typeof item[key] !== "string" || !item[key].trim()) {
    error(label, `${key} is missing.`);
  }
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function checkLocalPublicAsset(urlPath, label, field) {
  if (typeof urlPath !== "string" || !urlPath.trim()) {
    return;
  }
  if (/^https?:\/\//i.test(urlPath)) {
    error(label, `${field} must use a local public path.`);
    return;
  }
  if (!urlPath.startsWith("/")) {
    error(label, `${field} must start with /: ${urlPath}`);
    return;
  }

  const normalizedPath = path.normalize(urlPath.replace(/^\/+/, ""));
  const filePath = path.join(publicDir, normalizedPath);

  if (!filePath.startsWith(publicDir)) {
    error(label, `${field} escapes public dir: ${urlPath}`);
    return;
  }

  try {
    await access(filePath);
  } catch {
    error(label, `${field} missing asset: ${urlPath}`);
  }
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function error(label, message) {
  errors.push(`[${label}] ${message}`);
}

function warn(label, message) {
  warnings.push(`[${label}] ${message}`);
}

function fail(message) {
  errors.push(message);
}

function printResults() {
  if (errors.length) {
    console.error(`\nSlide link validation failed with ${errors.length} error(s):`);
    for (const message of errors) {
      console.error(`- ${message}`);
    }
  }

  if (warnings.length) {
    console.warn(`\nSlide link validation warning(s): ${warnings.length}`);
    for (const message of warnings) {
      console.warn(`- ${message}`);
    }
  }

  if (!errors.length) {
    console.log(`Slide link validation passed. slideLinks=${Array.isArray(slideLinks) ? slideLinks.length : 0}, warnings=${warnings.length}`);
  }
}
