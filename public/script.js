const gate = document.querySelector("#ageGate");
const enterButton = document.querySelector("#enterSite");
const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const scrollToPageTop = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

if (gate && localStorage.getItem("ageConfirmed") === "true") {
  gate.classList.add("is-hidden");
  gate.setAttribute("aria-hidden", "true");
} else if (gate) {
  gate.setAttribute("aria-hidden", "false");
  document.body.classList.add("age-gate-open");

  requestAnimationFrame(() => {
    enterButton?.focus();
  });

  gate.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = [...gate.querySelectorAll(focusableSelector)].filter((element) => !element.hasAttribute("disabled"));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) {
      event.preventDefault();
      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

if (enterButton && gate) {
  enterButton.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    gate.classList.add("is-hidden");
    gate.setAttribute("aria-hidden", "true");
    document.body.classList.remove("age-gate-open");
  });
}

const setupShareButtons = () => {
  const getShareText = (jaText, enText) => (getDisplayLanguage() === "en" ? enText : jaText);
  const getCopyText = () => getShareText("\u0055\u0052\u004c\u3092\u30b3\u30d4\u30fc", "Copy URL");
  const getCopiedText = () => getShareText("\u30b3\u30d4\u30fc\u6e08\u307f", "Copied");
  const modalTitle = getShareText("\u3053\u306e\u30da\u30fc\u30b8\u3092\u5171\u6709", "Share this page");
  const previewLabel = getShareText("\u30ea\u30f3\u30af\u30d7\u30ec\u30d3\u30e5\u30fc", "Link Preview");
  const xText = getShareText("X", "X");
  const lineText = getShareText("LINE", "LINE");
  const closeText = getShareText("\u9589\u3058\u308b", "Close");
  const fallbackImage = "/Macaroni_Samune/ogp-v4.png";
  const getMetaContent = (selector) => document.querySelector(selector)?.content?.trim() || "";

  const getShareData = () => ({
    title: getMetaContent('meta[property="og:title"]') || document.title,
    text:
      getMetaContent('meta[property="og:description"]') ||
      getMetaContent('meta[name="description"]') ||
      document.title,
    url: document.querySelector('link[rel="canonical"]')?.href || window.location.href,
    image:
      getMetaContent('meta[property="og:image:secure_url"]') ||
      getMetaContent('meta[property="og:image"]') ||
      getMetaContent('meta[name="twitter:image"]') ||
      fallbackImage,
  });

  const modal = document.createElement("div");
  modal.className = "share-modal";
  modal.hidden = true;
  modal.innerHTML = [
    '<div class="share-modal-backdrop" data-share-close></div>',
    '<div class="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title" tabindex="-1">',
    '<button class="share-close" type="button" data-share-close aria-label="' + closeText + '">\u00d7</button>',
    '<h2 id="share-dialog-title">' + modalTitle + '</h2>',
    '<div class="share-preview">',
    '<div class="share-preview-media"><img src="' + fallbackImage + '" alt="" loading="lazy" data-share-image></div>',
    '<div class="share-preview-body">',
    '<p class="share-preview-kicker">' + previewLabel + '</p>',
    '<p class="share-dialog-title" data-share-title></p>',
    '<p class="share-dialog-description" data-share-description></p>',
    '<p class="share-dialog-url" data-share-url></p>',
    '</div>',
    '</div>',
    '<div class="share-actions">',
    '<button class="share-action share-action-primary" type="button" data-share-copy>',
    '<span class="share-action-icon share-action-copy"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.9-3.9a3 3 0 0 1 4.2 4.2l-3 3a3 3 0 0 1-4.25 0 1 1 0 1 1 1.42-1.42 1 1 0 0 0 1.41 0l3-3a1 1 0 0 0-1.41-1.41L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.9 3.9a3 3 0 1 1-4.2-4.2l3-3a3 3 0 0 1 4.25 0 1 1 0 0 1-1.42 1.42 1 1 0 0 0-1.41 0l-3 3a1 1 0 1 0 1.41 1.41L12 10.6a1 1 0 0 1 1.4 0Z"></path></svg></span>',
    '<span data-share-copy-label>' + getCopyText() + '</span>',
    '</button>',
    '<a class="share-action share-action-secondary" data-share-x target="_blank" rel="noopener noreferrer"><span class="share-action-icon share-action-x">X</span><span>' + xText + '</span></a>',
    '<a class="share-action share-action-secondary" data-share-line target="_blank" rel="noopener noreferrer"><span class="share-action-icon share-action-line">LINE</span><span>' + lineText + '</span></a>',
    '</div>',
    '</div>',
  ].join("");
  document.body.append(modal);

  const dialog = modal.querySelector(".share-dialog");
  const titleElement = modal.querySelector("[data-share-title]");
  const descriptionElement = modal.querySelector("[data-share-description]");
  const urlElement = modal.querySelector("[data-share-url]");
  const imageElement = modal.querySelector("[data-share-image]");
  const xLink = modal.querySelector("[data-share-x]");
  const lineLink = modal.querySelector("[data-share-line]");
  const copyButton = modal.querySelector("[data-share-copy]");
  const copyLabel = modal.querySelector("[data-share-copy-label]");
  let lastTrigger = null;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("share-modal-open");
    copyLabel.textContent = getCopyText();
    copyButton.classList.remove("is-copied");
    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  const openModal = (trigger) => {
    const shareData = getShareData();
    lastTrigger = trigger;
    titleElement.textContent = shareData.title;
    descriptionElement.textContent = shareData.text;
    urlElement.textContent = shareData.url;
    imageElement.src = shareData.image;
    imageElement.alt = shareData.title;
    xLink.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(shareData.title) + "&url=" + encodeURIComponent(shareData.url);
    lineLink.href = "https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(shareData.url);
    modal.hidden = false;
    document.body.classList.add("share-modal-open");
    dialog.focus();
  };

  document.querySelectorAll("[data-share-button]").forEach((button) => {
    button.addEventListener("click", () => openModal(button));
  });

  modal.querySelectorAll("[data-share-close]").forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(getShareData().url);
      copyButton.classList.add("is-copied");
      copyLabel.textContent = getCopiedText();
    } catch (error) {
      copyButton.classList.remove("is-copied");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      closeModal();
    }
  });
};

const languageStorageKey = "displayLanguage";

const getDisplayLanguage = () => (localStorage.getItem(languageStorageKey) === "en" ? "en" : "ja");

const setDisplayLanguage = (language) => {
  localStorage.setItem(languageStorageKey, language);
};

const characterNameTranslations = {
  愛莉: "Airi",
  ショコラ: "Chocolat",
  エク: "Eku",
  イチゴ: "Ichigo",
  クマリ: "Kumaly",
  ルミナ: "Lumina",
  真冬: "Mafuyu",
  マヌカ: "Manuka",
  しお: "Sio",
  ミルティナ: "Milltina",
  ミルフィ: "Milfy",
  萌: "Moe",
  プラム: "Plum",
  "プラム・ショコラ": "Plum / Chocolat",
  ラシューシャ: "Lasyusha",
  ラムネ: "Ramune",
  りりか: "Ririka",
  ルルネ: "Rurune",
  セレスティア: "Selestia",
  しなの: "Shinano",
  まよ: "Mayo",
  マカロニ: "Macaroni",
};

