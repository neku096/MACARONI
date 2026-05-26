import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminWriteError } from "@/lib/admin";
import type { SlideLink } from "@/lib/slide-links";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SavePayload = {
  originalUrl?: string;
  item?: SlideLink;
};

type DeletePayload = {
  url?: string;
};

const slideLinksPath = path.join(process.cwd(), "data", "slide-links.json");

export async function GET() {
  const items = await readSlideLinks();

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

  const items = await readSlideLinks();
  const item = normalizeSlideLink(payload.item as SlideLink);
  const originalUrl = payload.originalUrl?.trim() || "";
  const targetIndex = originalUrl ? items.findIndex((currentItem) => currentItem.url === originalUrl) : -1;

  if (originalUrl && targetIndex < 0) {
    return NextResponse.json({ message: `Slide link not found: ${originalUrl}` }, { status: 404 });
  }

  const validationError = validateSlideLinkAgainstItems(item, items, targetIndex);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  if (targetIndex >= 0) {
    items[targetIndex] = item;
  } else {
    items.push(item);
  }
  await writeSlideLinks(items);

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

  const url = payload.url?.trim() || "";
  if (!url) {
    return NextResponse.json({ message: "Missing url." }, { status: 400 });
  }

  const items = await readSlideLinks();
  const nextItems = items.filter((item) => item.url !== url);
  if (nextItems.length === items.length) {
    return NextResponse.json({ message: `Slide link not found: ${url}` }, { status: 404 });
  }

  await writeSlideLinks(nextItems);

  return NextResponse.json({ items: sortItems(nextItems) });
}

async function readSlideLinks() {
  const raw = await fs.readFile(slideLinksPath, "utf8");
  return JSON.parse(raw) as SlideLink[];
}

async function writeSlideLinks(items: SlideLink[]) {
  await fs.writeFile(slideLinksPath, `${JSON.stringify(sortItems(items), null, 2)}\n`, "utf8");
}

function validatePayload(payload: SavePayload) {
  const item = payload.item;
  if (!item || typeof item !== "object") {
    return "Missing slide link.";
  }

  if (!isNonEmptyString(item.title)) return "Missing title.";
  if (!isNonEmptyString(item.description)) return "Missing description.";
  if (!isHttpUrl(item.url)) return "url must be an absolute http(s) URL.";
  if (!isLocalPath(item.thumbnail)) return "thumbnail must be a local public path.";
  if (!isNonEmptyString(item.category)) return "Missing category.";
  if (!Array.isArray(item.tags) || item.tags.some((tag) => !isNonEmptyString(tag))) {
    return "tags must be a string array.";
  }
  if (!Number.isInteger(item.sortOrder)) return "sortOrder must be an integer.";
  if (typeof item.published !== "boolean") return "published must be a boolean.";
  if (typeof item.openInNewTab !== "boolean") return "openInNewTab must be a boolean.";

  return "";
}

function validateSlideLinkAgainstItems(item: SlideLink, items: SlideLink[], targetIndex: number) {
  if (items.some((currentItem, index) => index !== targetIndex && currentItem.url === item.url)) {
    return `URL already exists: ${item.url}`;
  }

  return "";
}

function normalizeSlideLink(item: SlideLink): SlideLink {
  return {
    ...item,
    title: item.title.trim(),
    description: item.description.trim(),
    url: item.url.trim(),
    thumbnail: item.thumbnail.trim(),
    category: item.category.trim(),
    tags: normalizeStringList(item.tags),
  };
}

function normalizeStringList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function sortItems(items: SlideLink[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isLocalPath(value: unknown): value is string {
  return typeof value === "string" && value.trim().startsWith("/") && !/^https?:\/\//i.test(value);
}
