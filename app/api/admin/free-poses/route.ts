import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminAccessError, getAdminWriteError } from "@/lib/admin";
import { freePoseCharacterOptions, type FreePose } from "@/lib/free-poses";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SavePayload = {
  originalSlug?: string;
  item?: FreePose;
};

type DeletePayload = {
  slug?: string;
};

const freePosesPath = path.join(process.cwd(), "data", "free-poses.json");
const characterSet = new Set<string>(freePoseCharacterOptions);

export async function GET(request: Request) {
  const adminAccessError = getAdminAccessError(request);
  if (adminAccessError) {
    return NextResponse.json({ message: adminAccessError }, { status: 403 });
  }

  const items = await readFreePoses();

  return NextResponse.json({ items });
}

export async function PUT(request: Request) {
  const adminWriteError = getAdminWriteError(request);
  if (adminWriteError) {
    return NextResponse.json({ message: adminWriteError }, { status: 403 });
  }

  let payload: SavePayload;
  try {
    payload = (await request.json()) as SavePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const basicValidationError = validatePayload(payload);
  if (basicValidationError) {
    return NextResponse.json({ message: basicValidationError }, { status: 400 });
  }

  const items = await readFreePoses();
  const item = normalizeFreePose(payload.item as FreePose);
  const originalSlug = payload.originalSlug?.trim() || "";
  const targetIndex = originalSlug ? items.findIndex((currentItem) => currentItem.slug === originalSlug) : -1;

  if (originalSlug && targetIndex < 0) {
    return NextResponse.json({ message: `Free pose not found: ${originalSlug}` }, { status: 404 });
  }

  const validationError = validateFreePoseAgainstItems(item, items, targetIndex);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  if (targetIndex >= 0) {
    items[targetIndex] = item;
  } else {
    items.push(item);
  }
  await writeFreePoses(items);

  return NextResponse.json({ item, items: sortItems(items) });
}

export async function DELETE(request: Request) {
  const adminWriteError = getAdminWriteError(request);
  if (adminWriteError) {
    return NextResponse.json({ message: adminWriteError }, { status: 403 });
  }

  let payload: DeletePayload;
  try {
    payload = (await request.json()) as DeletePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const slug = payload.slug?.trim() || "";
  if (!slug) {
    return NextResponse.json({ message: "Missing slug." }, { status: 400 });
  }

  const items = await readFreePoses();
  const nextItems = items.filter((item) => item.slug !== slug);
  if (nextItems.length === items.length) {
    return NextResponse.json({ message: `Free pose not found: ${slug}` }, { status: 404 });
  }

  await writeFreePoses(nextItems);

  return NextResponse.json({ items: sortItems(nextItems) });
}

async function readFreePoses() {
  const raw = await fs.readFile(freePosesPath, "utf8");
  return JSON.parse(raw) as FreePose[];
}

async function writeFreePoses(items: FreePose[]) {
  await fs.writeFile(freePosesPath, `${JSON.stringify(sortItems(items), null, 2)}\n`, "utf8");
}

function validatePayload(payload: SavePayload) {
  const item = payload.item;
  if (!item || typeof item !== "object") {
    return "Missing free pose.";
  }

  if (!isNonEmptyString(item.title)) return "Missing title.";
  if (!isSlug(item.slug)) return "Slug must use lowercase letters, numbers, and hyphens.";
  if (!isNonEmptyString(item.description)) return "Missing description.";
  if (!characterSet.has(item.character)) return "Character must be selected from the existing character list.";
  if (!isLocalPath(item.thumbnail)) return "thumbnail must be a local public path.";
  if (!isLocalPath(item.downloadUrl)) return "downloadUrl must be a local public path.";
  if (!Array.isArray(item.tags) || item.tags.some((tag) => !isNonEmptyString(tag))) {
    return "tags must be a string array.";
  }
  if (!Number.isInteger(item.sortOrder)) return "sortOrder must be an integer.";
  if (typeof item.published !== "boolean") return "published must be a boolean.";
  if (typeof item.noindex !== "boolean") return "noindex must be a boolean.";
  if (
    item.gallery !== undefined &&
    (!Array.isArray(item.gallery) ||
      item.gallery.some((image) => !isNonEmptyString(image.src) || !isNonEmptyString(image.alt) || !isLocalPath(image.src)))
  ) {
    return "gallery must be src/alt local image entries.";
  }

  return "";
}

function validateFreePoseAgainstItems(item: FreePose, items: FreePose[], targetIndex: number) {
  if (items.some((currentItem, index) => index !== targetIndex && currentItem.slug === item.slug)) {
    return `Slug already exists: ${item.slug}`;
  }

  return "";
}

function normalizeFreePose(item: FreePose): FreePose {
  const normalized = {
    ...item,
    title: item.title.trim(),
    slug: item.slug.trim(),
    description: item.description.trim(),
    character: item.character.trim(),
    thumbnail: item.thumbnail.trim(),
    downloadUrl: item.downloadUrl.trim(),
    tags: normalizeStringList(item.tags),
    gallery: item.gallery?.filter((image) => image.src.trim() && image.alt.trim()).map((image) => ({
      src: image.src.trim(),
      alt: image.alt.trim(),
    })),
  };

  if (!normalized.gallery?.length) {
    delete normalized.gallery;
  }

  return normalized;
}

function normalizeStringList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function sortItems(items: FreePose[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function isLocalPath(value: unknown): value is string {
  return typeof value === "string" && value.trim().startsWith("/") && !/^https?:\/\//i.test(value);
}