const textTranslations = {
  "このサイトは18歳以上向けです": "This site is intended for adults 18+",
  "R18作品・素材に関する情報を含みます。18歳以上の場合のみ入場してください。":
    "This site contains information about adult works and materials. Please enter only if you are 18 or older.",
  "R18作品・素材に関する情報を含みます。18歳以上で、成人向けコンテンツの閲覧が可能な地域からアクセスしている場合のみ入場してください。":
    "This site contains information about adult works and materials. Please enter only if you are 18 or older and adult content is legal in your region.",
  "18歳以上です": "I am 18 or older",
  "退場する": "Leave",
  "R18 ３Dポーズ素材無料配布サイト": "R18 Free 3D Pose Materials",
  "R18 ３Dポーズ素材無料配布サイト | マカロニ": "R18 Free 3D Pose Materials | Macaroni",
  対応キャラ: "Supported Avatars",
  BOOTH作品: "BOOTH Works",
  BOOTH作品一覧: "BOOTH Works",
  使い方: "Usage Guide",
  利用規約: "Terms of Use",
  商品詳細: "Product Details",
  導入方法: "Setup",
  同梱内容: "Included Contents",
  よくある質問: "FAQ",
  注意事項: "Notes",
  商品説明: "Product Description",
  更新履歴: "Update History",
  ダウンロード: "Download",
  関連商品: "Related Products",
  通常タグ: "Tags",
  サブタグ: "Sub Tags",
  対応アバター: "Supported Avatars",
  内容: "Contents",
  用途: "Usage",
  価格: "Price",
  種類: "Type",
  すべて: "All",
  ポーズ: "Pose",
  汎用: "General",
  一人用: "Solo",
  素材: "Asset",
  モーション: "Motion",
  マテリアル: "Material",
  "一人用モーション": "Solo Motion",
  "対応アバターあり": "Supported Avatars",
  "無料配布": "Free",
  "無料版あり": "Free version available",
  "表情付き": "Expressions Included",
  "音付き": "Audio Included",
  "音声付き": "Voice Included",
  "パーティクル": "Particles",
  "パーティクル付き": "Particles Included",
  "セクシーポーズ": "Sexy Pose",
  "挿入モーション": "Motion Animation",
  "汎用モーション": "General Motion",
  "セクシーモーション": "Sexy Motion",
  "アタックモーション": "Attack Motion",
  "エロツイポーズ": "Adult Photo Pose",
  "R18ポーズ": "R18 Pose",
  "R18モーション": "R18 Motion",
  "アバター撮影向け": "For Avatar Photos",
  "サムネイル向け": "For Thumbnails",
  "セルフタッチ": "Self Touch",
  "オナニー": "Solo Play",
  "肌マテリアル": "Skin Material",
  "商品画像ギャラリー": "Product Image Gallery",
  "商品情報": "Product Info",
  "作品カテゴリ": "Work Category",
  "商品キーワード": "Product Keywords",
  "この商品のタグ": "Product Tags",
  "前のサムネイルへ": "Previous Thumbnail",
  "次のサムネイルへ": "Next Thumbnail",
  サムネイル: "Thumbnails",
  "クリックして拡大できます。": "Click to enlarge.",
  "前の画像": "Previous Image",
  "次の画像": "Next Image",
  "BOOTHで購入する": "Buy on BOOTH",
  "BOOTH作品一覧へ": "BOOTH Works",
  "このページを共有": "Share this page",
  共有: "Share",
  "外部リンク": "External links",
  "現在のページを共有": "Share this page",
  "URLをコピー": "Copy URL",
  コピー済み: "Copied",
  "Xでシェア": "Share on X",
  "LINEでシェア": "Share on LINE",
  閉じる: "Close",
  前へ: "Previous",
  次へ: "Next",
  "もっと見る ▼": "More ▼",
  "閉じる ▲": "Close ▲",
  "対応キャラ検索": "Avatar Search",
  "対応キャラ検索を閉じる": "Close Avatar Search",
  "対応キャラ検索を開く": "Open Avatar Search",
  "対応キャラを検索 ▼": "Search Avatars ▼",
  "対応キャラを検索 ▲": "Search Avatars ▲",
  "対応キャラを選ぶ": "Select Avatar",
  "キャラ名で検索…": "Search by avatar...",
  "検索文字列をクリア": "Clear Search",
  "該当するキャラがありません": "No matching avatar",
  通常順: "Default",
  人気順: "Popular",
  "BOOTH作品タグ絞り込み": "BOOTH work tag filter",
  "BOOTH作品表示順": "BOOTH work display order",
  "対応キャラ絞り込み": "Supported avatar filter",
  "BOOTH作品ページ切り替え": "BOOTH work pagination",
  "スライド位置": "Slide position",
  "VRChat・Unity向けのR18無料ポーズ素材を、対応アバター別に配布しています。":
    "Free R18 pose materials for VRChat and Unity are available by supported avatar.",
  "無料素材の利用条件": "Free Asset Usage Terms",
  "無料配布素材は個人・同人・商用作品、ゲーム制作、VRChat、動画制作に利用できます":
    "Free assets may be used in personal, doujin, commercial works, game production, VRChat, and video production.",
  "改変・調整・作品への組み込みは自由です。クレジット表記は必須です。表記名は「macaronin」としてください。可能であれば https://macaronin.com へのリンクもお願いします":
    "Modification, adjustment, and incorporation into your works are allowed. Credit is required. Please credit as \"macaronin\". If possible, we would appreciate a link to https://macaronin.com.",
  "素材データそのものの再配布・販売、AI学習への利用は禁止です":
    "Redistributing, selling, or using the asset data itself for AI training is prohibited.",
  "BOOTH / DLsite作品は各商品ページの条件を優先します":
    "For BOOTH / DLsite works, the terms on each product page take priority.",
  "詳しい条件は": "For details, see",
  "をご確認ください": ".",
  "ポーズ・モーション・マテリアル素材をサムネイルから確認できます。":
    "Browse pose, motion, and material assets from thumbnails.",
  "購入前に、対応アバター、同梱ファイル、価格、利用条件、注意事項をBOOTHの商品ページでご確認ください。":
    "Before purchasing, check the supported avatars, included files, price, license, and notes on the BOOTH product page.",
  "同梱ファイル": "Included Files",
  "利用条件": "License Terms",
  "アバター撮影": "Avatar Photography",
  "動画制作": "Video Production",
  "3Dゲーム制作向け": "For 3D Game Production",
  "3Dシーン作成向け": "For 3D Scene Creation",
  "商品名": "Product Name",
  "フェラ": "Oral",
  "攻め": "Attack",
  "舌モデル付": "Tongue Model Included",
  "ローター": "Rotor",
  "バイブ": "Vibrator",
  "玩具": "Toy",
  "フルパック": "Full Pack",
  "ボイス音声": "Voice Audio",
  "舌モデル": "Tongue Model",
  "13アバター対応": "Supports 13 Avatars",
  "20アバター対応": "Supports 20 Avatars",
  "VRChatアバター撮影、Unityでの動画制作、3Dシーン作成向け":
    "For VRChat avatar photography, Unity video production, and 3D scene creation",
  "VRChat、Unity 2022、Modular Avatar、アバター撮影、動画制作、3Dゲーム制作向け":
    "For VRChat, Unity 2022, Modular Avatar, avatar photography, video production, and 3D game production",
  "VRChatアバター撮影、Unity 2022での動画制作、R18シーン確認、3Dゲーム制作向け":
    "For VRChat avatar photography, Unity 2022 video production, R18 scene checks, and 3D game production",
  "VRChatアバター撮影、Unity 2022での動画制作、改変アバターの見え方確認、3Dゲーム制作向け":
    "For VRChat avatar photography, Unity 2022 video production, modified-avatar appearance checks, and 3D game production",
  "セクシーポーズ15種、表情5種": "15 sexy poses, 5 expressions",
  "セクシーポーズ20種、挿入モーション5種(音付)、表情11種": "20 sexy poses, 5 motion animations with audio, 11 expressions",
  "セクシーポーズ15種、表情7種": "15 sexy poses, 7 expressions",
  "モーション2種類、音、パーティクル、玩具、表情付き": "2 motions, audio, particles, toy, and expressions",
  "モーション3種類、音、パーティクル、玩具、表情付き": "3 motions, audio, particles, toy, and expressions",
  "一人用R18モーション、表情、音素材、パーティクル、玩具ギミック、対応アバター向けPrefab":
    "Solo R18 motion, expressions, audio assets, particles, toy gimmick, and supported-avatar Prefab",
  "Motion2種類、音、Particles、玩具、Expressions Included": "2 motions, audio, particles, toy, and expressions",
  "R18 3Dポーズ素材無料配布サイト": "R18 Free 3D Pose Materials",
  "R18 3DPoseAsset無料配布サイト": "R18 Free 3D Pose Materials",
  "VRChat・Unity向けR18無料3Dポーズ素材": "R18 Free 3D Pose Materials for VRChat and Unity",
  "VRChat・Unity向け": "For VRChat / Unity",
  "VRChat・Unity向けR18無料3Dポーズ素材 | マカロニ": "R18 Free 3D Pose Materials for VRChat and Unity | Macaroni",
  "VRChat・Unity向けR18 3D素材一覧": "R18 3D Asset List for VRChat and Unity",
  "VRChat・Unity向けR18 3D素材一覧 | マカロニ": "R18 3D Asset List for VRChat and Unity | Macaroni",
  "R18 3D素材一覧": "R18 3D Asset List",
  "利用規約・ライセンス": "Terms of Use / License",
  "利用規約・ライセンス | マカロニ": "Terms of Use / License | Macaroni",
  "サイトの規約": "Site Terms",
  "BOOTHの規約": "BOOTH Terms",
  "利用できる範囲": "Allowed Usage",
  "禁止事項": "Prohibited Uses",
  "使用元アバターについて": "Source Avatars",
  "プライバシー": "Privacy",
  "アクセス解析について": "Analytics",
  "免責": "Disclaimer",
  "BOOTH商品の個別規約": "BOOTH Product Terms",
  "BOOTH規約の言語": "BOOTH terms language",
  "利用規約の分類": "Terms category",
  "日本語BOOTH規約PDF": "Japanese BOOTH terms PDF",
  "英語BOOTH規約PDF": "English BOOTH terms PDF",
  "韓国語BOOTH規約PDF": "Korean BOOTH terms PDF",
  "中国語BOOTH規約PDF": "Chinese BOOTH terms PDF",
  "利用規約 1ページ目": "Terms of Use page 1",
  "利用規約 2ページ目": "Terms of Use page 2",
  "利用規約 3ページ目": "Terms of Use page 3",
  "利用規約 4ページ目": "Terms of Use page 4",
  "利用規約 5ページ目": "Terms of Use page 5",
  "利用規約 6ページ目": "Terms of Use page 6",
  "利用規約 7ページ目": "Terms of Use page 7",
  "利用規約 8ページ目": "Terms of Use page 8",
  "利用規約 9ページ目": "Terms of Use page 9",
  "利用規約 10ページ目": "Terms of Use page 10",
  "このページは、マカロニの素材を利用する際の基本ルールと、BOOTHで配布・販売している作品の個別規約を分けて確認できます。":
    "This page separates the basic rules for using Macaroni assets from the individual terms for works distributed or sold on BOOTH.",
  "無料配布素材は、下記の範囲で個人・同人・法人・商用・非商用を問わず利用できます。":
    "Free assets may be used by individuals, doujin circles, companies, commercial projects, and non-commercial projects within the scope below.",
  "VRChat、Unityプロジェクト、アバター撮影、動画制作、3Dゲーム制作への使用。":
    "Use in VRChat, Unity projects, avatar photography, video production, and 3D game production.",
  "ゲーム、映像、配信、SNS、同人作品、販売作品への組み込み。":
    "Inclusion in games, videos, streams, social media, doujin works, and commercial works.",
  "ポーズやモーションの調整、トリミング、形式変換など、制作に必要な範囲での編集。":
    "Editing required for production, such as pose or motion adjustment, trimming, and format conversion.",
  "クレジット表記は必須です。表記名は「macaronin」としてください。可能であれば https://macaronin.com へのリンクもお願いします。":
    "Credit is required. Please credit as \"macaronin\". If possible, we would appreciate a link to https://macaronin.com.",
  "素材データの再配布、再販売、無断アップロード、自作発言。":
    "Redistribution, resale, unauthorized upload, or claiming the asset data as your own.",
  "書面で許可されていないAI学習、データセット化、LoRA学習などへの利用。":
    "Use for AI training, dataset creation, LoRA training, or similar purposes without written permission.",
  "違法な表現、未成年または未成年に見えるキャラクターを含む表現、利用地域の法律や各プラットフォーム規約に反する利用。":
    "Illegal content, content involving minors or minor-looking characters, or uses that violate local laws or platform terms.",
  "配布ファイルに対応アバター本体は含まれません。各対応アバターは公式の販売・配布ページから入手してください。キャラ別ページのクレジットリンクは使用元アバターの案内です。":
    "Supported avatar models are not included in distributed files. Please obtain each supported avatar from its official sales or distribution page. Credit links on character pages point to the source avatars.",
  "この静的サイトでは、決済、アカウント、問い合わせフォームを扱いません。年齢確認と言語設定はブラウザのlocalStorageに保存される場合があります。":
    "This static site does not handle payments, accounts, or contact forms. Age confirmation and language settings may be saved in your browser localStorage.",
  "当サイトでは、サイト改善や閲覧状況の把握のために、アクセス解析ツールを利用する場合があります。アクセス解析により、閲覧ページ、利用環境、アクセス日時などの情報が収集される場合があります。":
    "This site may use analytics tools to improve the site and understand browsing activity. Analytics may collect information such as viewed pages, device environment, and access time.",
  "これらの情報は、個人を特定する目的では使用しません。Google Analytics等の解析ツールを利用する場合、収集された情報は各提供元のプライバシーポリシーに基づいて管理されます。":
    "This information is not used to identify individuals. If tools such as Google Analytics are used, collected information is managed according to each provider's privacy policy.",
  "素材の利用によって発生した損害、トラブル、各プラットフォームでの制限について、マカロニは責任を負いません。必要に応じて規約内容を変更する場合があります。":
    "Macaroni is not responsible for damages, trouble, or platform restrictions caused by using the assets. These terms may be changed when necessary.",
  "BOOTHで配布・販売している個別作品は、各BOOTH商品ページの説明と同梱PDFも確認してください。商品ページや同梱PDFに個別条件がある場合は、そちらを優先してください。":
    "For individual works distributed or sold on BOOTH, also check each BOOTH product page and included PDF. If the product page or PDF has individual terms, those terms take priority.",
  "対応キャラを見る": "View Supported Avatars",
  "VRChat・Unityポーズ素材の使い方": "Usage Guide for VRChat and Unity Pose Assets",
  "VRChat・UnityPoseAssetの使い方": "Usage Guide for VRChat and Unity Pose Assets",
  "使い方記事": "Usage Article",
  "使い方記事一覧": "Usage Article List",
  "使い方ページ切り替え": "Usage page navigation",
  "前の使い方ページ": "Previous usage page",
  "次の使い方ページ": "Next usage page",
  "Unityでanimファイルを再生する手順": "How to play an anim file in Unity",
  "UnityでAnimator Controllerを作成する手順画面": "Screen for creating an Animator Controller in Unity",
  "UnityのGameビューでanimポーズを再生確認する画面": "Screen for checking anim pose playback in Unity Game view",
  "UnityのGameビューでanimPoseを再生確認する画面": "Screen for checking anim pose playback in Unity Game view",
  "Unityで必要なPrefabをHierarchyへ追加する画面": "Screen for adding required Prefabs to the Unity Hierarchy",
  "Animationタブで表情をPreview確認しているUnity画面": "Unity screen checking expressions in Preview in the Animation tab",
  "Animator ControllerとAnimationタブで再生を確認": "Check playback with Animator Controller and the Animation tab",
  "ゲーム開発時にanimを再生する手順": "How to play anim files in game development",
  "スクリプトからAnimatorのStateを呼び出す方法": "How to call an Animator State from a script",
  "導入に必要なPrefabについて": "Required Prefabs for Setup",
  "必要Prefabの入れ方と配置確認": "How to place and check required Prefabs",
  "改変済みアバターの表情破綻を直す手順": "How to fix expression issues on modified avatars",
  "BlendShape値を今の顔に合わせる方法": "How to adjust BlendShape values to the current face",
  "BOOTH購入者向けFAQ": "BOOTH Buyer FAQ",
  "サポートFAQ": "Support FAQ",
  "利用規約、不具合、問い合わせ前チェック": "Terms, common issues, and pre-contact checklist",
  "VRChatアバターのポーズ導入、Unityのanimファイル、ゲーム制作で使う時に詰まりやすいポイントを確認できます。":
    "Check common sticking points for VRChat avatar pose setup, Unity anim files, and game production usage.",
  "Animator Controllerの作成、対象オブジェクトへの設定、animの登録、Animationタブでの確認までを順番に確認できます。":
    "Follow the flow from creating an Animator Controller to assigning it, registering anim files, and checking them in the Animation tab.",
  "Gameビューでポーズを確認したい時に、スクリプト、空オブジェクト、Animator、State名の設定手順を追えます。":
    "Follow the setup for scripts, empty objects, Animator, and State names when checking poses in the Game view.",
  "SexyPose_○○○ と MAMST_Controller をHierarchyへ入れる時の配置と確認ポイントを見られます。":
    "Review placement and checks for adding SexyPose_○○○ and MAMST_Controller to the Hierarchy.",
  "表情用animで目や口が崩れる時に、Animationタブでシェイプキー値を記録し直す手順を確認できます。":
    "Review how to re-record shape key values in the Animation tab when expression anim files break eyes or mouth shapes.",
  "BOOTH商品の利用規約、EXMenuやPhysBoneの不具合、問い合わせ前に確認したい項目を見られます。":
    "Review BOOTH product terms, EXMenu or PhysBone issues, and checks to do before contacting support.",
  "ホーム": "Home",
  "マカロニのBOOTH商品について、利用規約や導入時に迷いやすい確認ポイントをまとめています。":
    "This page summarizes license terms and setup checks that can be confusing for Macaroni BOOTH products.",
  "問い合わせ前の確認に使うページです": "Use this page as a checklist before contacting support.",
  "利用規約、Unity導入時の不具合、問い合わせ前チェックをまとめています。":
    "It covers license terms, Unity setup issues, and pre-contact checks.",
  "利用規約と商用利用": "License and Commercial Use",
  "よくある不具合": "Common Issues",
  "問い合わせ前チェック": "Pre-contact Checklist",
  "利用規約はどこを見ればいいですか？": "Where can I check the license terms?",
  "商用利用はできますか？": "Can I use the assets commercially?",
  "アップロード後、EXMenuが正常に動きません": "EXMenu does not work correctly after upload",
  "モーション再生中に、髪やアクセサリーが大きく跳ねたり、浮いたりします":
    "Hair or accessories jump or float during motion playback",
  "Motion再生中に、髪やアクセサリーが大きく跳ねたり、浮いたりします":
    "Hair or accessories jump or float during motion playback",
  "同梱テキストと利用規約を確認した": "I checked the included text and license terms.",
  "Unityのバージョン、アバター名、商品名、困っている画面を説明できる":
    "I can explain the Unity version, avatar name, product name, and the screen where the issue occurs.",
  "問い合わせ時は、商品名、使用アバター、Unityのバージョン、発生している症状、可能ならスクリーンショットを添えてください。個人情報が写る場合は、不要な情報を隠してください。":
    "When contacting support, include the product name, avatar, Unity version, symptoms, and screenshots if possible. Hide unnecessary information if personal details are visible.",
  "利用規約を見る": "View Terms of Use",
  "BOOTH作品一覧を見る": "View BOOTH Works",
  "BOOTH作品一覧へ戻る": "Back to BOOTH Works",
  "BOOTHへ": "Go to BOOTH",
  "パンくずリスト": "Breadcrumb",
  "記事目次": "Article contents",
  "関連ページ": "Related pages",
  "髪やアクセサリーが跳ねる場合の確認画像": "Reference image for hair or accessories jumping",
  "髪やアクセサリーが跳ねる場合の確認画像 1": "Reference image for hair or accessories jumping 1",
  "髪やアクセサリーが跳ねる場合の確認画像 2": "Reference image for hair or accessories jumping 2",
  "他の対応キャラを見る": "View Other Supported Avatars",
  "まとめて無料ダウンロード": "Download All Free",
  "もっと見る": "Show More",
  "対応キャラ一覧": "Supported Avatar List",
  "画像を確認して、ショコラ用FreePoseをまとめてダウンロードできます。":
    "Check the images and download the Chocolat Free Pose set together.",
  "ChocolatのBOOTH作品へ": "BOOTH Works for Chocolat",
  "ショコラのBOOTH作品へ": "BOOTH Works for Chocolat",
  "利用規約・": "Terms of Use /",
  ライセンス: "License",
  "使用条款 第1页": "Chinese Terms page 1",
  "使用条款 第2页": "Chinese Terms page 2",
  "使用条款 第3页": "Chinese Terms page 3",
  "使用条款 第4页": "Chinese Terms page 4",
  "【13アバター対応】フ〇ラモーション(ボイス音声＋汎用舌モデル＋表情付き)":
    "Oral Motion for 13 Avatars (Voice Audio + General Tongue Model + Expressions)",
  "Motion Animation付き": "Motion Animation Included",
  "挿入モーション付き": "Motion Animation Included",
  "動画制作向け": "For Video Production",
  受け: "Receiver",
  "セクシーアタック": "Sexy Attack",
  "Prefab対応": "Prefab Supported",
  "足コキ": "Foot Motion",
  "手コキ": "Hand Motion",
  "ディルド": "Dildo",
  "電マ": "Electric Massager",
  "Preset付き": "Preset Included",
  形式: "Format",
  環境: "Environment",
  "liltoon用プリセットを含むスキンマテリアル": "Skin material including liltoon preset",
  "Unity 2022、liltoon導入済みプロジェクト向け": "For Unity 2022 projects with liltoon installed",
  "¥1,000円": "¥1,000",
  "Price: ¥1,000円": "Price: ¥1,000",
  "5種類のセクシーモーションと音付き": "5 sexy motions with audio",
  "5種類のセクシーアタックモーションと音付き": "5 sexy attack motions with audio",
  "Prefab置くだけ導入のSexyMotion / Attack vol.2、音付き": "Prefab-based SexyMotion / Attack vol.2 with audio",
  "6種類の足○キモーションと音付き": "6 foot motion animations with audio",
  "15種類の手○キモーションと音付き": "15 hand motion animations with audio",
  "【汎用】セクシーモーション5種類(音付)": "5 General Sexy Motions (Audio Included)",
  "【汎用】セクシーアタックモーション5種類(音付)": "5 General Sexy Attack Motions (Audio Included)",
  "【Prefab置くだけ導入】SexyMotion / Attack vol.2 (音付)": "Prefab-based SexyMotion / Attack vol.2 (Audio Included)",
  "【Prefab置くだけ導入】SexyMotion / Attack vol.2  (音付)": "Prefab-based SexyMotion / Attack vol.2 (Audio Included)",
  "汎用で使いやすいセクシーモーション5種類を収録した、VRChat・Unity向けR18モーション素材です。":
    "A general-use R18 motion asset for VRChat and Unity, including 5 easy-to-use sexy motions.",
  "汎用のセクシーアタックモーション5種類を収録した、VRChat・Unity向けR18モーション素材です。":
    "A general-use R18 motion asset for VRChat and Unity, including 5 sexy attack motions.",
  "Prefab置くだけ導入のSexyMotion / Attack vol.2です。VRChatアバター撮影やUnity動画制作向けの音付きモーション素材です。":
    "Prefab-based SexyMotion / Attack vol.2 with audio, made for VRChat avatar photography and Unity video production.",
  "汎用の足○キモーション6種類を収録した、VRChat・Unity向けR18モーション素材です。":
    "A general-use R18 motion asset for VRChat and Unity, including 6 foot motion animations.",
  "汎用の手○キモーション15種類を収録した、VRChat・Unity向けR18モーション素材です。":
    "A general-use R18 motion asset for VRChat and Unity, including 15 hand motion animations.",
  "13アバター対応のフ〇ラモーション素材です。ボイス音声、汎用舌モデル、表情付きで、VRChatやUnityでの撮影・動画制作に使えます。":
    "Oral motion asset for 13 avatars, including voice audio, a general tongue model, and expressions for VRChat and Unity photography or video production.",
  "20アバター対応の一人用R18モーション素材です。モーション2種類、音、パーティクル、玩具、表情を収録しています。":
    "Solo R18 motion asset for 20 avatars, including 2 motions, audio, particles, toy props, and expressions.",
  "対応アバター向けの一人用R18モーション素材です。モーション3種類、音、パーティクル、玩具、表情を収録しています。":
    "Solo R18 motion asset for supported avatars, including 3 motions, audio, particles, toy props, and expressions.",
  "対応アバター向けの一人用R18モーション素材です。モーション2種類、音、パーティクル、玩具、表情を収録しています。":
    "Solo R18 motion asset for supported avatars, including 2 motions, audio, particles, toy props, and expressions.",
  "対応アバター向けの一人用R18モーション素材です。表情、音素材、パーティクル、玩具ギミック、対応アバター向けPrefabを収録しています。":
    "Solo R18 motion asset for supported avatars, including expressions, audio assets, particles, toy gimmicks, and supported-avatar Prefabs.",
  "liltoon用プリセットを含むスキンマテリアル素材です。Unity 2022、liltoon導入済みプロジェクト向けに利用できます。":
    "Skin material asset including liltoon presets, made for Unity 2022 projects with liltoon installed.",
  "【汎用】足○キモーション6種類(音付)": "6 General Foot Motion Animations (Audio Included)",
  "【汎用】手○キモーション15種類(音付)": "15 General Hand Motion Animations (Audio Included)",
  "MacaroniSoft 公式リンク集": "MacaroniSoft Official Links",
  "初めまして、まかろにです！アニメーション・3Dモデリング・ゲーム制作が中心の個人クリエイターです！":
    "Nice to meet you, I am Macaroni. I am an individual creator focused on animation, 3D modeling, and game production.",
  "VRChat・Unity向け素材の販売ページ": "Sales page for VRChat and Unity assets",
  "成人向け同人作品の一覧": "Adult doujin works list",
  "サークルプロフィールと配信作品": "Circle profile and published works",
  "お知らせ・活動更新": "News and activity updates",
  "告知・SNS更新": "Announcements and social updates",
  "サイト内で探す": "Search within the site",
  "無料素材をキャラ別に探す": "Find free assets by character",
  "サムネイルから作品を探す": "Find works from thumbnails",
  "導入方法や使い方を見る": "View setup and usage guides",
  "購入者FAQ": "Buyer FAQ",
  "BOOTH購入後の確認を見る": "Check after BOOTH purchase",
  "使用条件を確認する": "Check usage terms",
  "公式リンク集": "Official Links",
  "公式外部リンク": "Official external links",
  "VRChat・Unity向けR18無料3Dポーズ素材": "R18 Free 3D Pose Materials for VRChat and Unity",
  "VRChat・Unity向けR18無料3Dポーズ素材 | マカロニ": "R18 Free 3D Pose Materials for VRChat and Unity | Macaroni",
  "VRChat対応アバター別 無料3Dポーズ素材一覧": "Free 3D Pose Materials by VRChat Avatar",
  "対応キャラ別 無料3Dポーズ素材": "Free 3D Pose Materials by Avatar",
  "無料3Dポーズ素材": "Free 3D Pose Materials",
  "VRChat・Unity向けの無料ポーズ素材を、対応アバターごとに探せます。":
    "Find free VRChat and Unity pose materials by supported avatar.",
  "VRChat対応アバター別 無料3Dポーズ素材一覧 | マカロニ": "Free 3D Pose Materials by VRChat Avatar | Macaroni",
  "VRChat・Unity向け3Dポーズ/モーション作品一覧": "3D Pose and Motion Works for VRChat and Unity",
  "ポーズ、モーション、汎用素材をサムネイルからすばやく確認できます。":
    "Browse pose, motion, and universal assets quickly from BOOTH thumbnails.",
  "VRChat・Unity向け3Dポーズ/モーション作品一覧 | マカロニ": "3D Pose and Motion Works for VRChat and Unity | Macaroni",
  "VRChatアバターや3Dゲーム制作で使えるUnity向けR18 3Dポーズ・モーション素材を無料配布。対応キャラ一覧、BOOTH作品、DLsiteへの導線をまとめています。":
    "Free R18 3D pose and motion materials for VRChat avatars and 3D game production. Includes supported characters, BOOTH works, and DLsite links.",
  "VRChat・VRC向け無料3Dポーズ素材の対応アバター一覧です。クマリ、エク、真冬、マヌカなど、Unity用ポーズ素材をキャラ別に確認できます。":
    "A supported-avatar list for free VRChat and VRC 3D pose materials. Browse Unity pose materials by character, including Kumaly, Eku, Mafuyu, and Manuka.",
  "VRChatアバターや3Dゲーム制作向けの3Dポーズ、モーション、Unity用アニメーション作品をBOOTHサムネイル一覧で確認できます。":
    "Browse BOOTH thumbnails for 3D poses, motions, and Unity animation works for VRChat avatars and 3D game production.",
  "マカロニ R18 3Dポーズ素材無料配布サイトのロゴ": "Macaroni R18 free 3D pose materials site logo",
  "VRChat対応アバター別 無料3Dポーズ素材一覧のロゴ": "Free 3D pose materials by VRChat avatar logo",
  "クマリ用セクシーポーズ作品サムネイル": "Kumaly sexy pose work thumbnail",
  "無料アニメーション素材": "Free Animation Materials",
  "DL一覧へ": "Downloads",
  "BOOTH版を見る": "View BOOTH Version",
  "対応キャラ一覧へ": "Character List",
  "まとめてダウンロード": "Download All",
  "立ち絵をダウンロード": "Download Standing Image",
  "使用元アバター:": "Source Avatar:",
  "使用元アバター": "Source Avatar",
  立ち絵: "Standing Image",
  "セクシーポーズ 01": "Sexy Pose 01",
  "〖汎用〗セクシーモーション5種類": "5 Universal Sexy Motions",
  "〖汎用〗セクシーアタックモーション5種類": "5 Universal Sexy Attack Motions",
  "〖汎用〗足○キモーション6種類": "6 Universal Foot Motion Animations",
  "〖汎用〗手○キモーション15種類": "15 Universal Hand Motion Animations",
  "〖13アバター対応〗フ〇ラモーション": "Oral Motion for 13 Avatars",
  セクシーモーション: "Sexy Motion",
  "セクシーモーション vol.1": "Sexy Motion vol.1",
  セクシーアタックモーション: "Sexy Attack Motion",
  "セクシーアタックモーション vol.1": "Sexy Attack Motion vol.1",
  "足○キモーション": "Foot Motion",
  "手○キモーション": "Hand Motion",
  "フ〇ラモーション": "Oral Motion",
  "一人エッチモーション vol.1": "Solo Motion vol.1",
  "一人エッチモーション vol.2": "Solo Motion vol.2",
  "一人エッチモーション vol.3": "Solo Motion vol.3",
  "一人エッチモーション vol.4": "Solo Motion vol.4",
  ドスケベマテリアル: "Adult Materials",
  トップへ: "Back to top",
  メインナビゲーション: "Main navigation",
  無料素材スライド位置: "Free material slide position",
  "商品が見つかりません": "Product not found",
  "商品が非公開、またはURLが変更された可能性があります。": "This product may be unpublished, or its URL may have changed.",
  "商品一覧へ戻る": "Back to Products",
};

