import productsData from "@/data/products.json";

export type ProductCategory = "pose" | "motion" | "solo-motion" | "material";

export type SalesLink = {
  label: "BOOTH" | "DLsite" | "外部販売" | string;
  url: string;
  primary?: boolean;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type GalleryImage = {
  src: string;
  thumb: string;
  alt: string;
};

export type ProductDetailSection = {
  title: string;
  html: string;
};

export type Product = {
  id: string;
  slug: string;
  legacyPath: string;
  published: boolean;
  title: string;
  shortTitle: string;
  description: string;
  category: ProductCategory;
  categoryLabel: string;
  tags: string[];
  avatars: string[];
  price: string;
  coverImage: string;
  ogImage: string;
  galleryPrefix: string;
  galleryCount: number;
  galleryNumbers?: number[];
  galleryImages?: GalleryImage[];
  summaryTags?: string[];
  purchaseNote?: string;
  detailSections?: ProductDetailSection[];
  specs: ProductSpec[];
  salesLinks: SalesLink[];
  relatedIds: string[];
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://neku096.github.io/MACARONI";

const products = productsData as Product[];

export function getAllProducts() {
  return products;
}

export function getPublishedProducts() {
  return products.filter((product) => product.published);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductUrl(product: Product) {
  return `/products/${product.slug}`;
}

export function getAbsoluteProductUrl(product: Product) {
  return `${siteUrl}${getProductUrl(product)}`;
}

export function getGalleryImages(product: Product): GalleryImage[] {
  if (product.galleryImages?.length) {
    return product.galleryImages.map((image) => ({
      src: normalizeAssetPath(image.src),
      thumb: normalizeAssetPath(image.thumb),
      alt: image.alt,
    }));
  }

  const numbers =
    product.galleryNumbers ?? Array.from({ length: product.galleryCount }, (_, index) => index + 1);

  return numbers.map((galleryNumber, index) => {
    const number = String(galleryNumber).padStart(2, "0");
    return {
      src: `/products/${product.slug}/${product.galleryPrefix}-${number}.webp`,
      thumb: `/products/${product.slug}/${product.galleryPrefix}-${number}-600.webp`,
      alt: `${product.shortTitle} 商品画像 ${index + 1}`,
    };
  });
}

export function getRelatedProducts(product: Product, limit = 5) {
  const published = getPublishedProducts();
  const manuallySelected = product.relatedIds
    .map((id) => getProductById(id))
    .filter((related): related is Product => Boolean(related?.published));

  if (manuallySelected.length > 0) {
    return manuallySelected.slice(0, limit);
  }

  const selectedIds = new Set([product.id, ...manuallySelected.map((related) => related.id)]);
  const scored = published
    .filter((candidate) => !selectedIds.has(candidate.id))
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => product.tags.includes(tag)).length;
      const sharedAvatars = candidate.avatars.filter((avatar) => product.avatars.includes(avatar)).length;
      const categoryScore = candidate.category === product.category ? 4 : 0;
      return {
        product: candidate,
        score: categoryScore + sharedTags * 2 + sharedAvatars * 3,
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.shortTitle.localeCompare(b.product.shortTitle, "ja"));

  return [...manuallySelected, ...scored.map((entry) => entry.product)].slice(0, limit);
}

function normalizeAssetPath(assetPath: string) {
  if (!assetPath || assetPath.startsWith("/") || /^https?:\/\//.test(assetPath)) {
    return assetPath;
  }

  return `/${assetPath.replace(/^public\//, "")}`;
}

export function getFilterOptions() {
  const published = getPublishedProducts();
  const categories = uniqueBy(
    published.map((product) => ({ id: product.category, label: product.categoryLabel })),
    (category) => category.id,
  );
  const tags = Array.from(new Set(published.flatMap((product) => product.tags))).sort((a, b) =>
    a.localeCompare(b, "ja"),
  );
  const avatars = Array.from(new Set(published.flatMap((product) => product.avatars))).sort((a, b) =>
    a.localeCompare(b, "ja"),
  );

  return { categories, tags, avatars };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: `${siteUrl}${product.ogImage}`,
    brand: {
      "@type": "Brand",
      name: "マカロニ",
    },
    category: product.categoryLabel,
    isFamilyFriendly: false,
    offers: product.salesLinks.map((link) => ({
      "@type": "Offer",
      url: link.url,
      priceCurrency: "JPY",
      availability: "https://schema.org/InStock",
    })),
  };
}

function uniqueBy<T>(items: T[], key: (item: T) => string) {
  const map = new Map<string, T>();
  for (const item of items) {
    const itemKey = key(item);
    if (!map.has(itemKey)) {
      map.set(itemKey, item);
    }
  }
  return Array.from(map.values());
}
