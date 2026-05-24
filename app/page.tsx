import type { Metadata } from "next";
import { getPublishedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "VRChat・Unity向けR18無料3Dポーズ素材",
  description: "VRChat・Unity向けのR18 3Dポーズ、モーション、マテリアル素材を一覧で確認できるマカロニの商品サイトです。",
};

const characters = [
  ["airi", "愛莉", "Airi_standing"],
  ["chocolat", "ショコラ", "Chocolat_standing"],
  ["eku", "エク", "Eku_standing"],
  ["ichigo", "イチゴ", "ICHIGO_standing"],
  ["kumaly", "クマリ", "KUMALY_standing"],
  ["lumina", "ルミナ", "LUMINA_standing"],
  ["lasyusha", "ラシューシャ", "Lasyusha_standing"],
  ["manuka", "マヌカ", "MANUKA_standing"],
  ["mafuyu", "真冬", "Mafuyu_standing"],
  ["mayo", "まよ", "Mayo_standing"],
  ["milfy", "ミルフィ", "Milfy_standing"],
  ["milltina", "ミルティナ", "Milltina_standing"],
  ["moe", "萌", "Moe_standing"],
  ["plum", "プラム", "Plum_standing"],
  ["ramune", "ラムネ", "Ramune_standing"],
  ["ririka", "りりか", "Ririka_standing"],
  ["rurune", "ルルネ", "Rurune_standing"],
  ["selestia", "セレスティア", "SELESTIA_standing"],
  ["shinano", "しなの", "Shinano_standing"],
  ["sio", "しお", "Sio_standing"],
] as const;

type SliderEntry = {
  href: string;
  image: string;
  imageSet: string;
  alt: string;
  title: string;
  label: string;
};

export default function HomePage() {
  const entries = getPublishedProducts().flatMap<SliderEntry>((product) =>
    (product.catalogCards ?? []).map((card) => ({
      href: `/products/${product.slug}`,
      image: card.image,
      imageSet: card.imageSet,
      alt: card.alt,
      title: card.alt.replace(/\s*VRChat・Unity向け3Dポーズ\/モーション作品$/, ""),
      label: getSliderLabel(card.tags),
    })),
  );
  const slides = chunk(entries, 5);

  return (
    <main>
      <section className="section sales-band sales-band-top" id="works" aria-labelledby="works-title">
        <h1 className="visually-hidden" id="works-title">
          VRChat・Unity向けR18無料3Dポーズ素材
        </h1>
        <div className="slider-shell">
          <div className="product-slider" data-slider="" data-card-selector=".product-slide" data-loop="true" tabIndex={0}>
            {slides.map((slide, slideIndex) => (
              <div className="product-slide" key={slideIndex}>
                {slide.map((entry, entryIndex) => (
                  <a className="product-card" href={entry.href} key={`${entry.href}-${entry.image}`}>
                    <img
                      className="product-cover"
                      src={entry.image}
                      alt={entry.alt}
                      srcSet={entry.imageSet}
                      sizes="(max-width: 720px) 52vw, 260px"
                      width="600"
                      height="600"
                      loading={slideIndex === 0 && entryIndex === 0 ? undefined : "lazy"}
                      decoding="async"
                      fetchPriority={slideIndex === 0 && entryIndex === 0 ? "high" : undefined}
                    />
                    <strong>{entry.title}</strong>
                    <small>{entry.label}</small>
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="slider-dots" data-slider-dots="" aria-label="スライド位置" />
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
              data-slider=""
              data-card-selector=".material-card"
              data-slider-rows="2"
              tabIndex={0}
            >
              {characters.map(([slug, name, image]) => (
                <a className="material-card" href={`/character-${slug}.html`} key={slug}>
                  <div className="thumb has-image standing-thumb">
                    <img
                      src={`/images/standing/${image}-600.webp`}
                      alt={`${name}の立ち絵`}
                      srcSet={`/images/standing/${image}-600.webp 600w, /images/standing/${image}-800.webp 800w, /images/standing/${image}.webp 1000w`}
                      sizes="(max-width: 720px) 46vw, 260px"
                      width="600"
                      height="600"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="card-body">
                    <p className="tag">{name} / Standing</p>
                    <h3>{name}</h3>
                    <p>{name}対応の無料配布素材ページへ移動します。</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="slider-dots" data-slider-dots="" aria-label="無料素材スライド位置" />
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
            <a className="text-link" href="/terms.html">
              利用規約
            </a>
            をご確認ください
          </li>
        </ul>
      </section>
    </main>
  );
}

function getSliderLabel(tags: string[]) {
  if (tags.includes("pose")) {
    return "SexyPose";
  }

  if (tags.includes("universal")) {
    return "SexyMotion";
  }

  if (tags.includes("solo")) {
    return "Solo_H";
  }

  return "Others";
}

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
}