Object.entries(characterNameTranslations).forEach(([jaName, enName]) => {
  textTranslations[jaName] = enName;
});

const translateCharacterName = (name) => characterNameTranslations[name] || name;

const shortLabelTranslations = [
  ["プラム・ショコラ", "Plum / Chocolat"],
  ...Object.entries(characterNameTranslations),
  ["一人用モーション", "Solo Motion"],
  ["汎用モーション", "General Motion"],
  ["セクシーモーション", "Sexy Motion"],
  ["アタックモーション", "Attack Motion"],
  ["セクシーポーズ", "Sexy Pose"],
  ["挿入モーション", "Motion Animation"],
  ["音声付き", "Voice Included"],
  ["音付き", "Audio Included"],
  ["表情付き", "Expressions Included"],
  ["表情", "Expressions"],
  ["無料版あり", "Free version available"],
  ["パーティクル付き", "Particles Included"],
  ["パーティクル", "Particles"],
  ["アバター対応", "Avatar Support"],
  ["対応アバター", "Supported Avatars"],
  ["ボイス音声", "Voice Audio"],
  ["舌モデル付", "Tongue Model Included"],
  ["舌モデル", "Tongue Model"],
  ["フルパック", "Full Pack"],
  ["玩具", "Toy"],
  ["マテリアル", "Material"],
  ["素材", "Asset"],
  ["ポーズ", "Pose"],
  ["汎用", "General"],
  ["一人用", "Solo"],
  ["モーション", "Motion"],
  ["R18ポーズ", "R18 Pose"],
  ["R18モーション", "R18 Motion"],
  ["商品名", "Product Name"],
  ["アバター撮影向け", "For Avatar Photos"],
  ["サムネイル向け", "For Thumbnails"],
  ["エロツイポーズ", "Adult Photo Pose"],
  ["オナニー", "Solo Play"],
  ["セルフタッチ", "Self Touch"],
  ["肌マテリアル", "Skin Material"],
  ["ドスケベマテリアル", "Adult Material"],
  ["種類", "types"],
];

const translateShortLabelText = (text) => {
  if (text.length > 80 || /[。！？]/.test(text)) {
    return text;
  }

  return shortLabelTranslations.reduce(
    (result, [jaText, enText]) => result.replaceAll(jaText, enText),
    text,
  );
};

