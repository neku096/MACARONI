import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import type { Product, ProductCategory } from "@/lib/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EditableProduct = Product & {
  noindex?: boolean;
};

type SavePayload = {
  originalId?: string;
  product?: EditableProduct;
};

const categories = new Set<ProductCategory>(["pose", "motion", "solo-motion", "material"]);
const productsPath = path.join(process.cwd(), "data", "products.json");

export async function GET() {
  const products = await readProducts();

  return NextResponse.json({ products });
}

export async function PUT(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Admin writes are disabled in production." }, { status: 403 });
  }

  if (!isLocalRequest(request)) {
    return NextResponse.json(
      { message: "Admin writes are only available from a local host." },
      { status: 403 },
    );
  }

  let payload: SavePayload;
  try {
    payload = (await request.json()) as SavePayload;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body." }, { status: 400 });
  }

  const validationError = validatePayload(payload);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const products = await readProducts();
  const product = normalizeProduct(payload.product as EditableProduct);
  const originalId = payload.originalId || product.id;
  const targetIndex = products.findIndex((item) => item.id === originalId);

  if (targetIndex < 0) {
    return NextResponse.json({ message: `Product not found: ${originalId}` }, { status: 404 });
  }

  if (product.id !== originalId) {
    return NextResponse.json({ message: "Changing product id is not supported." }, { status: 400 });
  }

  if (products.some((item) => item.id !== originalId && item.slug === product.slug)) {
    return NextResponse.json({ message: `Slug already exists: ${product.slug}` }, { status: 400 });
  }

  products[targetIndex] = product;
  await writeProducts(products);

  return NextResponse.json({ product, products });
}

async function readProducts() {
  const raw = await fs.readFile(productsPath, "utf8");
  return JSON.parse(raw) as EditableProduct[];
}

async function writeProducts(products: EditableProduct[]) {
  await fs.writeFile(productsPath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

function isLocalRequest(request: Request) {
  if (process.env.NODE_ENV !== "production" && process.env.MACARONI_ADMIN_WRITE === "1") {
    return true;
  }

  const hostname = new URL(request.url).hostname.toLowerCase();
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

function validatePayload(payload: SavePayload) {
  const product = payload.product;
  if (!product || typeof product !== "object") {
    return "Missing product.";
  }

  if (!isNonEmptyString(product.id)) return "Missing product id.";
  if (!isSlug(product.slug)) return "Slug must use lowercase letters, numbers, and hyphens.";
  if (!isNonEmptyString(product.title)) return "Missing title.";
  if (!isNonEmptyString(product.description)) return "Missing description.";
  if (!categories.has(product.category)) return "Unsupported category.";
  if (!Array.isArray(product.tags) || product.tags.some((tag) => !isNonEmptyString(tag))) {
    return "Tags must be a string array.";
  }
  if (typeof product.published !== "boolean") return "published must be a boolean.";
  if (product.noindex !== undefined && typeof product.noindex !== "boolean") {
    return "noindex must be a boolean.";
  }
  if (!isNonEmptyString(product.galleryPrefix)) return "Missing galleryPrefix.";
  if (!Number.isInteger(product.galleryCount) || product.galleryCount < 0 || product.galleryCount > 100) {
    return "galleryCount must be an integer from 0 to 100.";
  }
  if (
    product.galleryNumbers !== undefined &&
    (!Array.isArray(product.galleryNumbers) ||
      product.galleryNumbers.some((number) => !Number.isInteger(number) || number < 1 || number > 999))
  ) {
    return "galleryNumbers must be positive integers.";
  }
  if (product.detailArticles !== undefined && product.detailArticles.some((article) => typeof article !== "string")) {
    return "detailArticles must be a string array.";
  }

  return "";
}

function normalizeProduct(product: EditableProduct): EditableProduct {
  const normalized = {
    ...product,
    tags: normalizeStringList(product.tags),
    galleryNumbers: product.galleryNumbers?.length ? product.galleryNumbers : undefined,
  };

  if (!normalized.noindex) {
    delete normalized.noindex;
  }

  return normalized;
}

function normalizeStringList(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSlug(value: unknown): value is string {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}
