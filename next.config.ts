import type { NextConfig } from "next";

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
      {
        source: `/en/product-${slug}.html`,
        destination: `/products/${slug}`,
        permanent: false,
      },
    ]);

    return [
      { source: "/booth.html", destination: "/products", permanent: true },
      { source: "/ja/booth.html", destination: "/products", permanent: true },
      { source: "/en/booth.html", destination: "/products", permanent: false },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/ja/index.html", destination: "/", permanent: true },
      { source: "/en/index.html", destination: "/", permanent: false },
      { source: "/ja/characters.html", destination: "/characters.html", permanent: true },
      { source: "/ja/terms.html", destination: "/terms.html", permanent: true },
      { source: "/ja/tips.html", destination: "/tips.html", permanent: true },
      { source: "/ja/links.html", destination: "/links.html", permanent: true },
      { source: "/blog.html", destination: "/tips.html", permanent: true },
      { source: "/ja/blog.html", destination: "/tips.html", permanent: true },
      { source: "/en/blog.html", destination: "/tips.html", permanent: false },
      ...productRedirects,
    ];
  },
};

export default nextConfig;