const translateText = (text) => {
  if (textTranslations[text]) {
    return textTranslations[text];
  }

  const homeDescription =
    "VRChat・Unity向けのR18 3Dポーズ、モーション、マテリアル素材を一覧で確認できるマカロニの商品サイトです。";
  if (text === homeDescription) {
    return "Macaroni is a product site for browsing R18 3D pose, motion, and material assets for VRChat and Unity.";
  }

  const productsDescription =
    "VRChatアバターやUnity向けのR18 3Dポーズ、モーション、マテリアル素材をカテゴリ・タグ・対応アバターで絞り込めます。";
  if (text === productsDescription) {
    return "Filter R18 3D pose, motion, and material assets for VRChat avatars and Unity by category, tag, and supported avatar.";
  }

  const termsDescription =
    "マカロニの3Dポーズ・モーション素材に関する利用規約です。サイトの基本規約とBOOTH商品の個別規約を確認できます。";
  if (text === termsDescription) {
    return "Terms of use for Macaroni 3D pose and motion assets, including the site terms and BOOTH product-specific terms.";
  }

  const tipsDescription =
    "VRChat、Unity、3Dゲーム制作で無料3Dポーズ素材を使う時の導入、Prefab、ゲーム活用、表情調整を記事形式でまとめています。";
  if (text === tipsDescription) {
    return "Articles about setup, Prefabs, game usage, and expression adjustments for using free 3D pose assets in VRChat, Unity, and 3D game production.";
  }

  const boothFaqDescription =
    "マカロニのBOOTH商品について、利用規約、EXMenuやPhysBoneの不具合、問い合わせ前チェックをまとめたFAQです。";
  if (text === boothFaqDescription) {
    return "FAQ for Macaroni BOOTH products, covering terms, EXMenu and PhysBone issues, and checks before contacting support.";
  }

  const boothFaqShortDescription =
    "BOOTH商品について、利用規約、EXMenuやPhysBoneの不具合、問い合わせ前チェックをまとめています。";
  if (text === boothFaqShortDescription) {
    return "A support FAQ covering BOOTH product terms, EXMenu and PhysBone issues, and pre-contact checks.";
  }

  const linksDescription =
    "MacaroniSoft / マカロニの公式リンク集です。BOOTH、FANZA、DLsite、Ci-en、Xへの導線をスマホでも見やすくまとめています。";
  if (text === linksDescription) {
    return "Official MacaroniSoft / Macaroni links, including BOOTH, FANZA, DLsite, Ci-en, and X in a mobile-friendly layout.";
  }

  const linksShortDescription =
    "BOOTH、FANZA、DLsite、Ci-en、Xなど、MacaroniSoft / マカロニの公式リンクをまとめています。";
  if (text === linksShortDescription) {
    return "Official MacaroniSoft / Macaroni links, including BOOTH, FANZA, DLsite, Ci-en, and X.";
  }

  const macaroniTitleSuffix = " | マカロニ";
  if (text.endsWith(macaroniTitleSuffix)) {
    return `${translateText(text.slice(0, -macaroniTitleSuffix.length))} | Macaroni`;
  }

  const countMatch = text.match(/^(\d+)件$/);
  if (countMatch) {
    return `${countMatch[1]} ${countMatch[1] === "1" ? "item" : "items"}`;
  }

  const supportedAvatarsMatch = text.match(/^(\d+)アバター対応$/);
  if (supportedAvatarsMatch) {
    return `Supports ${supportedAvatarsMatch[1]} Avatars`;
  }

  const poseProductDescriptionMatch = text.match(/^(.+?)向けのVRChat・Unity 2022用R18ポーズ素材です。(.+)$/);
  if (poseProductDescriptionMatch) {
    const character = translateCharacterName(poseProductDescriptionMatch[1]);
    const detail = poseProductDescriptionMatch[2];

    if (detail === "セクシーポーズ15種と表情5種を収録し、アバター撮影や動画制作に使えます。") {
      return `R18 pose asset for ${character}, made for VRChat and Unity 2022. Includes 15 sexy poses and 5 expressions for avatar photography and video production.`;
    }

    if (detail === "無料版ありのセクシーポーズ15種と表情5種を収録しています。") {
      return `R18 pose asset for ${character}, made for VRChat and Unity 2022. Includes a free version plus 15 sexy poses and 5 expressions.`;
    }

    if (detail === "セクシーポーズ15種と表情5種を収録しています。") {
      return `R18 pose asset for ${character}, made for VRChat and Unity 2022. Includes 15 sexy poses and 5 expressions.`;
    }

    if (detail === "セクシーポーズ20種、挿入モーション5種、表情11種を収録しています。") {
      return `R18 pose asset for ${character}, made for VRChat and Unity 2022. Includes 20 sexy poses, 5 motion animations, and 11 expressions.`;
    }

    if (detail === "セクシーポーズ15種と表情7種を収録しています。") {
      return `R18 pose asset for ${character}, made for VRChat and Unity 2022. Includes 15 sexy poses and 7 expressions.`;
    }
  }

  const characterPageDescriptionMatch =
    text.match(/^(.+?)対応のVRChat・Unity向け無料3Dポーズ素材ページです。VRCアバター撮影や3Dゲーム制作で使うUnity animファイル配布を想定し、画像付きで確認できます。$/);
  if (characterPageDescriptionMatch) {
    return `Free 3D pose materials for ${translateCharacterName(characterPageDescriptionMatch[1])}, made for VRChat and Unity. Preview Unity anim files for VRC avatar photography and 3D game production with images.`;
  }

  const boothSuffix = " VRChat・Unity向け3Dポーズ/モーション作品";
  if (text.endsWith(boothSuffix)) {
    return `${translateText(text.slice(0, -boothSuffix.length))} for VRChat / Unity`;
  }

  const cardImageMatch = text.match(/^(.+)のカード画像$/);
  if (cardImageMatch) {
    return `${translateText(cardImageMatch[1])} card image`;
  }

  const productThumbMatch = text.match(/^(.+)の商品サムネイル$/);
  if (productThumbMatch) {
    return `${translateText(productThumbMatch[1])} product thumbnail`;
  }

  const freeStandingMatch = text.match(/^(.+)対応 VRChat無料3Dポーズ素材の立ち絵$/);
  if (freeStandingMatch) {
    return `${translateCharacterName(freeStandingMatch[1])} standing visual for VRChat free 3D pose materials`;
  }

  const freeUnityStandingMatch = text.match(/^(.+)対応 VRChat・Unity向け無料3Dポーズ素材の立ち絵$/);
  if (freeUnityStandingMatch) {
    return `${translateCharacterName(freeUnityStandingMatch[1])} standing visual for VRChat and Unity free 3D pose materials`;
  }

  const standingImageMatch = text.match(/^(.+)の立ち絵$/);
  if (standingImageMatch) {
    return `${translateCharacterName(standingImageMatch[1])} standing image`;
  }

  const freePosePreviewMatch = text.match(/^(.+)用無料ポーズ(\d+)のプレビュー$/);
  if (freePosePreviewMatch) {
    return `${translateCharacterName(freePosePreviewMatch[1])} Free Pose ${freePosePreviewMatch[2]} preview`;
  }

  const freePoseSetMatch = text.match(/^(.+)用無料ポーズ(\d+)種$/);
  if (freePoseSetMatch) {
    return `${freePoseSetMatch[2]} Free Poses for ${translateCharacterName(freePoseSetMatch[1])}`;
  }

  const freePoseZipMatch = text.match(/^(.+)用無料ポーズ(\d+)種をzipでまとめてダウンロード$/);
  if (freePoseZipMatch) {
    return `Download all ${freePoseZipMatch[2]} free poses for ${translateCharacterName(freePoseZipMatch[1])} as a zip`;
  }

  const productImageAltMatch = text.match(/^(.+) 商品画像 (\d+)$/);
  if (productImageAltMatch) {
    return `${translateText(productImageAltMatch[1])} product image ${productImageAltMatch[2]}`;
  }

  const productLightboxMatch = text.match(/^(.+)の商品画像を拡大表示$/);
  if (productLightboxMatch) {
    return `Open ${translateText(productLightboxMatch[1])} product image`;
  }

  const productImageCountMatch = text.match(/^(.+) 商品画像 (\d+)枚目$/);
  if (productImageCountMatch) {
    return `${translateText(productImageCountMatch[1])} product image ${productImageCountMatch[2]}`;
  }

  const plainProductImageCountMatch = text.match(/^商品画像 (\d+)枚目$/);
  if (plainProductImageCountMatch) {
    return `Product image ${plainProductImageCountMatch[1]}`;
  }

  const sexyPoseMatch = text.match(/^〖(.+)用〗セクシーポーズ(\d+)種＋表情(\d+)種$/);
  if (sexyPoseMatch) {
    return `${sexyPoseMatch[2]} Sexy Poses + ${sexyPoseMatch[3]} Expressions for ${translateCharacterName(sexyPoseMatch[1])}`;
  }

  const sexyPoseWithFreeMatch = text.match(/^【(.+?)用\s*\/\s*無料有】セクシーポーズ(\d+)種＋表情(\d+)種$/);
  if (sexyPoseWithFreeMatch) {
    return `${sexyPoseWithFreeMatch[2]} Sexy Poses + ${sexyPoseWithFreeMatch[3]} Expressions for ${translateCharacterName(sexyPoseWithFreeMatch[1])} / Free version available`;
  }

  const bracketSexyPoseMatch = text.match(/^【(.+?)用\s*】セクシーポーズ(\d+)種＋表情(\d+)種$/);
  if (bracketSexyPoseMatch) {
    return `${bracketSexyPoseMatch[2]} Sexy Poses + ${bracketSexyPoseMatch[3]} Expressions for ${translateCharacterName(bracketSexyPoseMatch[1])}`;
  }

  const plainSexyPoseMatch = text.match(/^(.+?)用 セクシーポーズ(\d+)種＋表情(\d+)種$/);
  if (plainSexyPoseMatch) {
    return `${plainSexyPoseMatch[2]} Sexy Poses + ${plainSexyPoseMatch[3]} Expressions for ${translateCharacterName(plainSexyPoseMatch[1])}`;
  }

  const sexyMotionMatch = text.match(/^〖(.+)用〗セクシーポーズ(\d+)種＋挿入モーション(\d+)種$/);
  if (sexyMotionMatch) {
    return `${sexyMotionMatch[2]} Sexy Poses + ${sexyMotionMatch[3]} Motion Animations for ${translateCharacterName(sexyMotionMatch[1])}`;
  }

  const bracketSexyMotionMatch = text.match(/^【(.+)用】セクシーポーズ(\d+)種＋挿入モーション(\d+)種\(音付\)＋表情(\d+)種$/);
  if (bracketSexyMotionMatch) {
    return `${bracketSexyMotionMatch[2]} Sexy Poses + ${bracketSexyMotionMatch[3]} Motion Animations + ${bracketSexyMotionMatch[4]} Expressions for ${translateCharacterName(bracketSexyMotionMatch[1])}`;
  }

  const plainSexyMotionMatch = text.match(/^(.+?)用 セクシーポーズ(\d+)種＋挿入モーション(\d+)種$/);
  if (plainSexyMotionMatch) {
    return `${plainSexyMotionMatch[2]} Sexy Poses + ${plainSexyMotionMatch[3]} Motion Animations for ${translateCharacterName(plainSexyMotionMatch[1])}`;
  }

  const supportedWorksMatch = text.match(/^(.+)対応BOOTH作品$/);
  if (supportedWorksMatch) {
    return `BOOTH Works for ${translateCharacterName(supportedWorksMatch[1])}`;
  }

  const characterBoothLinkMatch = text.match(/^(.+)のBOOTH作品へ$/);
  if (characterBoothLinkMatch) {
    return `BOOTH Works for ${translateCharacterName(characterBoothLinkMatch[1])}`;
  }

  const characterFreePoseLeadMatch = text.match(/^画像を確認して、(.+)用FreePoseをまとめてダウンロードできます。$/);
  if (characterFreePoseLeadMatch) {
    return `Check the images and download the ${translateCharacterName(characterFreePoseLeadMatch[1])} Free Pose set together.`;
  }

  const sourceAvatarMatch = text.match(/^使用元アバター:\s*(.+)$/);
  if (sourceAvatarMatch) {
    return `Source Avatar: ${translateCharacterName(sourceAvatarMatch[1])}`;
  }

  const testPoseMatch = text.match(/^テストポーズ (\d+)$/);
  if (testPoseMatch) {
    return `Test Pose ${testPoseMatch[1]}`;
  }

  const slideLabelMatch = text.match(/^(\d+)列目へ$/);
  if (slideLabelMatch) {
    return `Go to slide ${slideLabelMatch[1]}`;
  }

  const standingNameMatch = text.match(/^(.+) 立ち絵$/);
  if (standingNameMatch) {
    return `${translateCharacterName(standingNameMatch[1])} Standing Image`;
  }

  for (const [jaName, enName] of Object.entries(characterNameTranslations)) {
    if (text === `${jaName}対応 無料3Dポーズ素材`) {
      return `Free 3D Pose Materials for ${enName}`;
    }

    if (text === `${jaName}対応 VRChat・Unity向け無料3Dポーズ素材 | マカロニ`) {
      return `Free 3D Pose Materials for ${enName} / VRChat and Unity | Macaroni`;
    }

    if (text === `${jaName}対応 VRChat・Unity向け無料3Dポーズ素材`) {
      return `Free 3D Pose Materials for ${enName} / VRChat and Unity`;
    }

    if (text === `${jaName}対応DL可能素材一覧`) {
      return `Downloadable Materials for ${enName}`;
    }

    if (text === `${jaName}対応の無料配布素材ページへ移動します。`) {
      return `Open the free material page for ${enName}.`;
    }

    if (text === `${jaName}対応 VRChat無料3Dポーズ素材の立ち絵`) {
      return `${enName} standing visual for VRChat free 3D pose materials`;
    }

    if (text === `${jaName}対応 VRChat・Unity向け無料3Dポーズ素材の立ち絵`) {
      return `${enName} standing visual for VRChat and Unity free 3D pose materials`;
    }

    if (text === `${jaName}対応のVRChat・Unity無料3Dポーズ素材用立ち絵`) {
      return `${enName} standing visual for VRChat and Unity free 3D pose materials`;
    }

    if (text === `${jaName}対応 セクシーポーズ01のサンプル画像`) {
      return `${enName} Sexy Pose 01 sample image`;
    }

    if (
      text ===
      `${jaName}対応のVRChat・Unity向け無料3Dポーズ素材です。VRCアバター撮影、3Dゲーム制作、Unityのanimファイル導入を想定したポーズ素材を画像付きで確認できます。`
    ) {
      return `Free VRChat and Unity 3D pose materials for ${enName}. You can review image previews for VRC avatar photos, 3D game production, and Unity anim file workflows.`;
    }
  }

  return translateShortLabelText(text);
};

const translatedUiMessages = {
  downloadError: {
    ja: "ダウンロードを開始できませんでした。ページを http://localhost または https で開いてから再度お試しください。",
    en: "The download could not be started. Please open this page from http://localhost or https, then try again.",
  },
};

