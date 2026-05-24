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

export type ProductTagLink = {
  href: string;
  label: string;
};

export type ProductCatalogCard = {
  tags: string[];
  subtags: string[];
  popularity: number;
  image: string;
  imageSet: string;
  alt: string;
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
  specs: ProductSpec[];
  salesLinks: SalesLink[];
  relatedIds: string[];
  summaryTags?: string[];
  normalTags?: ProductTagLink[];
  subTags?: ProductTagLink[];
  detailArticles?: string[];
  catalogCards?: ProductCatalogCard[];
};

function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "";

  return (configuredUrl || vercelUrl || "http://localhost:3000").replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl();

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

export function getRelatedProducts(product: Product, limit = 4) {
  return product.relatedIds
    .map((id) => getProductById(id))
    .filter((related): related is Product => Boolean(related?.published))
    .slice(0, limit);
}

export function getLegacyCategoryTag(product: Product) {
  if (product.normalTags?.[0]) {
    const url = new URL(product.normalTags[0].href, siteUrl);
    return url.searchParams.get("tag") || product.category;
  }

  if (product.category === "motion") {
    return "universal";
  }

  if (product.category === "solo-motion") {
    return "solo";
  }

  return product.category;
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
