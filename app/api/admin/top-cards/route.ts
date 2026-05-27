import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getAdminAccessError, getAdminWriteError } from "@/lib/admin";
import { getProductBySlug } from "@/lib/products";
import type { TopCard } from "@/lib/top-cards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SavePayload = {
  originalUrl?: string;
  item?: TopCard;
};

type DeletePayload = {
  url?: string;
};

const topCardsPath = path.join(process.cwd(), "data", "top-cards.json");

export async function GET(request: Request) {
  const adminAccessError = getAdminAccessError(request);
  if (adminAccessError) {
    return NextResponse.json({ message: adminAccessError }, { status: 403 });
  }

  const items = await readTopCards();

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

  const items = await readTopCards();
  const item = normalizeTopCard(payload.item as TopCard);
  const originalUrl = payload.originalUrl?.trim() || "";
  const targetIndex = originalUrl ? items.findIndex((currentItem) => currentItem.url === originalUrl) : -1;

  if (originalUrl && targetIndex < 0) {
    return NextResponse.json({ message: `Top card not found: ${originalUrl}` }, { status: 404 });
  }

  const validationError = validateTopCardAgainstItems(item, items, targetIndex);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  if (targetIndex >= 0) {
    items[targetIndex] = item;
  } else {
    items.push(item);
  }
  await writeTopCards(items);

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

  const items = await readTopCards();
  const nextItems = items.filter((item) => item.url !== url);
  if (nextItems.length === items.length) {
    return NextResponse.json({ message: `Top card not found: ${url}` }, { status: 404 });
  }

  await writeTopCards(nextItems);

  return NextResponse.json({ items: sortItems(nextItems) });
}

async function readTopCards() {
  const raw = await fs.readFile(topCardsPath, "utf8");
  return JSON.parse(raw) as TopCard[];
}

async function writeTopCards(items: TopCard[]) {
  await fs.writeFile(topCardsPath, `${JSON.stringify(sortItems(items), null, 2)}\n`, "utf8");
}

function validatePayload(payload: SavePayload) {
  const item = payload.item;
  if (!item || typeof item !== "object") {
    return "Missing top card.";
  }

  if (!isNonEmptyString(item.title)) return "Missing title.";
  if (!isNonEmptyString(item.description)) return "Missing description.";
  if (!isProductDestinationUrl(item.url)) return "url must be a product LP path (/products/<slug>) or a BOOTH item URL.";
  if (!isLocalPath(item.thumbnail)) return "thumbnail must be a local public path.";
  if (!isNonEmptyString(item.category)) return "Missing category.";
  if (!Array.isArray(item.tags) || item.tags.some((tag) => !isNonEmptyString(tag))) {
    return "tags must be a string array.";
  }
  if (item.sourceProductSlug !== undefined && !isNonEmptyString(item.sourceProductSlug)) {
    return "sourceProductSlug must be a non-empty string.";
  }
  if (!Number.isInteger(item.sortOrder)) return "sortOrder must be an integer.";
  if (typeof item.published !== "boolean") return "published must be a boolean.";
  if (typeof item.openInNewTab !== "boolean") return "openInNewTab must be a boolean.";

  return "";
}

function validateTopCardAgainstItems(item: TopCard, items: TopCard[], targetIndex: number) {
  if (items.some((currentItem, index) => index !== targetIndex && currentItem.url === item.url)) {
    return `URL already exists: ${item.url}`;
  }
  if (item.sourceProductSlug && !getProductBySlug(item.sourceProductSlug)) {
    return `sourceProductSlug not found in products.json: ${item.sourceProductSlug}`;
  }

  return "";
}

function normalizeTopCard(item: TopCard): TopCard {
  return {
    ...item,
    title: item.title.trim(),
    description: item.description.trim(),
    url: item.url.trim(),
    thumbnail: item.thumbnail.trim(),
    category: item.category.trim(),
    tags: normalizeStringList(item.tags),
    sourceProductSlug: item.sourceProductSlug?.trim() || undefined,
  };
}

function normalizeStringList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function sortItems(items: TopCard[]) {
  return [...items].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isProductDestinationUrl(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const trimmedValue = value.trim();
  if (/^\/products\/[a-z0-9-]+\/?$/i.test(trimmedValue)) {
    return true;
  }

  return isBoothItemUrl(trimmedValue);
}

function isBoothItemUrl(value: string) {
  try {
    const url = new URL(value);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    const isBoothHost = url.hostname === "booth.pm" || url.hostname.endsWith(".booth.pm");
    return isHttp && isBoothHost && url.pathname.startsWith("/items/");
  } catch {
    return false;
  }
}

function isLocalPath(value: unknown): value is string {
  return typeof value === "string" && value.trim().startsWith("/") && !/^https?:\/\//i.test(value);
}