const getTranslatedMessage = (key) => translatedUiMessages[key][getDisplayLanguage()] || translatedUiMessages[key].ja;

const preserveWhitespace = (original, translated) => {
  const prefix = original.match(/^\s*/)[0];
  const suffix = original.match(/\s*$/)[0];
  return `${prefix}${translated}${suffix}`;
};

const shouldSkipTranslationNode = (node) => {
  const parent = node.parentElement;
  return !parent || parent.closest("script, style, noscript");
};

const translateTextNode = (node, language) => {
  if (shouldSkipTranslationNode(node)) {
    return;
  }

  if (node.originalTextValue === undefined) {
    node.originalTextValue = node.nodeValue;
  }

  if (language === "ja") {
    node.nodeValue = node.originalTextValue;
    return;
  }

  const trimmed = node.originalTextValue.trim();
  if (!trimmed) {
    return;
  }

  const translated = translateText(trimmed);
  node.nodeValue = preserveWhitespace(node.originalTextValue, translated);
};

const translateAttribute = (element, attributeName, language) => {
  const originalKey = `original${attributeName
    .split("-")
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("")}`;
  const currentValue = element.getAttribute(attributeName);

  if (!currentValue) {
    return;
  }

  if (!element.dataset[originalKey]) {
    element.dataset[originalKey] = currentValue;
  }

  if (language === "ja") {
    element.setAttribute(attributeName, element.dataset[originalKey]);
    return;
  }

  element.setAttribute(attributeName, translateText(element.dataset[originalKey]));
};

const translatableMetaSelectors = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:image:alt"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image:alt"]',
];

const applyLanguage = (language) => {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;

  if (!document.originalTitleValue) {
    document.originalTitleValue = document.title;
  }
  document.title = language === "ja" ? document.originalTitleValue : translateText(document.originalTitleValue);

  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    const html = language === "en" ? element.dataset.enHtml : element.dataset.jaHtml;

    if (html && element.innerHTML !== html) {
      element.innerHTML = html;
    }
  });

  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) {
    textNodes.push(textWalker.currentNode);
  }
  textNodes.forEach((node) => translateTextNode(node, language));

  document.querySelectorAll("[alt], [aria-label], [title], [placeholder]").forEach((element) => {
    ["alt", "aria-label", "title", "placeholder"].forEach((attributeName) => {
      if (element.hasAttribute(attributeName)) {
        translateAttribute(element, attributeName, language);
      }
    });
  });

  translatableMetaSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => translateAttribute(element, "content", language));
  });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    const isPressed = button.dataset.langButton === language;
    button.setAttribute("aria-pressed", String(isPressed));
  });

  document.querySelectorAll(".language-option[href]").forEach((link) => {
    const linkLanguage = getLanguageFromUrl(link.getAttribute("href"));

    if (linkLanguage) {
      link.setAttribute("aria-pressed", String(linkLanguage === language));
    }
  });
};

const getLanguageFromUrl = (href) => {
  if (!href) {
    return "";
  }

  try {
    const { pathname } = new URL(href, window.location.href);

    if (pathname.startsWith("/en/")) {
      return "en";
    }

    if (pathname.startsWith("/ja/")) {
      return "ja";
    }
  } catch (error) {
    if (href.includes("/en/") || href.startsWith("en/")) {
      return "en";
    }

    if (href.includes("/ja/") || href.startsWith("ja/")) {
      return "ja";
    }
  }

  return "";
};

const setupLanguageSwitcher = () => {
  const buttons = [...document.querySelectorAll("[data-lang-button]")];
  const links = [...document.querySelectorAll(".language-option[href]")];

  if (!buttons.length && !links.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.langButton === "en" ? "en" : "ja";
      setDisplayLanguage(language);
      applyLanguage(language);
    });
  });

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const language = getLanguageFromUrl(link.getAttribute("href"));

      if (language) {
        setDisplayLanguage(language);
      }
    });
  });

  applyLanguage(getDisplayLanguage());

  const titleElement = document.querySelector("title");
  if (titleElement && "MutationObserver" in window) {
    const titleObserver = new MutationObserver(() => {
      if (getDisplayLanguage() !== "en" || !document.originalTitleValue) {
        return;
      }

      const translatedTitle = translateText(document.originalTitleValue);
      if (document.title !== translatedTitle) {
        document.title = translatedTitle;
      }
    });

    titleObserver.observe(titleElement, { childList: true });
    window.setTimeout(() => applyLanguage(getDisplayLanguage()), 120);
  }
};

const getVisualRows = (elements) => {
  const rowTolerance = 4;
  const rows = [];

  elements.forEach((element) => {
    const rect = element.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      return;
    }

    const existingRow = rows.find((row) => Math.abs(row.top - rect.top) <= rowTolerance);

    if (existingRow) {
      existingRow.bottom = Math.max(existingRow.bottom, rect.bottom);
      return;
    }

    rows.push({
      top: rect.top,
      bottom: rect.bottom,
    });
  });

  return rows.sort((a, b) => a.top - b.top);
};

const getCollapsedHeight = (container, rows, rowLimit) => {
  const targetRow = rows[rowLimit - 1];

  if (!targetRow) {
    return 0;
  }

  return Math.ceil(targetRow.bottom - container.getBoundingClientRect().top + 1);
};

const setupProductCollapses = () => {
  const productTagSections = [...document.querySelectorAll(".product-tag-section")];
  const productAvatarContents = [...document.querySelectorAll(".product-avatar-list-content")];
  const productBreadcrumbs = [...document.querySelectorAll(".product-summary-breadcrumb")];

  if (!productTagSections.length && !productAvatarContents.length && !productBreadcrumbs.length) {
    return;
  }

  const mobileQuery = window.matchMedia("(max-width: 640px)");
  const getShowTagsText = () => (getDisplayLanguage() === "en" ? "More ▼" : "もっと見る ▼");
  const getCloseText = () => (getDisplayLanguage() === "en" ? "Close ▲" : "閉じる ▲");

  const scheduleUpdate = (update) => {
    window.requestAnimationFrame(update);
  };

  productTagSections.forEach((section, index) => {
    const tagLists = [...section.children].filter((element) => element.classList.contains("product-tag-list"));
    const subtagList = tagLists.length > 1 ? tagLists[tagLists.length - 1] : null;

    if (!subtagList) {
      return;
    }

    const content = document.createElement("div");
    content.className = "product-subtag-collapse-content";
    content.id = section.id ? `${section.id}-subtag-content` : `product-subtag-content-${index + 1}`;

    subtagList.before(content);
    content.append(subtagList);

    const button = document.createElement("button");
    button.className = "product-collapse-toggle";
    button.type = "button";
    button.setAttribute("aria-controls", content.id);
    button.setAttribute("aria-expanded", "false");
    button.hidden = true;

    content.after(button);

    let isExpanded = false;

    const update = () => {
      const tagItems = [...subtagList.querySelectorAll(".product-tag, .product-tag-chip")];
      const rows = getVisualRows(tagItems);
      const shouldCollapse = rows.length > 3;

      button.hidden = !shouldCollapse;
      content.classList.toggle("is-collapsible", shouldCollapse);
      section.classList.toggle("has-collapse-toggle", shouldCollapse);

      if (!shouldCollapse) {
        isExpanded = false;
        content.classList.remove("is-collapsed");
        content.style.removeProperty("--collapsed-height");
        button.setAttribute("aria-expanded", "false");
        button.textContent = getShowTagsText();
        return;
      }

      content.style.setProperty("--collapsed-height", `${getCollapsedHeight(content, rows, 3)}px`);
      content.classList.toggle("is-collapsed", !isExpanded);
      button.setAttribute("aria-expanded", String(isExpanded));
      button.textContent = isExpanded ? getCloseText() : getShowTagsText();
    };

    button.addEventListener("click", () => {
      isExpanded = !isExpanded;
      update();

      if (!isExpanded) {
        section.scrollIntoView({ block: "nearest" });
      }
    });

    update();
    window.addEventListener("resize", () => scheduleUpdate(update), { passive: true });
  });

  productAvatarContents.forEach((content, index) => {
    if (content.dataset.collapseReady === "true") {
      return;
    }

    content.dataset.collapseReady = "true";
    content.id = content.id || `product-avatar-list-content-${index + 1}`;

    const button = document.createElement("button");
    button.className = "product-collapse-toggle product-avatar-collapse-toggle";
    button.type = "button";
    button.setAttribute("aria-controls", content.id);
    button.setAttribute("aria-expanded", "false");
    button.hidden = true;
    const row = content.closest(".product-specs div");

    if (row) {
      row.append(button);
    } else {
      content.after(button);
    }

    let isExpanded = false;

    const update = () => {
      const avatarItems = [...content.querySelectorAll(".product-avatar-list-item")];
      const rows = getVisualRows(avatarItems);
      const shouldCollapse = rows.length > 3;

      button.hidden = !shouldCollapse;
      content.classList.toggle("is-collapsible", shouldCollapse);

      if (!shouldCollapse) {
        isExpanded = false;
        content.classList.remove("is-collapsed");
        content.style.removeProperty("--collapsed-height");
        button.setAttribute("aria-expanded", "false");
        button.textContent = getShowTagsText();
        return;
      }

      content.style.setProperty("--collapsed-height", `${getCollapsedHeight(content, rows, 3)}px`);
      content.classList.toggle("is-collapsed", !isExpanded);
      button.setAttribute("aria-expanded", String(isExpanded));
      button.textContent = isExpanded ? getCloseText() : getShowTagsText();
    };

    button.addEventListener("click", () => {
      isExpanded = !isExpanded;
      update();
    });

    update();
    window.addEventListener("resize", () => scheduleUpdate(update), { passive: true });
  });

  productBreadcrumbs.forEach((breadcrumb, index) => {
    if (breadcrumb.dataset.collapseReady === "true") {
      return;
    }

    breadcrumb.dataset.collapseReady = "true";
    breadcrumb.id = breadcrumb.id || `product-summary-breadcrumb-${index + 1}`;

    const button = document.createElement("button");
    button.className = "product-collapse-toggle product-breadcrumb-toggle";
    button.type = "button";
    button.setAttribute("aria-controls", breadcrumb.id);
    button.setAttribute("aria-expanded", "false");
    button.hidden = true;
    breadcrumb.after(button);

    let isExpanded = false;

    const update = () => {
      const breadcrumbItems = [...breadcrumb.querySelectorAll("a")];
      const rows = getVisualRows(breadcrumbItems);
      const shouldCollapse = mobileQuery.matches && rows.length > 2;

      button.hidden = !shouldCollapse;
      breadcrumb.classList.toggle("is-collapsible", shouldCollapse);

      if (!shouldCollapse) {
        isExpanded = false;
        breadcrumb.classList.remove("is-collapsed");
        breadcrumb.style.removeProperty("--collapsed-height");
        button.setAttribute("aria-expanded", "false");
        button.textContent = getShowTagsText();
        return;
      }

      breadcrumb.style.setProperty("--collapsed-height", `${getCollapsedHeight(breadcrumb, rows, 2)}px`);
      breadcrumb.classList.toggle("is-collapsed", !isExpanded);
      button.setAttribute("aria-expanded", String(isExpanded));
      button.textContent = isExpanded ? getCloseText() : getShowTagsText();
    };

    button.addEventListener("click", () => {
      isExpanded = !isExpanded;
      update();
    });

    update();
    mobileQuery.addEventListener("change", update);
    window.addEventListener("resize", () => scheduleUpdate(update), { passive: true });
  });
};

const mimeTypes = {
  anim: "application/octet-stream",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
};

const getDownloadFileName = (link) => {
  const downloadName = link.getAttribute("download");

  if (downloadName) {
    return downloadName;
  }

  const url = new URL(link.getAttribute("href"), window.location.href);
  const name = decodeURIComponent(url.pathname.split("/").pop() || "download");
  return name || "download";
};

const getFileExtension = (fileName) => {
  const match = fileName.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "";
};

const getFilePickerOptions = (fileName) => {
  const extension = getFileExtension(fileName);
  const mimeType = mimeTypes[extension] || "application/octet-stream";

  return {
    suggestedName: fileName,
    types: extension
      ? [
          {
            description: extension === "anim" ? "Unity Animation" : `${extension.toUpperCase()} File`,
            accept: {
              [mimeType]: [`.${extension}`],
            },
          },
        ]
      : undefined,
  };
};

const imageUrlToBlob = (url, mimeType) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(() => reject(new Error("Could not load image.")), 8000);

    image.addEventListener("load", () => {
      window.clearTimeout(timeout);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d").drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
          return;
        }

        reject(new Error("Could not create image blob."));
      }, mimeType);
    });

    image.addEventListener("error", () => {
      window.clearTimeout(timeout);
      reject(new Error("Could not load image."));
    });
    image.src = url.href;
  });

const xhrUrlToBlob = (url) =>
  new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("GET", url.href);
    request.responseType = "blob";
    request.addEventListener("load", () => {
      if ((request.status >= 200 && request.status < 300) || request.status === 0) {
        resolve(request.response);
        return;
      }

      reject(new Error("Download request failed."));
    });
    request.addEventListener("error", () => reject(new Error("Download request failed.")));
    request.send();
  });

const getDownloadBlob = async (url, fileName) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Download request failed.");
    }

    return response.blob();
  } catch (error) {
    try {
      return await xhrUrlToBlob(url);
    } catch (xhrError) {
      const extension = getFileExtension(fileName);
      const mimeType = mimeTypes[extension];

      if (mimeType && mimeType.startsWith("image/")) {
        return imageUrlToBlob(url, mimeType);
      }

      throw xhrError;
    }
  }
};

const saveWithFilePicker = async (fileName, url) => {
  const fileHandle = await window.showSaveFilePicker(getFilePickerOptions(fileName));
  const blob = await getDownloadBlob(url, fileName);
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
};

const showDownloadError = () => {
  window.alert(getTranslatedMessage("downloadError"));
};

