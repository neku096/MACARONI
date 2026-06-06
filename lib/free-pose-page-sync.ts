import { promises as fs } from "node:fs";
import path from "node:path";
import type { FreePose } from "@/lib/free-poses";

type FreePoseCharacterPage = {
  slug: string;
  name: string;
};

const characterPages: FreePoseCharacterPage[] = [
  { slug: "airi", name: "愛莉" },
  { slug: "chocolat", name: "ショコラ" },
  { slug: "eku", name: "エク" },
  { slug: "ichigo", name: "イチゴ" },
  { slug: "kumaly", name: "クマリ" },
  { slug: "lasyusha", name: "ラシューシャ" },
  { slug: "lumina", name: "ルミナ" },
  { slug: "mafuyu", name: "真冬" },
  { slug: "manuka", name: "マヌカ" },
  { slug: "mayo", name: "まよ" },
  { slug: "milfy", name: "ミルフィ" },
  { slug: "milltina", name: "ミルティナ" },
  { slug: "moe", name: "萌" },
  { slug: "plum", name: "プラム" },
  { slug: "ramune", name: "ラムネ" },
  { slug: "ririka", name: "りりか" },
  { slug: "rurune", name: "ルルネ" },
  { slug: "selestia", name: "セレスティア" },
  { slug: "shinano", name: "しなの" },
  { slug: "sio", name: "しお" },
];

const catalogSectionPattern =
  /<section class="section catalog-section" id="pose-catalog" aria-labelledby="catalog-title">[\s\S]*?<\/section>/;

export async function syncFreePoseCharacterPages(items: FreePose[], characterNames: string[]) {
  const targetNames = new Set(characterNames.filter(Boolean));
  const targetPages = characterPages.filter((page) => targetNames.has(page.name));

  await Promise.all(targetPages.map((page) => syncFreePoseCharacterPage(items, page)));
}

async function syncFreePoseCharacterPage(items: FreePose[], page: FreePoseCharacterPage) {
  const group = items
    .filter((item) => item.published && item.character === page.name)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "ja"));
  const section = renderCatalogSection(page, group);
  const roots = [process.cwd(), path.join(process.cwd(), "public")];

  await Promise.all(roots.map((root) => replaceCatalogSection(path.join(root, `character-${page.slug}.html`), section)));
}

async function replaceCatalogSection(filePath: string, section: string) {
  let html = "";
  try {
    html = await fs.readFile(filePath, "utf8");
  } catch {
    return;
  }

  if (!catalogSectionPattern.test(html)) {
    return;
  }

  const newline = html.includes("\r\n") ? "\r\n" : "\n";
  const normalizedSection = section.replace(/\n/g, newline);
  const nextHtml = html.replace(catalogSectionPattern, normalizedSection);

  if (nextHtml !== html) {
    await fs.writeFile(filePath, nextHtml, "utf8");
  }
}

function renderCatalogSection(page: FreePoseCharacterPage, items: FreePose[]) {
  const count = items.length;
  const primaryDownloadUrl = items[0]?.downloadUrl ?? "#";
  const downloadHref = toPublicRelativePath(primaryDownloadUrl);
  const downloadFileName = path.posix.basename(downloadHref);
  const cards = items.map((item) => renderFreePoseCard(page, item)).join("\n");

  return `<section class="section catalog-section" id="pose-catalog" aria-labelledby="catalog-title">
        <div class="section-heading">
          <div>
            <h2 id="catalog-title">${escapeHtml(page.name)}用無料ポーズ${count}種</h2>
            <p class="section-lead">画像を確認して、${escapeHtml(page.name)}用FreePoseをまとめてダウンロードできます。</p>
          </div>
          <a class="button primary catalog-download free-pose-full-download" href="${escapeAttribute(downloadHref)}" download="${escapeAttribute(downloadFileName)}" aria-label="${escapeAttribute(page.name)}用無料ポーズ${count}種をzipでまとめてダウンロード">まとめて無料ダウンロード</a>
        </div>

        <div class="pose-grid free-pose-grid">
${cards}
        </div>
      </section>`;
}

function renderFreePoseCard(page: FreePoseCharacterPage, item: FreePose) {
  const imageSrc = toPublicRelativePath(item.thumbnail);
  const downloadUrl = toPublicRelativePath(item.downloadUrl);
  const title = escapeHtml(item.title);
  const alt = escapeAttribute(`${page.name}用${item.title}のプレビュー`);

  return `          <article class="pose-card free-pose-card" data-free-pose-slug="${escapeAttribute(item.slug)}" data-download-url="${escapeAttribute(downloadUrl)}">
            <img src="${escapeAttribute(imageSrc)}" alt="${alt}" width="300" height="300" loading="lazy" decoding="async">
            <div>
              <h3>${title}</h3>
            </div>
          </article>`;
}

function toPublicRelativePath(value: string) {
  return value.trim().replace(/^\/+/, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}
