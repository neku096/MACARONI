import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getPublishedProducts, type Product } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18無料3Dポーズ素材",
  description:
    "VRChatアバターや3Dゲーム制作で使えるUnity向けR18 3Dポーズ・モーション素材を無料配布。対応キャラ一覧、BOOTH作品、DLsiteへの導線をまとめています。",
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/en/index.html",
      "x-default": "/",
    },
  },
};

type HomeProductCard = {
  key: string;
  product: Product;
  title: string;
  coverImage: string;
};

type CharacterCard = {
  slug: string;
  name: string;
  label: string;
  image: string;
};

const characters: CharacterCard[] = [
  { slug: "airi", name: "愛莉", label: "Airi", image: "Airi_standing" },
  { slug: "chocolat", name: "ショコラ", label: "Chocolat", image: "Chocolat_standing" },
  { slug: "eku", name: "エク", label: "Eku", image: "Eku_standing" },
  { slug: "ichigo", name: "イチゴ", label: "イチゴ", image: "ICHIGO_standing" },
  { slug: "kumaly", name: "クマリ", label: "クマリ", image: "KUMALY_standing" },
  { slug: "lumina", name: "ルミナ", label: "ルミナ", image: "LUMINA_standing" },
  { slug: "lasyusha", name: "ラシューシャ", label: "ラシューシャ", image: "Lasyusha_standing" },
  { slug: "manuka", name: "マヌカ", label: "マヌカ", image: "MANUKA_standing" },
  { slug: "mafuyu", name: "真冬", label: "真冬", image: "Mafuyu_standing" },
  { slug: "mayo", name: "まよ", label: "まよ", image: "Mayo_standing" },
  { slug: "milfy", name: "ミルフィ", label: "ミルフィ", image: "Milfy_standing" },
  { slug: "milltina", name: "ミルティナ", label: "ミルティナ", image: "Milltina_standing" },
  { slug: "moe", name: "萌", label: "萌", image: "Moe_standing" },
  { slug: "plum", name: "プラム", label: "プラム", image: "Plum_standing" },
  { slug: "ramune", name: "ラムネ", label: "ラムネ", image: "Ramune_standing" },
  { slug: "ririka", name: "りりか", label: "りりか", image: "Ririka_standing" },
  { slug: "rurune", name: "ルルネ", label: "ルルネ", image: "Rurune_standing" },
  { slug: "selestia", name: "セレスティア", label: "セレスティア", image: "SELESTIA_standing" },
  { slug: "shinano", name: "しなの", label: "しなの", image: "Shinano_standing" },
  { slug: "sio", name: "しお", label: "しお", image: "Sio_standing" },
];

