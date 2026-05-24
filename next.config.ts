import type { NextConfig } from "next";

const distDir = process.env.NEXT_DIST_DIR?.trim();
const tsconfigPath = process.env.NEXT_TSCONFIG_PATH?.trim();

const productSlugs = [
  "sexy-pose-kumaly",
  "sexy-pose-plum-chocolat",
  "sexy-pose-ramune",
  "sexy-pose-eku",
  "sexy-pose-lumina",
  "sexy-pose-ichigo",
  "sexy-pose-shinano",
  "sexy-pose-milltina",
  "sexy-pose-rurune",
  "sexy-motion-vol1",
  "sexy-attack-motion-vol1",
  "sexy-motion-attack-vol2",
  "foot-motion",
  "hand-motion",
  "bj-motion",
  "solo-motion-vol1",
  "solo-motion-vol2",
  "solo-motion-vol3",
  "solo-motion-vol4",
  "dosukebe-material",
];

const nextConfig: NextConfig = {
  ...(distDir ? { distDir } : {}),
  ...(tsconfigPath ? { typescript: { tsconfigPath } } : {}),
  async redirects() {
    const productRedirects = productSlugs.flatMap((slug) => [
      {
        source: `/product-${slug}.html`,
        destination: `/products/${slug}`,
        permanent: true,
      },
      {
        source: `/ja/product-${slug}.html`,
        destination: `/products/${slug}`,
        permanent: true,
      },
    ]);

    return [
      { source: "/en", destination: "/en/index.html", permanent: false },
      { source: "/booth.html", destination: "/products", permanent: true },
      { source: "/ja/booth.html", destination: "/products", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/ja/index.html", destination: "/", permanent: true },
      { source: "/products/dark-voice-material", destination: "/products/dosukebe-material", permanent: false },
      { source: "/product-dark-voice-material.html", destination: "/products/dosukebe-material", permanent: true },
      { source: "/ja/product-dark-voice-material.html", destination: "/products/dosukebe-material", permanent: true },
      ...productRedirects,
      { source: "/ja/:path*", destination: "/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
