"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/products";

type ProductGalleryProps = {
  images: GalleryImage[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxThumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartX = useRef<number | null>(null);
  const safeImages = images.length > 0 ? images : [];
  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    document.body.classList.add("product-lightbox-open");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => getPreviousIndex(current, safeImages.length));
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => getNextIndex(current, safeImages.length));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("product-lightbox-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen, safeImages.length]);

  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
    lightboxThumbRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  if (!activeImage) {
    return null;
  }

  function showPreviousImage() {
    setActiveIndex((current) => getPreviousIndex(current, safeImages.length));
  }

  function showNextImage() {
    setActiveIndex((current) => getNextIndex(current, safeImages.length));
  }

  function handleLightboxBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setIsLightboxOpen(false);
    }
  }

  function handleStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      setIsLightboxOpen(false);
    }
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(deltaX) < 42) {
      return;
    }

    if (deltaX > 0) {
      showPreviousImage();
    } else {
      showNextImage();
    }
  }

  return (
    <div className="product-gallery" aria-label="商品画像ギャラリー">
      <figure className="product-main-figure">
        <button
          className="product-main-button"
          type="button"
          data-gallery-open
          aria-label={`${title}の商品画像を拡大表示`}
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={activeImage.src}
            srcSet={`${activeImage.thumb} 600w, ${activeImage.src} 1000w`}
            sizes="(max-width: 720px) 100vw, 620px"
            width="1000"
            height="1000"
            alt={activeImage.alt}
            decoding="async"
            fetchPriority="high"
            data-product-main-image
          />
        </button>
      </figure>
      <div className="product-thumbnail-slider" aria-label="サムネイルスライダー">
        <button
          className="product-thumbnail-arrow"
          type="button"
          data-gallery-inline-prev
          aria-label="前のサムネイルへ"
          onClick={showPreviousImage}
        >
          ‹
        </button>
        <div className="product-thumbnails next-product-thumbnails" data-gallery-inline-thumbs aria-label="サムネイル">
          {safeImages.map((image, index) => (
            <button
              className={`product-thumbnail${index === activeIndex ? " is-active" : ""}`}
              key={`${image.thumb}-${index}`}
              type="button"
              aria-label={`${index + 1}枚目の画像を表示`}
              data-gallery-thumb={index}
              ref={(element) => {
                thumbnailRefs.current[index] = element;
              }}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image.thumb} alt={`${image.alt} サムネイル`} width="600" height="600" loading="lazy" />
            </button>
          ))}
        </div>
        <button
          className="product-thumbnail-arrow"
          type="button"
          data-gallery-inline-next
          aria-label="次のサムネイルへ"
          onClick={showNextImage}
        >
          ›
        </button>
      </div>
      <p className="product-media-note">クリックして拡大できます。</p>

      <div
        className="product-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="商品画像ギャラリー"
        hidden={!isLightboxOpen}
        onClick={handleLightboxBackdropClick}
      >
        <div className="product-lightbox-stage" onClick={handleStageClick}>
          <button
            className="product-lightbox-nav"
            type="button"
            data-gallery-prev
            aria-label="前の画像へ"
            onClick={showPreviousImage}
          >
            ‹
          </button>
          <div
            className="product-lightbox-image-wrap"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="product-lightbox-close"
              type="button"
              data-gallery-close
              aria-label="拡大表示を閉じる"
              onClick={() => setIsLightboxOpen(false)}
            >
              ×
            </button>
            <img
              className="product-lightbox-image"
              src={activeImage.src}
              alt={activeImage.alt}
              data-gallery-image
              width="1000"
              height="1000"
              decoding="async"
            />
          </div>
          <button
            className="product-lightbox-nav"
            type="button"
            data-gallery-next
            aria-label="次の画像へ"
            onClick={showNextImage}
          >
            ›
          </button>
        </div>
        <aside className="product-lightbox-side" aria-label="画像一覧">
          <p className="product-lightbox-title">{title}</p>
          <p className="product-lightbox-count">
            {activeIndex + 1} / {safeImages.length}
          </p>
          <div className="product-lightbox-thumbs" aria-label="拡大画像のサムネイル">
            {safeImages.map((image, index) => (
              <button
                className={`product-lightbox-thumb${index === activeIndex ? " is-active" : ""}`}
                key={`${image.thumb}-lightbox-${index}`}
                type="button"
                aria-label={`${index + 1}枚目の画像を表示`}
                data-gallery-lightbox-thumb={index}
                ref={(element) => {
                  lightboxThumbRefs.current[index] = element;
                }}
                onClick={() => setActiveIndex(index)}
              >
                <img src={image.thumb} alt={`${image.alt} サムネイル`} width="600" height="600" loading="lazy" />
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function getPreviousIndex(current: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return (current - 1 + total) % total;
}

function getNextIndex(current: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return (current + 1) % total;
}
