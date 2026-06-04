import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const topCardsPath = path.join(root, "data", "top-cards.json");
const productsPath = path.join(root, "data", "products.json");
const publicDir = path.join(root, "public");

const errors = [];
const warnings = [];
const topCards = JSON.parse(await readFile(topCardsPath, "utf8"));
const products = JSON.parse(await readFile(productsPath, "utf8"));
const productSlugs = new Set(Array.isArray(products) ? products.map((product) => product.slug) : []);

if (!Array.isArray(topCards)) {
  fail("data/top-cards.json must be an array.");
} else if (!Array.isArray(products)) {
  fail("data/products.json must be an array.");
} else {
  await validateTopCards(topCards);
}

printResults();

if (errors.length) {
  process.exitCode = 1;
}

async function validateTopCards(items) {
  const urls = new Map();

  for (const [index, item] of items.entries()) {
    const label = item?.title || item?.url || `index ${index}`;

    if (!isRecord(item)) {
      error(label, "top card must be an object.");
      continue;
    }

    checkRequiredString(item, "title", label);
    checkRequiredString(item, "url", label);
    checkRequiredString(item, "thumbnail", label);
    checkRequiredString(item, "category", label);

    if (item.url && urls.has(item.url)) {
      error(label, `duplicate url: ${item.url} also used by ${urls.get(item.url)}`);
    }
    if (item.url) urls.set(item.url, label);

    if (typeof item.url === "string" && !isProductDestinationUrl(item.url)) {
      error(label, "url must be a product LP path (/products/<slug>) or a BOOTH item URL.");
    }
    if (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      error(label, "tags must be a non-empty string array.");
    }
    if (item.sourceProductSlug !== undefined && (typeof item.sourceProductSlug !== "string" || !item.sourceProductSlug.trim())) {
      error(label, "sourceProductSlug must be a non-empty string.");
    }
    if (typeof item.sourceProductSlug === "string" && item.sourceProductSlug.trim() && !productSlugs.has(item.sourceProductSlug.trim())) {
      error(label, `sourceProductSlug not found in products.json: ${item.sourceProductSlug}`);
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
      warn(label, "top card is draft.");
    }

    await checkLocalPublicAsset(item.thumbnail, label, "thumbnail");
  }
}

function checkRequiredString(item, key, label) {
  if (typeof item[key] !== "string" || !item[key].trim()) {
    error(label, `${key} is missing.`);
  }
}

function isProductDestinationUrl(value) {
  const trimmedValue = value.trim();
  if (/^\/products\/[a-z0-9-]+\/?$/i.test(trimmedValue)) {
    return true;
  }

  return isBoothItemUrl(trimmedValue);
}

function isBoothItemUrl(value) {
  try {
    const url = new URL(value);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    const isBoothHost = url.hostname === "booth.pm" || url.hostname.endsWith(".booth.pm");
    return isHttp && isBoothHost && url.pathname.startsWith("/items/");
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
    console.error(`\nTop card validation failed with ${errors.length} error(s):`);
    for (const message of errors) {
      console.error(`- ${message}`);
    }
  }

  if (warnings.length) {
    console.warn(`\nTop card validation warning(s): ${warnings.length}`);
    for (const message of warnings) {
      console.warn(`- ${message}`);
    }
  }

  if (!errors.length) {
    console.log(`Top card validation passed. topCards=${Array.isArray(topCards) ? topCards.length : 0}, warnings=${warnings.length}`);
  }
}
