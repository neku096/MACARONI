import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  image?: string;
  imageSet?: string;
  alt?: string;
  small?: string;
};

export function ProductCard({ product, image, imageSet, alt, small }: ProductCardProps) {
  const cover = image ?? product.coverImage.replace("-800.webp", "-600.webp");
  const srcSet =
    imageSet ??
    `${product.coverImage.replace("-800.webp", "-600.webp")} 600w, ${product.coverImage} 800w, ${product.ogImage} 1000w`;

  return (
    <a className="product-card" href={`/products/${product.slug}`}>
      <img
        className="product-cover"
        src={cover}
        alt={alt ?? `${product.shortTitle}の商品サムネイル`}
        srcSet={srcSet}
        sizes="(max-width: 720px) 52vw, 260px"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
      />
      <strong>{product.shortTitle}</strong>
      <small>{small ?? `${product.categoryLabel}${product.avatars.length > 0 ? ` / ${product.avatars.join("・")}` : ""}`}</small>
    </a>
  );
}