const triggerBrowserDownload = (link, blob) => {
  const fallback = document.createElement("a");
  const objectUrl = blob ? URL.createObjectURL(blob) : null;
  fallback.href = objectUrl || link.href;
  fallback.download = getDownloadFileName(link);
  fallback.rel = "noopener";
  document.body.append(fallback);
  fallback.click();
  fallback.remove();

  if (objectUrl) {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
};

const setupSaveDialogDownload = (link) => {
  link.addEventListener("click", async (event) => {
    event.preventDefault();

    if (link.dataset.downloading === "true") {
      return;
    }

    link.dataset.downloading = "true";

    const fileName = getDownloadFileName(link);
    const url = new URL(link.getAttribute("href"), window.location.href);

    try {
      if (window.showSaveFilePicker && window.isSecureContext) {
        try {
          await saveWithFilePicker(fileName, url);
          return;
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }
        }
      }

      const blob = await getDownloadBlob(url, fileName);
      triggerBrowserDownload(link, blob);
    } catch (error) {
      showDownloadError();
    } finally {
      delete link.dataset.downloading;
    }
  });
};

document.querySelectorAll("a[download][href]").forEach(setupSaveDialogDownload);

const setupSlider = (slider) => {
  const cardSelector = slider.dataset.cardSelector || ".product-card";
  const cards = [...slider.querySelectorAll(cardSelector)];
  const isProductSlider = slider.classList.contains("product-slider");
  const slideItems = isProductSlider ? [...slider.querySelectorAll(".product-card")] : cards;
  const dots = slider.parentElement.querySelector("[data-slider-dots]");
  const rows = Math.max(1, Number.parseInt(slider.dataset.sliderRows || "1", 10));
  const isLooping = slider.dataset.loop === "true";
  const slideStep = 2;

  if (!cards.length || !slideItems.length) {
    return;
  }

  if (isProductSlider) {
    slider.style.scrollSnapType = "none";
  }

  const getEffectiveRows = () => {
    if (rows === 1 || slideItems.length < 2) {
      return rows;
    }

    const firstLeft = slideItems[0].getBoundingClientRect().left;
    const rowCount = slideItems.filter((card) => Math.abs(card.getBoundingClientRect().left - firstLeft) < 2).length;
    return Math.max(1, rowCount || rows);
  };

  const getSnapPositions = () => {
    const effectiveRows = getEffectiveRows();
    const sliderLeft = slider.getBoundingClientRect().left;
    return slideItems
      .filter((_, index) => index % effectiveRows === 0)
      .map((card) => card.getBoundingClientRect().left - sliderLeft + slider.scrollLeft);
  };

  const getStepCount = () => Math.ceil(getSnapPositions().length / slideStep);

  const getCurrentIndex = () => {
    const positions = getSnapPositions();
    if (!positions.length) {
      return 0;
    }

    return positions.reduce((closestIndex, position, index) => {
      const closestDistance = Math.abs(positions[closestIndex] - slider.scrollLeft);
      const distance = Math.abs(position - slider.scrollLeft);
      return distance < closestDistance ? index : closestIndex;
    }, 0);
  };

  const scrollToIndex = (index, behavior = "smooth") => {
    const positions = getSnapPositions();
    const lastIndex = positions.length - 1;
    const targetIndex = Math.max(0, Math.min(index, lastIndex));
    slider.scrollTo({ left: positions[targetIndex], behavior });
  };

  const fastScrollToStart = () => {
    const start = slider.scrollLeft;
    const duration = 20;
    const startedAt = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      slider.scrollLeft = start * (1 - progress);

      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }

      slider.scrollLeft = 0;
      updateActiveDot();
    };

    requestAnimationFrame(step);
  };

  const slideByCard = (direction) => {
    const currentIndex = getCurrentIndex();
    const lastIndex = getSnapPositions().length - 1;
    const endThreshold = slider.scrollWidth - slider.clientWidth - 4;

    if (direction > 0 && (currentIndex >= lastIndex || slider.scrollLeft >= endThreshold)) {
      fastScrollToStart();
      return;
    }

    scrollToIndex(currentIndex + direction * slideStep);
  };

  let isDragging = false;
  let isPointerDown = false;
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragStartScrollLeft = 0;
  let autoSlideTimer = window.setInterval(() => slideByCard(1), 3600);

  const restartAutoSlide = () => {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = window.setInterval(() => slideByCard(1), 3600);
  };

  const loopToStartIfNeeded = () => {
    if (isLooping) {
      return;
    }

    const endThreshold = slider.scrollWidth - slider.clientWidth - 4;

    if (slider.scrollLeft >= endThreshold) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const updateActiveDot = () => {
    if (!dots) {
      return;
    }

    const index = Math.floor(getCurrentIndex() / slideStep);
    const dotButtons = [...dots.querySelectorAll(".slider-dot")];
    dotButtons.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === Math.min(index, dotButtons.length - 1));
    });
  };

  const renderDots = () => {
    if (!dots) {
      return;
    }

    const dotCount = getStepCount();

    if (dots.childElementCount === dotCount) {
      updateActiveDot();
      return;
    }

    dots.textContent = "";
    Array.from({ length: dotCount }).forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `${index + 1}列目へ`);
      dot.addEventListener("click", () => {
        scrollToIndex(index * slideStep);
        restartAutoSlide();
      });
      dots.append(dot);
    });

    updateActiveDot();
  };

  renderDots();

  slider.addEventListener("scroll", () => {
    updateActiveDot();
    window.clearTimeout(slider.scrollEndTimer);
    slider.scrollEndTimer = window.setTimeout(() => {
      loopToStartIfNeeded();
      if (!isLooping) {
        updateActiveDot();
      }
    }, 180);
  });

  if (isProductSlider) {
    slider.addEventListener(
      "wheel",
      (event) => {
        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }

        const wheelDeltaY = event.deltaY;
        const scrollYBeforeWheel = window.scrollY;
        window.requestAnimationFrame(() => {
          const scrolledY = window.scrollY - scrollYBeforeWheel;
          const minimumScrollY = Math.max(12, Math.abs(wheelDeltaY) * 0.5);
          const hasEnoughVerticalScroll = Math.sign(scrolledY) === Math.sign(wheelDeltaY) && Math.abs(scrolledY) >= minimumScrollY;

          if (hasEnoughVerticalScroll) {
            return;
          }

          const scrollRoot = document.scrollingElement || document.documentElement;
          const originalScrollBehavior = scrollRoot.style.scrollBehavior;
          scrollRoot.style.scrollBehavior = "auto";
          scrollRoot.scrollTop += wheelDeltaY - scrolledY;
          window.requestAnimationFrame(() => {
            scrollRoot.style.scrollBehavior = originalScrollBehavior;
          });
        });
      },
      { passive: true }
    );
  }

  const releaseSliderPointer = (event) => {
    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }
  };

  const cancelPointerDrag = (event) => {
    isPointerDown = false;
    isDragging = false;
    slider.classList.remove("is-dragging");
    releaseSliderPointer(event);
    restartAutoSlide();
  };

  slider.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.pointerType === "touch") {
      window.clearInterval(autoSlideTimer);
      return;
    }

    isPointerDown = true;
    isDragging = false;
    hasDragged = false;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
    dragStartScrollLeft = slider.scrollLeft;
    window.clearInterval(autoSlideTimer);
  });

  slider.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  slider.addEventListener("pointermove", (event) => {
    if (!isPointerDown) {
      return;
    }

    const movedX = event.clientX - dragStartX;
    const movedY = event.clientY - dragStartY;
    const absX = Math.abs(movedX);
    const absY = Math.abs(movedY);

    if (!isDragging) {
      if (absY > absX + 8) {
        cancelPointerDrag(event);
        return;
      }

      if (absX <= absY + 8) {
        return;
      }

      isDragging = true;
      hasDragged = true;
      slider.classList.add("is-dragging");
      slider.setPointerCapture(event.pointerId);
    }

    hasDragged = true;
    event.preventDefault();
    slider.scrollLeft = dragStartScrollLeft - movedX;
  });

  slider.addEventListener(
    "click",
    (event) => {
      if (!hasDragged) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      window.setTimeout(() => {
        hasDragged = false;
      }, 0);
    },
    true
  );

  const stopDragging = (event) => {
    if (!isPointerDown && !isDragging) {
      return;
    }

    isPointerDown = false;
    isDragging = false;
    slider.classList.remove("is-dragging");
    restartAutoSlide();
    releaseSliderPointer(event);
  };

  slider.addEventListener("pointerup", stopDragging);
  slider.addEventListener("pointercancel", stopDragging);
  slider.addEventListener("touchend", restartAutoSlide, { passive: true });
  slider.addEventListener("touchcancel", restartAutoSlide, { passive: true });
  slider.addEventListener("lostpointercapture", () => {
    isPointerDown = false;
    isDragging = false;
    slider.classList.remove("is-dragging");
    restartAutoSlide();
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(autoSlideTimer));
  slider.addEventListener("mouseleave", restartAutoSlide);
  window.addEventListener("resize", renderDots);
};

const setupTipsPagination = () => {
  document.querySelectorAll("[data-tips-list]").forEach((container) => {
    const panel = container.closest(".text-panel") || document;
    const controls = panel.querySelector("[data-tips-pagination]");
    const list = container.querySelector(".tips-list-column");

    if (!controls || !list) {
      return;
    }

    const cards = [...list.querySelectorAll(".tip-list-card")];
    const previousButton = controls.querySelector("[data-tips-prev]");
    const nextButton = controls.querySelector("[data-tips-next]");
    const status = controls.querySelector("[data-tips-status]");
    const pageSize = Math.max(1, Number.parseInt(container.dataset.pageSize || "5", 10));
    const pageCount = Math.max(1, Math.ceil(cards.length / pageSize));
    let currentPage = 0;

    const render = () => {
      cards.forEach((card, index) => {
        const isVisible = Math.floor(index / pageSize) === currentPage;
        card.hidden = !isVisible;
        card.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });

      if (status) {
        status.textContent = `${currentPage + 1} / ${pageCount}`;
      }

      if (previousButton) {
        previousButton.disabled = currentPage === 0;
      }

      if (nextButton) {
        nextButton.disabled = currentPage === pageCount - 1;
      }
    };

    const moveToPage = (page) => {
      currentPage = Math.min(Math.max(page, 0), pageCount - 1);
      render();
      scrollToPageTop();
    };

    previousButton?.addEventListener("click", () => moveToPage(currentPage - 1));
    nextButton?.addEventListener("click", () => moveToPage(currentPage + 1));

    render();
  });
};