export default function HomePage() {
  const productCards = buildHomeProductCards(getPublishedProducts());
  const productSlides = chunk(productCards, 5);

  return (
    <main>
      <section className="section sales-band sales-band-top" id="works" aria-labelledby="works-title">
        <h1 className="visually-hidden" id="works-title">
          VRChat・Unity向けR18無料3Dポーズ素材
        </h1>
        <div className="slider-shell">
          <div
            className="product-slider"
            data-card-selector=".product-slide"
            data-loop="true"
            data-slider=""
            tabIndex={0}
          >
            {productSlides.map((slide, slideIndex) => (
              <div className="product-slide" key={`product-slide-${slideIndex}`}>
                {slide.map((card, cardIndex) => (
                  <ProductCard
                    coverImage={card.coverImage}
                    key={card.key}
                    priority={slideIndex === 0 && cardIndex === 0}
                    product={card.product}
                    title={card.title}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="slider-dots" aria-label="スライド位置">
            {productSlides.map((_, index) => (
              <button
                aria-label={`${index + 1}枚目のスライド`}
                className={`slider-dot${index === 0 ? " is-active" : ""}`}
                key={`product-dot-${index}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section free-section" id="free" aria-labelledby="free-title">
        <div className="free-panel">
          <div className="section-heading">
            <div>
              <h2 id="free-title">無料アニメーション素材</h2>
              <p className="section-lead">VRChat・Unity向けのR18無料ポーズ素材を、対応アバター別に配布しています。</p>
            </div>
          </div>
          <div className="slider-shell">
            <div
              className="material-grid material-slider"
              data-card-selector=".material-card"
              data-slider=""
              data-slider-rows="2"
              tabIndex={0}
            >
              {characters.map((character) => (
                <Link className="material-card" href={`/character-${character.slug}.html`} key={character.slug}>
                  <div className="thumb has-image standing-thumb">
                    <img
                      alt={`${character.name}の立ち絵`}
                      decoding="async"
                      height="600"
                      loading="lazy"
                      sizes="(max-width: 720px) 46vw, 260px"
                      src={`/images/standing/${character.image}-600.webp`}
                      srcSet={`/images/standing/${character.image}-600.webp 600w, /images/standing/${character.image}-800.webp 800w, /images/standing/${character.image}.webp 1000w`}
                      width="600"
                    />
                  </div>
                  <div className="card-body">
                    <p className="tag">{character.name} / Standing</p>
                    <h3>{character.name}</h3>
                    <p>{character.label}対応の無料配布素材ページへ移動します。</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="slider-dots" aria-label="無料素材スライド位置"></div>
          </div>
        </div>
      </section>

      <section className="section guideline" id="guideline" aria-labelledby="guideline-title">
        <div>
          <h2 id="guideline-title">無料素材の利用条件</h2>
        </div>
        <ul className="rule-list">
          <li>無料配布素材は個人・同人・商用作品、ゲーム制作、VRChat、動画制作に利用できます</li>
          <li>加工・調整・作品への組み込みは自由、クレジット表記は任意です</li>
          <li>素材データそのものの再配布・販売、AI学習への利用は禁止です</li>
          <li>BOOTH / DLsite作品は各商品ページの条件を優先します</li>
          <li>
            詳しい条件は
            <Link className="text-link" href="/terms.html">
              利用規約
            </Link>
            をご確認ください
          </li>
        </ul>
      </section>
    </main>
  );
}

function buildHomeProductCards(products: Product[]): HomeProductCard[] {
  return products.flatMap((product) => {
    if (product.id === "sexy-pose-plum-chocolat") {
      return [
        {
          key: `${product.id}-chocolat`,
          product,
          title: "〖ショコラ用〗セクシーポーズ15種＋表情5種",
          coverImage: "/products/covers/CH-800.webp",
        },
        {
          key: `${product.id}-plum`,
          product,
          title: "〖プラム用〗セクシーポーズ15種＋表情5種",
          coverImage: "/products/covers/PL-800.webp",
        },
      ];
    }

    return [
      {
        key: product.id,
        product,
        title: getLegacyHomeTitle(product),
        coverImage: product.coverImage,
      },
    ];
  });
}

function getLegacyHomeTitle(product: Product) {
  const titles: Record<string, string> = {
    "sexy-pose-kumaly": "〖クマリ用〗セクシーポーズ15種＋表情5種",
    "sexy-pose-ramune": "〖ラムネ用〗セクシーポーズ15種＋表情5種",
    "sexy-pose-eku": "〖エク用〗セクシーポーズ15種＋表情5種",
    "sexy-pose-lumina": "〖ルミナ用〗セクシーポーズ15種＋表情5種",
    "sexy-pose-ichigo": "〖イチゴ用〗セクシーポーズ15種＋表情5種",
    "sexy-pose-shinano": "〖しなの用〗セクシーポーズ20種＋挿入モーション5種",
    "sexy-pose-milltina": "〖ミルティナ用〗セクシーポーズ15種＋表情7種",
    "sexy-pose-rurune": "〖ルルネ用〗セクシーポーズ15種＋表情5種",
    "sexy-motion-vol1": "〖汎用〗セクシーモーション5種類",
    "sexy-attack-motion-vol1": "〖汎用〗セクシーアタックモーション5種類",
    "sexy-motion-attack-vol2": "SexyMotion / Attack vol.2",
    "foot-motion": "〖汎用〗足○キモーション6種類",
    "hand-motion": "〖汎用〗手○キモーション15種類",
    "bj-motion": "〖13アバター対応〗フ〇ラモーション",
    "solo-motion-vol1": "一人エッチモーション vol.1",
    "solo-motion-vol2": "一人エッチモーション vol.2",
    "solo-motion-vol3": "一人エッチモーション vol.3",
    "solo-motion-vol4": "一人エッチモーション vol.4",
    "dosukebe-material": "ドスケベマテリアル",
  };

  return titles[product.id] ?? product.shortTitle;
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
