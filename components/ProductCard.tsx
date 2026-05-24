import Link from "next/link";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  variant?: "card" | "booth-thumb";
  title?: string;
  label?: string;
  coverImage?: string;
  alt?: string;
  href?: string;
  priority?: boolean;
  boothTags?: string;
  boothSubtags?: string;
  popularity?: number;
};

export function ProductCard({
  product,
  variant = "card",
  title,
  label,
  coverImage,
  alt,
  href,
  priority = false,
  boothTags,
  boothSubtags,
  popularity,
}: ProductCardProps) {
  const cardTitle = title ?? product.shortTitle;
  const cardLabel = label ?? getLegacyProductLabel(product);
  const cardHref = href ?? `/products/${product.slug}`;
  const image = getCoverSet(coverImage ?? product.coverImage);
  const imageAlt = alt ?? cardTitle;

  if (variant === "booth-thumb") {
    return (
      <Link
        className="booth-list-thumb"
        href={cardHref}
        prefetch={false}
        data-booth-tags={boothTags}
        data-booth-subtags={boothSubtags}
        data-popularity={popularity}
      >
        <img
          src={image.thumb}
          srcSet={image.srcSet}
          sizes="(max-width: 720px) 46vw, (max-width: 1200px) 30vw, 420px"
          alt={`${imageAlt} VRChat・Unity向け3Dポーズ/モーション作品`}
          width={600}
          height={600}
          loading={priority ? undefined : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </Link>
    );
  }

  return (
    <Link className="product-card" href={cardHref} prefetch={false}>
      <img
        className="product-cover"
        src={image.thumb}
        srcSet={image.srcSet}
        sizes="(max-width: 720px) 52vw, 260px"
        alt={imageAlt}
        width={600}
        height={600}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
      />
      <strong>{cardTitle}</strong>
      <small>{cardLabel}</small>
    </Link>
  );
}

function getCoverSet(src: string) {
  const thumb = src.includes("-800.webp") ? src.replace("-800.webp", "-600.webp") : src;
  const medium = thumb.includes("-600.webp") ? thumb.replace("-600.webp", "-800.webp") : thumb;
  const full = thumb.includes("-600.webp") ? thumb.replace("-600.webp", ".webp") : thumb;

  return {
    thumb,
    srcSet: `${thumb} 600w, ${medium} 800w, ${full} 1000w`,
  };
}

function getLegacyProductLabel(product: Product) {
  switch (product.category) {
    case "pose":
      return "SexyPose";
    case "motion":
      return "SexyMotion";
    case "solo-motion":
      return "Solo_H";
    case "material":
      return "Others";
    default:
      return product.categoryLabel;
  }
}
