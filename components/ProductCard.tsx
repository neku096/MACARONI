import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link className="product-card next-product-card" href={`/products/${product.slug}`} prefetch={false}>
      <img
        className="product-cover"
        src={product.coverImage}
        alt={product.shortTitle}
        width="800"
        height="800"
        loading="lazy"
        decoding="async"
      />
      <strong>{product.shortTitle}</strong>
      <small>
        {product.categoryLabel}
        {product.avatars.length > 0 ? ` / ${product.avatars.join("・")}` : ""}
      </small>
    </Link>
  );
}