const setupBoothFilters = () => {
  document.querySelectorAll("[data-booth-filter]").forEach((filterPanel) => {
    const section = filterPanel.closest(".booth-list-section") || document;
    const list = section.querySelector("[data-booth-list]");
    const cards = [...section.querySelectorAll("[data-booth-tags]")];
    const filterButtons = [...filterPanel.querySelectorAll("[data-booth-filter-button]")];
    const subtagPanel = section.querySelector("[data-booth-subtag-filter]");
    const subtagButtons = subtagPanel
      ? [...subtagPanel.querySelectorAll("[data-booth-subtag-button]")]
      : [];
    const subtagToggle = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-toggle]") : null;
    const subtagRowToggle = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-row-toggle]") : null;
    const subtagPicker = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-picker]") : null;
    const subtagSearch = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-search]") : null;
    const subtagSearchClear = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-search-clear]") : null;
    const subtagClose = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-close]") : null;
    const subtagEmpty = subtagPanel ? subtagPanel.querySelector("[data-booth-subtag-empty]") : null;
    const sortButtons = [...section.querySelectorAll("[data-booth-sort-button]")];
    const pagination = section.querySelector("[data-booth-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-booth-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-booth-page-status]") : null;
    const status = section.querySelector("[data-booth-filter-status]");
    const suffix = filterPanel.dataset.countSuffix || " items";
    const singularSuffix = filterPanel.dataset.countSingularSuffix || suffix;
    const pageSize = Number(filterPanel.dataset.pageSize || 0);
    const query = new URLSearchParams(window.location.search);
    const categoryAliases = {
      motion: "universal",
      universal: "universal",
      "solo-motion": "solo",
      solo: "solo",
      pose: "pose",
      material: "material",
    };
    const requestedCategory = query.get("category");
    const requestedTag = query.get("tag") || categoryAliases[requestedCategory] || requestedCategory;
    const requestedSubtag = query.get("subtag") || query.get("avatar");
    const hasTag = (tag) => tag === "all"
      || filterButtons.some((button) => button.dataset.boothFilterButton === tag);
    const hasSubtag = (subtag) => subtag === "all"
      || subtagButtons.some((button) => button.dataset.boothSubtagButton === subtag);
    let activeTag = requestedTag && hasTag(requestedTag) ? requestedTag : "all";
    let activeSubtag = requestedSubtag && hasSubtag(requestedSubtag) ? requestedSubtag : "all";
    let activeSort = "default";
    let currentPage = 1;

    if (!cards.length || !filterButtons.length) {
      return;
    }

    cards.forEach((card, index) => {
      card.dataset.originalIndex = String(index);
    });

    const getOriginalIndex = (card) => Number(card.dataset.originalIndex || 0);
    const getPopularity = (card) => Number(card.dataset.popularity || 0);
    const getSubtagLabel = (subtag) => {
      const button = subtagButtons.find((item) => item.dataset.boothSubtagButton === subtag
        && !item.hasAttribute("data-booth-subtag-primary"))
        || subtagButtons.find((item) => item.dataset.boothSubtagButton === subtag);

      return button?.textContent?.trim() || subtag;
    };
    const normalizeSubtagSearchText = (value) => value
      .trim()
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[\u30a1-\u30f6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));
    const getSubtagSearchText = (button) => normalizeSubtagSearchText(
      `${button.textContent || ""} ${button.dataset.boothSubtagSearchText || ""}`,
    );
    const getCountText = (count) => {
      if (getDisplayLanguage() === "en") {
        return `${count} ${count === 1 ? "item" : "items"}`;
      }

      return `${count}${count === 1 ? singularSuffix : suffix}`;
    };
    const getLanguageAwareLabel = (label) => (getDisplayLanguage() === "en" ? translateText(label) : label);
    const updateSubtagToggleLabel = () => {
      if (!subtagToggle) {
        return;
      }

      const defaultLabel = subtagToggle.dataset.defaultLabel || subtagToggle.textContent.trim();
      subtagToggle.textContent = getLanguageAwareLabel(activeSubtag === "all" ? defaultLabel : getSubtagLabel(activeSubtag));
      subtagToggle.classList.toggle("is-selected", activeSubtag !== "all");
    };
    const clearSubtagSearch = () => {
      if (!subtagSearch) {
        return;
      }

      subtagSearch.value = "";
      filterSubtagOptions();
    };
    const setSubtagPickerOpen = (isOpen, shouldFocus = false) => {
      if (!subtagToggle || !subtagPicker) {
        return;
      }

      subtagPicker.classList.toggle("is-open", isOpen);
      subtagPanel?.classList.toggle("is-subtag-search-open", isOpen);
      subtagToggle.setAttribute("aria-expanded", String(isOpen));

      if (subtagRowToggle) {
        subtagRowToggle.setAttribute("aria-expanded", String(isOpen));
        const rowToggleText = isOpen
          ? (subtagRowToggle.dataset.closeLabel || "閉じる ▲")
          : (subtagRowToggle.dataset.openLabel || "もっと見る ▼");
        subtagRowToggle.textContent = getLanguageAwareLabel(rowToggleText);
        subtagRowToggle.setAttribute(
          "aria-label",
          getLanguageAwareLabel(isOpen
            ? (subtagRowToggle.dataset.closeAriaLabel || subtagRowToggle.textContent)
            : (subtagRowToggle.dataset.openAriaLabel || subtagRowToggle.textContent)),
        );
      }

      if (!isOpen) {
        clearSubtagSearch();
      }

      if (isOpen && shouldFocus && subtagSearch) {
        window.requestAnimationFrame(() => subtagSearch.focus());
      }
    };
    const filterSubtagOptions = () => {
      if (!subtagSearch) {
        return;
      }

      const queryText = normalizeSubtagSearchText(subtagSearch.value);
      let visibleCharacterCount = 0;

      subtagButtons.forEach((button) => {
        if (button.hasAttribute("data-booth-subtag-primary")) {
          return;
        }

        const isAllButton = button.dataset.boothSubtagButton === "all";
        const isMatching = isAllButton || !queryText || getSubtagSearchText(button).includes(queryText);
        button.hidden = !isMatching;

        if (!isAllButton && isMatching) {
          visibleCharacterCount += 1;
        }
      });

      if (subtagEmpty) {
        subtagEmpty.hidden = !queryText || visibleCharacterCount > 0;
      }
    };

    const render = () => {
      const matchingCards = [];

      cards.forEach((card) => {
        const tags = (card.dataset.boothTags || "").split(/\s+/);
        const subtags = (card.dataset.boothSubtags || "").split(/\s+/);
        const isMatchingTag = activeTag === "all" || tags.includes(activeTag);
        const isMatchingSubtag = activeSubtag === "all" || subtags.includes(activeSubtag);
        const isMatching = isMatchingTag && isMatchingSubtag;

        if (isMatching) {
          matchingCards.push(card);
        }
      });

      const sortedMatchingCards = [...matchingCards].sort((firstCard, secondCard) => {
        if (activeSort === "popular") {
          return getPopularity(secondCard) - getPopularity(firstCard)
            || getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
        }

        return getOriginalIndex(firstCard) - getOriginalIndex(secondCard);
      });
      const shouldPaginate = pageSize > 0 && sortedMatchingCards.length > pageSize;
      const pageCount = shouldPaginate ? Math.ceil(sortedMatchingCards.length / pageSize) : 1;
      currentPage = Math.min(Math.max(currentPage, 1), pageCount);

      const firstPageIndex = (currentPage - 1) * pageSize;
      const displayedCards = shouldPaginate
        ? sortedMatchingCards.slice(firstPageIndex, firstPageIndex + pageSize)
        : sortedMatchingCards;
      const displayedCardSet = new Set(displayedCards);
      const matchingCardSet = new Set(sortedMatchingCards);

      cards.forEach((card) => {
        const isDisplayed = displayedCardSet.has(card);
        card.classList.toggle("is-filter-hidden", !isDisplayed);
        card.hidden = !isDisplayed;
        card.style.display = isDisplayed ? "" : "none";
        card.setAttribute("aria-hidden", isDisplayed ? "false" : "true");
      });

      filterButtons.forEach((button) => {
        const isActive = button.dataset.boothFilterButton === activeTag;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      sortButtons.forEach((button) => {
        const isActive = button.dataset.boothSortButton === activeSort;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      subtagButtons.forEach((button) => {
        const isActive = button.dataset.boothSubtagButton === activeSubtag;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      updateSubtagToggleLabel();

      if (status) {
        const matchingCount = sortedMatchingCards.length;
        status.textContent = getCountText(matchingCount);
      }

      if (pagination) {
        pagination.hidden = !shouldPaginate;
      }

      if (pageStatus) {
        pageStatus.textContent = shouldPaginate ? `${currentPage} / ${pageCount}` : "";
      }

      pageButtons.forEach((button) => {
        const direction = button.dataset.boothPageButton;
        const isPrev = direction === "prev";
        button.disabled = !shouldPaginate
          || (isPrev && currentPage <= 1)
          || (!isPrev && currentPage >= pageCount);
      });

      if (list) {
        displayedCards.forEach((card) => list.appendChild(card));
        sortedMatchingCards
          .filter((card) => !displayedCardSet.has(card))
          .forEach((card) => list.appendChild(card));
        cards
          .filter((card) => !matchingCardSet.has(card))
          .forEach((card) => list.appendChild(card));
      }
    };

    const syncFilterUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      url.searchParams.delete("avatar");

      if (activeTag === "all") {
        url.searchParams.delete("tag");
      } else {
        url.searchParams.set("tag", activeTag);
      }

      if (activeSubtag === "all") {
        url.searchParams.delete("subtag");
      } else {
        url.searchParams.set("subtag", activeSubtag);
      }

      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeTag = button.dataset.boothFilterButton || "all";
        currentPage = 1;
        syncFilterUrl();
        render();
      });
    });

    subtagButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeSubtag = button.dataset.boothSubtagButton || "all";
        currentPage = 1;
        syncFilterUrl();
        render();

        setSubtagPickerOpen(false);
      });
    });

    if (subtagToggle) {
      subtagToggle.addEventListener("click", () => {
        const isOpen = subtagToggle.getAttribute("aria-expanded") === "true";
        setSubtagPickerOpen(!isOpen, !isOpen);
      });
    }

    if (subtagRowToggle) {
      subtagRowToggle.addEventListener("click", () => {
        const isOpen = subtagRowToggle.getAttribute("aria-expanded") === "true";
        setSubtagPickerOpen(!isOpen, !isOpen);
      });
    }

    if (subtagSearch) {
      subtagSearch.addEventListener("input", filterSubtagOptions);
      subtagSearch.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") {
          return;
        }

        const hasSearchText = Boolean(subtagSearch.value.trim());
        const firstVisibleButton = subtagButtons.find((button) => !button.hidden
          && (!hasSearchText || button.dataset.boothSubtagButton !== "all"));
        if (!firstVisibleButton) {
          return;
        }

        event.preventDefault();
        firstVisibleButton.click();
      });
    }

    if (subtagSearchClear) {
      subtagSearchClear.addEventListener("click", () => {
        clearSubtagSearch();
        subtagSearch?.focus();
      });
    }

    if (subtagClose) {
      subtagClose.addEventListener("click", () => {
        setSubtagPickerOpen(false);
        subtagToggle?.focus();
      });
    }

    document.addEventListener("click", (event) => {
      if (!subtagPanel || !subtagPicker?.classList.contains("is-open")) {
        return;
      }

      if (subtagPanel.contains(event.target)) {
        return;
      }

      setSubtagPickerOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !subtagPicker?.classList.contains("is-open")) {
        return;
      }

      setSubtagPickerOpen(false);
      subtagToggle?.focus();
    });

    sortButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeSort = button.dataset.boothSortButton || "default";
        currentPage = 1;
        render();
      });
    });

    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage += button.dataset.boothPageButton === "next" ? 1 : -1;
        render();
        scrollToPageTop();
      });
    });

    render();
  });
};

