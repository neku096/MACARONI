import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const freePosesPath = path.join(root, "data", "free-poses.json");
const publicDir = path.join(root, "public");
const characterPages = [
  { slug: "airi", folder: "Airi", name: "愛莉" },
  { slug: "chocolat", folder: "Chocolat", name: "ショコラ" },
  { slug: "eku", folder: "Eku", name: "エク" },
  { slug: "ichigo", folder: "ICHIGO", name: "イチゴ" },
  { slug: "kumaly", folder: "KUMALY", name: "クマリ" },
  { slug: "lasyusha", folder: "Lasyusha", name: "ラシューシャ" },
  { slug: "lumina", folder: "LUMINA", name: "ルミナ" },
  { slug: "mafuyu", folder: "Mafuyu", name: "真冬" },
  { slug: "manuka", folder: "MANUKA", name: "マヌカ" },
  { slug: "mayo", folder: "Mayo", name: "まよ" },
  { slug: "milfy", folder: "Milfy", name: "ミルフィ" },
  { slug: "milltina", folder: "Milltina", name: "ミルティナ" },
  { slug: "moe", folder: "Moe", name: "萌" },
  { slug: "plum", folder: "Plum", name: "プラム" },
  { slug: "ramune", folder: "Ramune", name: "ラムネ" },
  { slug: "ririka", folder: "Ririka", name: "りりか" },
  { slug: "rurune", folder: "Rurune", name: "ルルネ" },
  { slug: "selestia", folder: "SELESTIA", name: "セレスティア" },
  { slug: "shinano", folder: "Shinano", name: "しなの" },
  { slug: "sio", folder: "Sio", name: "しお" },
];
const characters = new Set(characterPages.map((character) => character.name));

const errors = [];
const warnings = [];
const freePoses = JSON.parse(await readFile(freePosesPath, "utf8"));

if (!Array.isArray(freePoses)) {
  fail("data/free-poses.json must be an array.");
} else {
  await validateFreePoses(freePoses);
  await validatePublishedCharacterPages(freePoses);
}

printResults();

if (errors.length) {
  process.exitCode = 1;
}

async function validateFreePoses(items) {
  const slugs = new Map();

  for (const [index, item] of items.entries()) {
    const label = item?.slug || `index ${index}`;

    if (!isRecord(item)) {
      error(label, "free pose must be an object.");
      continue;
    }

    checkRequiredString(item, "title", label);
    checkRequiredString(item, "slug", label);
    checkRequiredString(item, "description", label);
    checkRequiredString(item, "character", label);
    checkRequiredString(item, "thumbnail", label);
    checkRequiredString(item, "downloadUrl", label);

    if (item.slug && slugs.has(item.slug)) {
      error(label, `duplicate slug: ${item.slug} also used by ${slugs.get(item.slug)}`);
    }
    if (item.slug) slugs.set(item.slug, label);

    if (typeof item.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      error(label, "slug must use lowercase letters, numbers, and hyphens.");
    }
    if (!characters.has(item.character)) {
      error(label, `character is not in the existing character list: ${String(item.character)}`);
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
    if (typeof item.noindex !== "boolean") {
      error(label, "noindex must be boolean.");
    }
    if (!item.published && !item.noindex) {
      warn(label, "draft free pose should normally keep noindex:true.");
    }

    await checkLocalPublicAsset(item.thumbnail, label, "thumbnail");
    await checkLocalPublicAsset(item.downloadUrl, label, "downloadUrl");

    if (item.gallery !== undefined) {
      if (!Array.isArray(item.gallery)) {
        error(label, "gallery must be an array when set.");
      } else {
        for (const [galleryIndex, image] of item.gallery.entries()) {
          const galleryLabel = `${label} gallery ${galleryIndex + 1}`;
          if (!isRecord(image)) {
            error(galleryLabel, "gallery image must be an object.");
            continue;
          }
          checkRequiredString(image, "src", galleryLabel);
          checkRequiredString(image, "alt", galleryLabel);
          await checkLocalPublicAsset(image.src, galleryLabel, "gallery src");
        }
      }
    }
  }
}

async function validatePublishedCharacterPages(items) {
  const byCharacter = new Map();

  for (const item of items) {
    if (!item.published) {
      continue;
    }
    const group = byCharacter.get(item.character) ?? [];
    group.push(item);
    byCharacter.set(item.character, group);
  }

  for (const character of characterPages) {
    const label = `character-${character.slug}.html`;
    const group = (byCharacter.get(character.name) ?? []).sort((a, b) => a.sortOrder - b.sortOrder);
    const pagePath = path.join(publicDir, `character-${character.slug}.html`);
    let html = "";

    try {
      html = await readFile(pagePath, "utf8");
    } catch {
      error(label, "missing public character page.");
      continue;
    }

    const section = html.match(/<section class="section catalog-section"[\s\S]*?<\/section>/)?.[0] ?? "";
    const cards = section.match(/class="pose-card free-pose-card"/g)?.length ?? 0;
    const buttons = section.match(/free-pose-full-download/g)?.length ?? 0;
    const compactButtons = section.match(/button compact/g)?.length ?? 0;

    if (group.length !== 10) {
      error(label, `expected 10 published free pose entries for ${character.name}, found ${group.length}.`);
    }
    if (cards !== 10) {
      error(label, `expected 10 free pose cards, found ${cards}.`);
    }
    if (buttons !== 1) {
      error(label, `expected 1 full download button, found ${buttons}.`);
    }
    if (compactButtons !== 0) {
      error(label, `individual compact download buttons should not be rendered, found ${compactButtons}.`);
    }

    for (const item of group) {
      const thumbnail = item.thumbnail.replace(/^\/+/, "");
      const downloadUrl = item.downloadUrl.replace(/^\/+/, "");
      if (!section.includes(thumbnail)) {
        error(label, `missing thumbnail from free-poses.json: ${item.thumbnail}`);
      }
      if (!section.includes(downloadUrl)) {
        error(label, `missing downloadUrl from free-poses.json: ${item.downloadUrl}`);
      }
    }
  }
}

function checkRequiredString(item, key, label) {
  if (typeof item[key] !== "string" || !item[key].trim()) {
    error(label, `${key} is missing.`);
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
    console.error(`\nFree pose validation failed with ${errors.length} error(s):`);
    for (const message of errors) {
      console.error(`- ${message}`);
    }
  }

  if (warnings.length) {
    console.warn(`\nFree pose validation warning(s): ${warnings.length}`);
    for (const message of warnings) {
      console.warn(`- ${message}`);
    }
  }

  if (!errors.length) {
    console.log(`Free pose validation passed. freePoses=${Array.isArray(freePoses) ? freePoses.length : 0}, warnings=${warnings.length}`);
  }
}
