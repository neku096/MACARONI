import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsPath = path.join(root, "data", "products.json");
const publicDir = path.join(root, "public");
const categories = new Set(["pose", "motion", "solo-motion", "material"]);

const errors = [];
const warnings = [];

const products = JSON.parse(await readFile(productsPath, "utf8"));

if (!Array.isArray(products)) {
  fail("data/products.json must be an array.");
} else {
  await validateProducts(products);
}

printResults();

if (errors.length) {
  process.exitCode = 1;
}

async function validateProducts(items) {
  const ids = new Map();
  const slugs = new Map();

  for (const [index, product] of items.entries()) {
    const label = product?.id || product?.slug || `index ${index}`;

    if (!isRecord(product)) {
      error(label, "product must be an object.");
      continue;
    }

    checkRequiredString(product, "id", label);
    checkRequiredString(product, "slug", label);
    checkRequiredString(product, "title", label);
    checkRequiredString(product, "shortTitle", label);
    checkRequiredString(product, "description", label);
    checkRequiredString(product, "categoryLabel", label);
    checkRequiredString(product, "coverImage", label);
    checkRequiredString(product, "ogImage", label);
    checkRequiredString(product, "galleryPrefix", label);

    if (product.id && ids.has(product.id)) {
      error(label, `duplicate id: ${product.id} also used by ${ids.get(product.id)}`);
    }
    if (product.slug && slugs.has(product.slug)) {
      error(label, `duplicate slug: ${product.slug} also used by ${slugs.get(product.slug)}`);
    }
    if (product.id) ids.set(product.id, label);
    if (product.slug) slugs.set(product.slug, label);

    if (typeof product.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) {
      error(label, "slug must use lowercase letters, numbers, and hyphens.");
    }
    if (!categories.has(product.category)) {
      error(label, `unsupported category: ${String(product.category)}`);
    }
    if (typeof product.published !== "boolean") {
      error(label, "published must be boolean.");
    }
    if (product.noindex !== undefined && typeof product.noindex !== "boolean") {
      error(label, "noindex must be boolean when set.");
    }
    if (!product.published && !product.noindex) {
      warn(label, "draft product should normally keep noindex:true.");
    }

    checkStringArray(product, "tags", label, { allowEmpty: false });
    checkStringArray(product, "avatars", label, { allowEmpty: true });
    checkStringArray(product, "relatedIds", label, { allowEmpty: true });

    if (!Array.isArray(product.specs) || !product.specs.length) {
      warn(label, "specs is empty.");
    }
    if (!Array.isArray(product.salesLinks)) {
      error(label, "salesLinks must be an array.");
    } else if (product.published && !product.salesLinks.length) {
      warn(label, "published product has no salesLinks.");
    }

    const galleryNumbers = getGalleryNumbers(product);
    if (!galleryNumbers.length) {
      error(label, "gallery is empty.");
    }

    if (!hasFaq(product)) {
      warn(label, "FAQ section is empty or missing.");
    }
    if (!product.ogImage || !String(product.ogImage).endsWith(".webp")) {
      warn(label, "OGP image should be a WebP path when possible.");
    }

    await checkPublicImage(product.coverImage, label, "coverImage");
    await checkPublicImage(product.ogImage, label, "ogImage");

    for (const number of galleryNumbers) {
      const padded = String(number).padStart(2, "0");
      await checkPublicImage(`/products/${product.slug}/${product.galleryPrefix}-${padded}.webp`, label, "gallery src");
      await checkPublicImage(`/products/${product.slug}/${product.galleryPrefix}-${padded}-600.webp`, label, "gallery thumb");
    }
  }

  const allIds = new Set(items.map((product) => product.id));
  for (const product of items) {
    if (!isRecord(product) || !Array.isArray(product.relatedIds)) continue;

    for (const relatedId of product.relatedIds) {
      if (!allIds.has(relatedId)) {
        error(product.id || product.slug, `relatedIds references missing product: ${relatedId}`);
      }
      if (relatedId === product.id) {
        warn(product.id, "relatedIds includes itself.");
      }
    }
  }
}

function checkRequiredString(product, key, label) {
  if (typeof product[key] !== "string" || !product[key].trim()) {
    error(label, `${key} is missing.`);
  }
}

function checkStringArray(product, key, label, options) {
  if (!Array.isArray(product[key])) {
    error(label, `${key} must be an array.`);
    return;
  }

  if (!options.allowEmpty && !product[key].length) {
    warn(label, `${key} is empty.`);
  }

  for (const value of product[key]) {
    if (typeof value !== "string" || !value.trim()) {
      error(label, `${key} contains an empty value.`);
    }
  }
}

function getGalleryNumbers(product) {
  if (!isRecord(product)) return [];
  if (Array.isArray(product.galleryNumbers) && product.galleryNumbers.length) {
    return product.galleryNumbers.filter((number) => Number.isInteger(number) && number > 0);
  }
  if (!Number.isInteger(product.galleryCount) || product.galleryCount <= 0) {
    return [];
  }
  return Array.from({ length: product.galleryCount }, (_, index) => index + 1);
}

function hasFaq(product) {
  return (
    Array.isArray(product.detailArticles) &&
    product.detailArticles.some((article) => typeof article === "string" && /<h2[^>]*>\s*FAQ\s*<\/h2>/i.test(article))
  );
}

async function checkPublicImage(urlPath, label, field) {
  if (typeof urlPath !== "string" || !urlPath.trim()) {
    return;
  }
  if (/^https?:\/\//i.test(urlPath)) {
    return;
  }
  if (!urlPath.startsWith("/")) {
    warn(label, `${field} should use an absolute public path: ${urlPath}`);
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
    error(label, `${field} missing image: ${urlPath}`);
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
    console.error(`\nProduct validation failed with ${errors.length} error(s):`);
    for (const message of errors) {
      console.error(`- ${message}`);
    }
  }

  if (warnings.length) {
    console.warn(`\nProduct validation warning(s): ${warnings.length}`);
    for (const message of warnings) {
      console.warn(`- ${message}`);
    }
  }

  if (!errors.length) {
    console.log(`Product validation passed. products=${Array.isArray(products) ? products.length : 0}, warnings=${warnings.length}`);
  }
}