const setupCardReveal = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealSelectors = [
    ".material-card",
    ".character-list-card",
    ".pose-card",
    ".product-card",
    ".booth-list-card",
  ].join(",");
  const cards = [...document.querySelectorAll(revealSelectors)];

  if (!cards.length || reduceMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const finishReveal = (card) => {
    card.classList.add("is-visible");
    window.setTimeout(() => {
      card.classList.remove("js-reveal-card", "is-visible");
    }, 700);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        finishReveal(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  cards.forEach((card) => {
    card.classList.add("js-reveal-card");
    observer.observe(card);
  });
};

const setupProductGallery = () => {
  const gallery = document.querySelector("[data-product-gallery]");
  const dataElement = document.querySelector("#product-gallery-data");
  const mainImage = document.querySelector("[data-product-main-image]");

  if (!gallery || !dataElement || !mainImage) {
    return;
  }

  let images = [];
  try {
    images = JSON.parse(dataElement.textContent || "[]");
  } catch (error) {
    return;
  }

  if (!images.length) {
    return;
  }

  let currentIndex = 0;
  let visibleThumbs = [];
  const inlineThumbs = gallery.querySelector("[data-gallery-inline-thumbs]");
  const inlinePrev = gallery.querySelector("[data-gallery-inline-prev]");
  const inlineNext = gallery.querySelector("[data-gallery-inline-next]");
  const mainTrigger = gallery.querySelector("[data-gallery-open]");
  const isEnglish = () => getDisplayLanguage() === "en" || document.documentElement.lang === "en";
  const getGalleryText = (value) => (isEnglish() ? translateText(value) : value);
  const productName = document.querySelector("#product-title")?.textContent?.trim() || (isEnglish() ? "Product" : "商品");
  const closeText = isEnglish() ? "Close" : "閉じる";
  const previousText = isEnglish() ? "Previous image" : "前の画像";
  const nextText = isEnglish() ? "Next image" : "次の画像";
  const modal = document.createElement("div");
  modal.className = "product-lightbox";
  modal.hidden = true;
  modal.tabIndex = -1;
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "商品画像ギャラリー");
  modal.innerHTML = `
    <div class="product-lightbox-stage">
      <div class="product-lightbox-image-wrap" data-gallery-stage>
        <button class="product-lightbox-close" type="button" data-gallery-close aria-label="${closeText}">×</button>
        <button class="product-lightbox-nav" type="button" data-gallery-prev aria-label="${previousText}">‹</button>
        <img class="product-lightbox-image" data-gallery-modal-image alt="">
        <button class="product-lightbox-nav" type="button" data-gallery-next aria-label="${nextText}">›</button>
      </div>
    </div>
    <aside class="product-lightbox-side">
      <p class="product-lightbox-title">${productName}</p>
      <p class="product-lightbox-count" data-gallery-count></p>
      <div class="product-lightbox-thumbs" data-gallery-modal-thumbs></div>
    </aside>
  `;
  document.body.append(modal);

  const modalImage = modal.querySelector("[data-gallery-modal-image]");
  const modalCount = modal.querySelector("[data-gallery-count]");
  const modalThumbs = modal.querySelector("[data-gallery-modal-thumbs]");
  const closeButton = modal.querySelector("[data-gallery-close]");
  const stage = modal.querySelector("[data-gallery-stage]");
  mainImage.draggable = false;

  const toCssImageUrl = (url) => `url("${String(url).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}")`;

  const getThumbnailSource = (image) => image?.thumb || image?.src || "";

  const setThumbnailBackground = (button, image) => {
    const source = getThumbnailSource(image);

    if (source) {
      button.style.backgroundImage = toCssImageUrl(source);
    }
  };

  const createThumbnailImage = (image, index, options = {}) => {
    const thumbnailSource = getThumbnailSource(image);
    const fallbackSource = image?.src || thumbnailSource;
    const img = document.createElement("img");

    if (options.width) {
      img.width = options.width;
    }

    if (options.height) {
      img.height = options.height;
    }

    img.src = thumbnailSource;
    img.alt = getGalleryText(image?.alt || productName);
    img.loading = index === 0 ? "eager" : "lazy";
    img.decoding = index === 0 ? "sync" : "async";

    if (index === 0 && "fetchPriority" in img) {
      img.fetchPriority = "high";
    }

    img.addEventListener("error", () => {
      if (fallbackSource && img.getAttribute("src") !== fallbackSource) {
        img.src = fallbackSource;
      }
    });

    return img;
  };

  const renderInlineThumbs = () => {
    if (!inlineThumbs) {
      visibleThumbs = [...gallery.querySelectorAll("[data-gallery-thumb]")];
      return;
    }

    inlineThumbs.textContent = "";

    images.forEach((image, index) => {
      const button = document.createElement("button");
      button.className = "product-thumbnail";
      button.type = "button";
      button.dataset.galleryIndex = String(index);
      button.dataset.galleryThumb = "";
      button.setAttribute("aria-label", isEnglish() ? `${getGalleryText(productName)} product image ${index + 1}` : `${productName} 商品画像 ${index + 1}枚目`);
      setThumbnailBackground(button, image);
      button.append(createThumbnailImage(image, index, { width: 96, height: 96 }));
      inlineThumbs.append(button);
    });

    visibleThumbs = [...inlineThumbs.querySelectorAll("[data-gallery-thumb]")];
  };

  const scrollActiveInlineThumb = () => {
    if (!inlineThumbs) {
      return;
    }

    const activeThumb = visibleThumbs.find((button) => Number(button.dataset.galleryIndex) === currentIndex);
    activeThumb?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  let hasMainImageSynced = false;
  let mainImageLoadSequence = 0;
  const mainImageCache = new Map();
  let inlineScrollSelectionMuted = false;
  let inlineScrollSelectionTimer = null;
  let inlineScrollSelectionFrame = null;

  const preloadMainImage = (image) => {
    if (!image?.src) {
      return Promise.resolve(false);
    }

    if (mainImage.getAttribute("src") === image.src && mainImage.complete) {
      return Promise.resolve(true);
    }

    const cachedImage = mainImageCache.get(image.src);

    if (cachedImage) {
      return cachedImage;
    }

    const loader = new Image();
    loader.decoding = "async";
    loader.src = image.src;

    const loadPromise = (loader.decode
      ? loader.decode()
      : new Promise((resolve, reject) => {
        loader.addEventListener("load", resolve, { once: true });
        loader.addEventListener("error", reject, { once: true });
      }))
      .then(() => true)
      .catch(() => false);

    mainImageCache.set(image.src, loadPromise);
    return loadPromise;
  };

  const updateMainImageWhenReady = (image) => {
    if (!image?.src) {
      return;
    }

    const loadSequence = ++mainImageLoadSequence;

    preloadMainImage(image).then((isReady) => {
      if (!isReady || loadSequence !== mainImageLoadSequence) {
        return;
      }

      mainImage.src = image.src;
      mainImage.srcset = "";
      mainImage.alt = getGalleryText(image.alt);
      hasMainImageSynced = true;
    });
  };

  const muteInlineScrollSelection = () => {
    inlineScrollSelectionMuted = true;
    window.clearTimeout(inlineScrollSelectionTimer);
    inlineScrollSelectionTimer = window.setTimeout(() => {
      inlineScrollSelectionMuted = false;
    }, 360);
  };

  const setImage = (index, updateMain = true, syncInlineThumb = true) => {
    currentIndex = (index + images.length) % images.length;
    const image = images[currentIndex];

    if (updateMain) {
      updateMainImageWhenReady(image);
    }

    if (modalImage) {
      modalImage.src = image.src;
      modalImage.alt = getGalleryText(image.alt);
    }

    if (modalCount) {
      modalCount.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    visibleThumbs.forEach((button) => {
      const isActive = Number(button.dataset.galleryIndex) === currentIndex;
      button.classList.toggle("is-active", isActive);
    });

    if (syncInlineThumb) {
      muteInlineScrollSelection();
      scrollActiveInlineThumb();
    }

    modalThumbs?.querySelectorAll("[data-gallery-modal-thumb]").forEach((button) => {
      const isActive = Number(button.dataset.galleryIndex) === currentIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });

    preloadMainImage(images[(currentIndex + 1) % images.length]);
    preloadMainImage(images[(currentIndex - 1 + images.length) % images.length]);
  };

  const shiftInlineImage = (direction) => {
    setImage(currentIndex + direction);
  };

  images.forEach((image, index) => {
    const button = document.createElement("button");
    button.className = "product-lightbox-thumb";
    button.type = "button";
    button.dataset.galleryIndex = String(index);
    button.dataset.galleryModalThumb = "";
    button.setAttribute("aria-label", isEnglish ? `Product image ${index + 1}` : `商品画像 ${index + 1}枚目`);
    setThumbnailBackground(button, image);
    button.append(createThumbnailImage(image, index));
    button.addEventListener("click", () => setImage(index, false));
    modalThumbs?.append(button);
  });

  const openModal = () => {
    setImage(currentIndex, false);
    modal.hidden = false;
    document.body.classList.add("product-lightbox-open");
    modal.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("product-lightbox-open");
  };

  let mainPointerId = null;
  let mainStartX = 0;
  let mainStartY = 0;
  let mainSuppressClick = false;
  let mainSuppressTimer = null;

  const suppressNextMainClick = () => {
    mainSuppressClick = true;
    window.clearTimeout(mainSuppressTimer);
    mainSuppressTimer = window.setTimeout(() => {
      mainSuppressClick = false;
    }, 300);
  };

  const resetMainDrag = (event) => {
    mainTrigger?.classList.remove("is-dragging");

    if (mainTrigger?.hasPointerCapture(event.pointerId)) {
      mainTrigger.releasePointerCapture(event.pointerId);
    }

    mainPointerId = null;
  };

  const finishMainDrag = (event) => {
    if (mainPointerId !== event.pointerId) {
      return;
    }

    const movedX = event.clientX - mainStartX;
    const movedY = event.clientY - mainStartY;
    const isHorizontalSlide = Math.abs(movedX) >= 48 && Math.abs(movedX) > Math.abs(movedY) * 1.15;
    resetMainDrag(event);

    if (!isHorizontalSlide) {
      return;
    }

    suppressNextMainClick();
    setImage(currentIndex + (movedX < 0 ? 1 : -1));
  };

  mainTrigger?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.isPrimary === false) {
      return;
    }

    mainPointerId = event.pointerId;
    mainStartX = event.clientX;
    mainStartY = event.clientY;
    try {
      mainTrigger.setPointerCapture(event.pointerId);
    } catch (error) {
      // Some synthetic or interrupted pointer streams cannot be captured.
    }
  });

  mainTrigger?.addEventListener("pointermove", (event) => {
    if (mainPointerId !== event.pointerId) {
      return;
    }

    const movedX = event.clientX - mainStartX;
    const movedY = event.clientY - mainStartY;

    if (Math.abs(movedX) > 8 && Math.abs(movedX) > Math.abs(movedY) * 1.15) {
      mainTrigger.classList.add("is-dragging");
      event.preventDefault();
    }
  });

  mainTrigger?.addEventListener("pointerup", finishMainDrag);
  mainTrigger?.addEventListener("pointercancel", resetMainDrag);
  mainTrigger?.addEventListener("lostpointercapture", () => {
    mainTrigger.classList.remove("is-dragging");
    mainPointerId = null;
  });

  let thumbPointerId = null;
  let thumbStartX = 0;
  let thumbStartY = 0;
  let thumbStartScrollLeft = 0;
  let thumbHasDragged = false;
  let thumbPressTarget = null;
  let thumbSuppressClick = false;
  let thumbSuppressTimer = null;

  const getInlineThumbIndex = (target) => {
    const button = target.closest("[data-gallery-thumb]");

    if (!button || !inlineThumbs?.contains(button)) {
      return null;
    }

    return Number(button.dataset.galleryIndex);
  };

  const getLeadingInlineThumbIndex = () => {
    if (!inlineThumbs || !visibleThumbs.length) {
      return null;
    }

    const sliderRect = inlineThumbs.getBoundingClientRect();
    let leadingThumb = null;
    let leadingDistance = Number.POSITIVE_INFINITY;

    visibleThumbs.forEach((button) => {
      const rect = button.getBoundingClientRect();
      const isVisible = rect.right > sliderRect.left + 1 && rect.left < sliderRect.right - 1;

      if (!isVisible) {
        return;
      }

      const distance = Math.abs(rect.left - sliderRect.left);

      if (distance < leadingDistance) {
        leadingDistance = distance;
        leadingThumb = button;
      }
    });

    return leadingThumb ? Number(leadingThumb.dataset.galleryIndex) : null;
  };

  const syncMainImageToLeadingInlineThumb = () => {
    if (inlineScrollSelectionMuted || inlineScrollSelectionFrame !== null) {
      return;
    }

    inlineScrollSelectionFrame = window.requestAnimationFrame(() => {
      inlineScrollSelectionFrame = null;

      if (inlineScrollSelectionMuted) {
        return;
      }

      const index = getLeadingInlineThumbIndex();
      if (!Number.isFinite(index) || (index === currentIndex && hasMainImageSynced)) {
        return;
      }

      setImage(index, true, false);
    });
  };

  const suppressNextThumbClick = () => {
    thumbSuppressClick = true;
    window.clearTimeout(thumbSuppressTimer);
    thumbSuppressTimer = window.setTimeout(() => {
      thumbSuppressClick = false;
    }, 300);
  };

  const resetThumbDrag = (event) => {
    inlineThumbs?.classList.remove("is-dragging");

    if (inlineThumbs?.hasPointerCapture(event.pointerId)) {
      inlineThumbs.releasePointerCapture(event.pointerId);
    }

    thumbPointerId = null;
    thumbPressTarget = null;
  };

  inlineThumbs?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.isPrimary === false) {
      return;
    }

    inlineScrollSelectionMuted = false;
    window.clearTimeout(inlineScrollSelectionTimer);

    thumbPointerId = event.pointerId;
    thumbStartX = event.clientX;
    thumbStartY = event.clientY;
    thumbStartScrollLeft = inlineThumbs.scrollLeft;
    thumbHasDragged = false;
    thumbPressTarget = event.target.closest("[data-gallery-thumb]");
    try {
      inlineThumbs.setPointerCapture(event.pointerId);
    } catch (error) {
      // Keep drag handling alive even if pointer capture is unavailable.
    }

    if (event.pointerType !== "touch") {
      event.preventDefault();
    }
  });

  inlineThumbs?.addEventListener("pointermove", (event) => {
    if (thumbPointerId !== event.pointerId) {
      return;
    }

    const movedX = event.clientX - thumbStartX;
    const movedY = event.clientY - thumbStartY;

    if (Math.abs(movedX) < 8 || Math.abs(movedX) < Math.abs(movedY) * 1.15) {
      return;
    }

    thumbHasDragged = true;
    inlineThumbs.classList.add("is-dragging");
    inlineThumbs.scrollLeft = thumbStartScrollLeft - movedX;
    syncMainImageToLeadingInlineThumb();
    event.preventDefault();
  });

  inlineThumbs?.addEventListener("pointerup", (event) => {
    if (thumbPointerId !== event.pointerId) {
      return;
    }

    const pressedThumb = thumbPressTarget;
    const shouldSelect = !thumbHasDragged && pressedThumb;

    if (thumbHasDragged || shouldSelect) {
      suppressNextThumbClick();
    }

    resetThumbDrag(event);

    if (shouldSelect) {
      const index = getInlineThumbIndex(pressedThumb);

      if (Number.isFinite(index)) {
        setImage(index);
      }
    }
  });

  inlineThumbs?.addEventListener("pointercancel", resetThumbDrag);
  inlineThumbs?.addEventListener("lostpointercapture", () => {
    inlineThumbs.classList.remove("is-dragging");
    thumbPointerId = null;
  });

  inlineThumbs?.addEventListener(
    "click",
    (event) => {
      if (!thumbSuppressClick) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      thumbSuppressClick = false;
      window.clearTimeout(thumbSuppressTimer);
    },
    true
  );

  inlineThumbs?.addEventListener("click", (event) => {
    const index = getInlineThumbIndex(event.target);

    if (Number.isFinite(index)) {
      setImage(index);
    }
  });

  inlineThumbs?.addEventListener("scroll", syncMainImageToLeadingInlineThumb, { passive: true });

  inlinePrev?.addEventListener("click", () => shiftInlineImage(-1));
  inlineNext?.addEventListener("click", () => shiftInlineImage(1));

  document.querySelectorAll("[data-gallery-open]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (button === mainTrigger && mainSuppressClick) {
        event.preventDefault();
        mainSuppressClick = false;
        window.clearTimeout(mainSuppressTimer);
        return;
      }

      openModal();
    });
  });

  modal.querySelector("[data-gallery-prev]")?.addEventListener("click", () => setImage(currentIndex - 1, false));
  modal.querySelector("[data-gallery-next]")?.addEventListener("click", () => setImage(currentIndex + 1, false));
  closeButton?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target === modal.querySelector(".product-lightbox-stage")) {
      closeModal();
    }
  });

  let stagePointerId = null;
  let stageStartX = 0;
  let stageStartY = 0;
  let stageMoved = false;

  const finishStageDrag = (event) => {
    if (stagePointerId !== event.pointerId) {
      return;
    }

    const movedX = event.clientX - stageStartX;
    const movedY = event.clientY - stageStartY;

    stage?.classList.remove("is-dragging");
    if (stage?.hasPointerCapture(event.pointerId)) {
      stage.releasePointerCapture(event.pointerId);
    }

    stagePointerId = null;

    if (Math.abs(movedX) < 56 || Math.abs(movedX) < Math.abs(movedY) * 1.15) {
      return;
    }

    setImage(currentIndex + (movedX < 0 ? 1 : -1), false);
  };

  stage?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button")) {
      return;
    }

    stagePointerId = event.pointerId;
    stageStartX = event.clientX;
    stageStartY = event.clientY;
    stageMoved = false;
    stage.setPointerCapture(event.pointerId);
  });

  stage?.addEventListener("pointermove", (event) => {
    if (stagePointerId !== event.pointerId) {
      return;
    }

    if (Math.abs(event.clientX - stageStartX) > 8) {
      stageMoved = true;
      stage.classList.add("is-dragging");
    }
  });

  stage?.addEventListener("pointerup", finishStageDrag);
  stage?.addEventListener("pointercancel", finishStageDrag);
  stage?.addEventListener("lostpointercapture", () => {
    if (!stageMoved) {
      return;
    }

    stage?.classList.remove("is-dragging");
    stagePointerId = null;
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    } else if (event.key === "ArrowLeft") {
      setImage(currentIndex - 1, false);
    } else if (event.key === "ArrowRight") {
      setImage(currentIndex + 1, false);
    }
  });

  renderInlineThumbs();
  setImage(0, false);
};

const runAfterInitialScrollWindow = (callback) => {
  let isScheduled = false;
  let hasRun = false;

  const run = () => {
    if (hasRun) {
      return;
    }

    hasRun = true;
    callback();
  };

  const schedule = () => {
    if (isScheduled || hasRun) {
      return;
    }

    isScheduled = true;

    const requestRun = () => {
      if (hasRun) {
        return;
      }

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 900 });
        return;
      }

      window.setTimeout(run, 0);
    };

    window.setTimeout(requestRun, 300);
  };

  const scheduleFallback = () => {
    if (hasRun) {
      return;
    }

    schedule();
  };

  window.addEventListener("scroll", schedule, { once: true, passive: true });
  window.addEventListener("pointerdown", schedule, { once: true, passive: true });
  window.addEventListener("keydown", schedule, { once: true });
  window.requestAnimationFrame(() => window.setTimeout(scheduleFallback, 1400));
};

document.querySelectorAll("[data-slider]").forEach((slider) => {
  if (slider.classList.contains("material-slider")) {
    runAfterInitialScrollWindow(() => setupSlider(slider));
    return;
  }

  setupSlider(slider);
});
setupTipsPagination();
setupBoothFilters();
setupCardReveal();
setupProductGallery();
setupProductCollapses();
setupShareButtons();
setupLanguageSwitcher();
