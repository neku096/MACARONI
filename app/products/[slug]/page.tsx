import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import {
  getAbsoluteProductUrl,
  getProductBySlug,
  getProductUrl,
  getPublishedProducts,
  productJsonLd,
  siteUrl,
} from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedProducts().map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product?.published) {
    return {
      title: "商品が見つかりません",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: product.shortTitle,
    description: product.description,
    alternates: {
      canonical: getProductUrl(product),
    },
    openGraph: {
      type: "website",
      url: getAbsoluteProductUrl(product),
      title: `${product.shortTitle} | マカロニ`,
      description: product.description,
      siteName: "マカロニ",
      locale: "ja_JP",
      images: [
        {
          url: `${siteUrl}${product.ogImage}`,
          width: 1000,
          height: 1000,
          alt: product.shortTitle,
          type: "image/webp",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.shortTitle} | マカロニ`,
      description: product.description,
      images: [`${siteUrl}${product.ogImage}`],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product?.published) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
