import fs from "node:fs";
import path from "node:path";

// Migration helper: extracts product detail data from the root legacy HTML files
// into data/products.json. It is not part of the Next.js runtime.
const root = process.cwd();
const dataPath = path.join(root, "data", "products.json");
const boothPath = path.join(root, "booth.html");

const products = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const slugByLegacyPath = new Map(products.map((product) => [product.legacyPath, product.slug]));
const idByLegacyPath = new Map(products.map((product) => [product.legacyPath, product.id]));

const normalizeInternalHref = (href) => {
  if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("/")) {
    return href;
  }

  if (href.startsWith("booth.html")) {
    return href.replace(/^booth\.html/, "/products");
  }

  const productId = idByLegacyPath.get(href);
  if (productId) {
    return `/products/${productId}`;
  }

  return `/${href}`;
};

const normalizeHtml = (html) =>
  html
    .replace(/href="([^"]+)"/g, (_match, href) => `href="${normalizeInternalHref(href)}"`)
    .replace(/src="images\//g, 'src="/images/')
    .replace(/srcset="images\//g, 'srcset="/images/')
    .replace(/, images\//g, ", /images/")
    .trim();

const normalizeImagePath = (value) => {
  if (!value) {
    return value;
  }

  if (value.startsWith("images/linksamune/")) {
    const filename = path.posix.basename(value);
    return `/products/covers/${filename}`;
  }

  if (value.startsWith("images/")) {
    return `/${value}`;
  }

  return value;
};

const normalizeSrcset = (value) =>
  value
    .split(",")
    .map((part) => {
      const [src, width] = part.trim().split(/\s+/);
      return [normalizeImagePath(src), width].filter(Boolean).join(" ");
    })
    .join(", ");

const extractSection = (html, className) => {
  const startPattern = `<section class="section ${className}`;
  const start = html.indexOf(startPattern);
  if (start === -1) {
    return "";
  }

  const nextSection = html.indexOf("\n      <section", start + 1);
  const endMain = html.indexOf("\n    </main>", start + 1);
  const end = nextSection === -1 ? endMain : nextSection;
  return end === -1 ? html.slice(start) : html.slice(start, end);
};

const extractArticles = (html) => {
  const section = extractSection(html, "product-detail-section");
  return [...section.matchAll(/<article class="product-detail-block booth-description">([\s\S]*?)<\/article>/g)].map(
    (match) => normalizeHtml(match[1]),
  );
};

const extractTagLinks = (html) => {
  const section = extractSection(html, "product-tag-section");
  const lists = [...section.matchAll(/<div class="product-tag-list">([\s\S]*?)<\/div>/g)].map((match) => match[1]);

  return lists.map((list) =>
    [...list.matchAll(/<a class="product-tag" href="([^"]+)">([\s\S]*?)<\/a>/g)].map((match) => ({
      href: normalizeInternalHref(match[1]),
      label: match[2].replace(/<[^>]+>/g, "").trim(),
    })),
  );
};

const extractSummaryTags = (html) => {
  const match = html.match(/<div class="product-summary-tags"[^>]*>([\s\S]*?)<\/div>/);
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/<span>([\s\S]*?)<\/span>/g)].map((tag) => tag[1].trim());
};

const extractRelatedIds = (html) => {
  const section = extractSection(html, "product-related-section");
  return [...section.matchAll(/href="(product-[^"]+\.html)"/g)]
    .map((match) => idByLegacyPath.get(match[1]))
    .filter(Boolean);
};

for (const product of products) {
  const productHtmlPath = path.join(root, product.legacyPath);
  if (!fs.existsSync(productHtmlPath)) {
    continue;
  }

  const html = fs.readFileSync(productHtmlPath, "utf8");
  const [normalTags = [], subTags = []] = extractTagLinks(html);
  const detailArticles = extractArticles(html);
  const summaryTags = extractSummaryTags(html);
  const relatedIds = extractRelatedIds(html).filter((id) => id !== product.id);

  product.summaryTags = summaryTags;
  product.normalTags = normalTags;
  product.subTags = subTags;
  product.detailArticles = detailArticles;
  product.relatedIds = relatedIds;
}

const boothHtml = fs.readFileSync(boothPath, "utf8");
const catalogCardsBySlug = new Map();

for (const match of boothHtml.matchAll(/<a class="booth-list-thumb"([^>]*)href="([^"]+)"[^>]*>\s*<img([^>]*)>/g)) {
  const attributes = match[1];
  const href = match[2];
  const imageAttributes = match[3];
  const slug = slugByLegacyPath.get(href);

  if (!slug) {
    continue;
  }

  const getAttr = (source, name) => source.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? "";
  const src = getAttr(imageAttributes, "src");
  const srcset = getAttr(imageAttributes, "srcset");
  const alt = getAttr(imageAttributes, "alt");

  const card = {
    tags: getAttr(attributes, "data-booth-tags").trim().split(/\s+/).filter(Boolean),
    subtags: getAttr(attributes, "data-booth-subtags").trim().split(/\s+/).filter(Boolean),
    popularity: Number(getAttr(attributes, "data-popularity") || 0),
    image: normalizeImagePath(src),
    imageSet: normalizeSrcset(srcset),
    alt,
  };

  const cards = catalogCardsBySlug.get(slug) ?? [];
  cards.push(card);
  catalogCardsBySlug.set(slug, cards);
}

for (const product of products) {
  product.catalogCards = catalogCardsBySlug.get(product.slug) ?? [];
}

fs.writeFileSync(dataPath, `${JSON.stringify(products, null, 2)}\n`);
