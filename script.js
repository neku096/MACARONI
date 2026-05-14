const gate = document.querySelector("#ageGate");
const enterButton = document.querySelector("#enterSite");
const focusableSelector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
  const isEnglish = document.documentElement.lang === "en";
  const copyText = isEnglish ? "Copy URL" : "URLをコピー";
  const copiedText = isEnglish ? "Copied" : "コピー済み";
  const modalTitle = isEnglish ? "Share this page" : "現在のページを共有";
  const xText = isEnglish ? "Share on X" : "Xでシェア";
  const lineText = isEnglish ? "Share on LINE" : "LINEでシェア";
  const closeText = isEnglish ? "Close" : "閉じる";

  const getShareData = () => ({
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.content || document.title,
    url: document.querySelector('link[rel="canonical"]')?.href || window.location.href,
  });

  const modal = document.createElement("div");
  modal.className = "share-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="share-modal-backdrop" data-share-close></div>
    <div class="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-dialog-title" tabindex="-1">
      <button class="share-close" type="button" data-share-close aria-label="${closeText}">×</button>
      <h2 id="share-dialog-title">${modalTitle}</h2>
      <p class="share-dialog-title" data-share-title></p>
      <p class="share-dialog-url" data-share-url></p>
      <div class="share-actions">
        <a class="share-action" data-share-x target="_blank" rel="noopener noreferrer">
          <span class="share-action-icon share-action-x">X</span>
          <span>${xText}</span>
        </a>
        <a class="share-action" data-share-line target="_blank" rel="noopener noreferrer">
          <span class="share-action-icon share-action-line">LINE</span>
          <span>${lineText}</span>
        </a>
        <button class="share-action" type="button" data-share-copy>
          <span class="share-action-icon share-action-copy">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.9-3.9a3 3 0 0 1 4.2 4.2l-3 3a3 3 0 0 1-4.25 0 1 1 0 1 1 1.42-1.42 1 1 0 0 0 1.41 0l3-3a1 1 0 0 0-1.41-1.41L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.9 3.9a3 3 0 1 1-4.2-4.2l3-3a3 3 0 0 1 4.25 0 1 1 0 0 1-1.42 1.42 1 1 0 0 0-1.41 0l-3 3a1 1 0 1 0 1.41 1.41L12 10.6a1 1 0 0 1 1.4 0Z"></path></svg>
          </span>
          <span data-share-copy-label>${copyText}</span>
        </button>
      </div>
    </div>
  `;
  document.body.append(modal);

  const dialog = modal.querySelector(".share-dialog");
  const titleElement = modal.querySelector("[data-share-title]");
  const urlElement = modal.querySelector("[data-share-url]");
  const xLink = modal.querySelector("[data-share-x]");
  const lineLink = modal.querySelector("[data-share-line]");
  const copyButton = modal.querySelector("[data-share-copy]");
  const copyLabel = modal.querySelector("[data-share-copy-label]");
  let lastTrigger = null;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("share-modal-open");
    copyLabel.textContent = copyText;
    copyButton.classList.remove("is-copied");
    if (lastTrigger) {
      lastTrigger.focus();
    }
  };

  const openModal = (trigger) => {
    const shareData = getShareData();
    lastTrigger = trigger;
    titleElement.textContent = shareData.title;
    urlElement.textContent = shareData.url;
    xLink.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`;
    lineLink.href = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareData.url)}`;
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
      copyLabel.textContent = copiedText;
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
  ミルティナ: "Milltina",
  萌: "Moe",
  プラム: "Plum",
  ラムネ: "Ramune",
  りりか: "Ririka",
  ルルネ: "Rurune",
  セレスティア: "Selestia",
  しなの: "Shinano",
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
  対応キャラ: "Characters",
  BOOTH作品: "BOOTH Works",
  BOOTH作品一覧: "BOOTH Works",
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
  "一人エッチモーション vol.1": "Solo Motion vol.1",
  "一人エッチモーション vol.2": "Solo Motion vol.2",
  "一人エッチモーション vol.3": "Solo Motion vol.3",
  "一人エッチモーション vol.4": "Solo Motion vol.4",
  ドスケベマテリアル: "Adult Materials",
  トップへ: "Back to top",
  メインナビゲーション: "Main navigation",
  無料素材スライド位置: "Free material slide position",
};

Object.entries(characterNameTranslations).forEach(([jaName, enName]) => {
  textTranslations[jaName] = enName;
});

const translateCharacterName = (name) => characterNameTranslations[name] || name;

const translateText = (text) => {
  if (textTranslations[text]) {
    return textTranslations[text];
  }

  const boothSuffix = " VRChat・Unity向け3Dポーズ/モーション作品";
  if (text.endsWith(boothSuffix)) {
    return `${translateText(text.slice(0, -boothSuffix.length))} for VRChat / Unity`;
  }

  const sexyPoseMatch = text.match(/^〖(.+)用〗セクシーポーズ(\d+)種＋表情(\d+)種$/);
  if (sexyPoseMatch) {
    return `${sexyPoseMatch[2]} Sexy Poses + ${sexyPoseMatch[3]} Expressions for ${translateCharacterName(sexyPoseMatch[1])}`;
  }

  const sexyMotionMatch = text.match(/^〖(.+)用〗セクシーポーズ(\d+)種＋挿入モーション(\d+)種$/);
  if (sexyMotionMatch) {
    return `${sexyMotionMatch[2]} Sexy Poses + ${sexyMotionMatch[3]} Motion Animations for ${translateCharacterName(sexyMotionMatch[1])}`;
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

  return text;
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
  const originalKey = `original${attributeName[0].toUpperCase()}${attributeName.slice(1)}`;
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

  const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (textWalker.nextNode()) {
    textNodes.push(textWalker.currentNode);
  }
  textNodes.forEach((node) => translateTextNode(node, language));

  document.querySelectorAll("[alt], [aria-label], [title]").forEach((element) => {
    ["alt", "aria-label", "title"].forEach((attributeName) => {
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
};

const setupLanguageSwitcher = () => {
  const buttons = [...document.querySelectorAll("[data-lang-button]")];

  if (!buttons.length) {
    return;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.dataset.langButton === "en" ? "en" : "ja";
      setDisplayLanguage(language);
      applyLanguage(language);
    });
  });

  applyLanguage(getDisplayLanguage());
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
  const slideItems = slider.classList.contains("product-slider") ? [...slider.querySelectorAll(".product-card")] : cards;
  const dots = slider.parentElement.querySelector("[data-slider-dots]");
  const rows = Math.max(1, Number.parseInt(slider.dataset.sliderRows || "1", 10));
  const isLooping = slider.dataset.loop === "true";
  const slideStep = 2;

  if (!cards.length || !slideItems.length) {
    return;
  }

  if (slider.classList.contains("product-slider")) {
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
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartScrollLeft = 0;
  let pressedLink = null;
  let suppressNextClick = false;
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

  slider.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    if (event.pointerType === "touch") {
      window.clearInterval(autoSlideTimer);
      return;
    }

    event.preventDefault();
    isDragging = true;
    hasDragged = false;
    dragStartX = event.clientX;
    dragStartScrollLeft = slider.scrollLeft;
    pressedLink = event.target.closest("a[href]");
    slider.setPointerCapture(event.pointerId);
    window.clearInterval(autoSlideTimer);
  });

  slider.addEventListener("dragstart", (event) => {
    event.preventDefault();
  });

  slider.addEventListener("pointermove", (event) => {
    if (!isDragging) {
      return;
    }

    const movedX = event.clientX - dragStartX;

    if (Math.abs(movedX) < 8) {
      return;
    }

    hasDragged = true;
    pressedLink = null;
    slider.classList.add("is-dragging");
    event.preventDefault();
    slider.scrollLeft = dragStartScrollLeft - movedX;
  });

  slider.addEventListener(
    "click",
    (event) => {
      if (suppressNextClick) {
        event.preventDefault();
        event.stopPropagation();
        suppressNextClick = false;
        return;
      }

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
    if (!isDragging) {
      return;
    }

    isDragging = false;
    slider.classList.remove("is-dragging");
    restartAutoSlide();

    if (slider.hasPointerCapture(event.pointerId)) {
      slider.releasePointerCapture(event.pointerId);
    }

    const totalMovedX = Math.abs(event.clientX - dragStartX);

    if (!hasDragged && totalMovedX < 8 && pressedLink && pressedLink.getAttribute("href") !== "#") {
      suppressNextClick = true;
      if (pressedLink.target === "_blank") {
        window.open(pressedLink.href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = pressedLink.href;
      }
    }

    pressedLink = null;
  };

  slider.addEventListener("pointerup", stopDragging);
  slider.addEventListener("pointercancel", stopDragging);
  slider.addEventListener("touchend", restartAutoSlide, { passive: true });
  slider.addEventListener("touchcancel", restartAutoSlide, { passive: true });
  slider.addEventListener("lostpointercapture", () => {
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
      container.scrollIntoView({ behavior: "smooth", block: "start" });
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
    const sortButtons = [...section.querySelectorAll("[data-booth-sort-button]")];
    const pagination = section.querySelector("[data-booth-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-booth-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-booth-page-status]") : null;
    const status = section.querySelector("[data-booth-filter-status]");
    const suffix = filterPanel.dataset.countSuffix || " items";
    const singularSuffix = filterPanel.dataset.countSingularSuffix || suffix;
    const pageSize = Number(filterPanel.dataset.pageSize || 0);
    const query = new URLSearchParams(window.location.search);
    const requestedTag = query.get("tag");
    const requestedSubtag = query.get("subtag");
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
    const updateSubtagToggleLabel = () => {
      if (!subtagToggle) {
        return;
      }

      const defaultLabel = subtagToggle.dataset.defaultLabel || subtagToggle.textContent.trim();
      subtagToggle.textContent = activeSubtag === "all" ? defaultLabel : getSubtagLabel(activeSubtag);
      subtagToggle.classList.toggle("is-selected", activeSubtag !== "all");
    };
    const setSubtagPickerOpen = (isOpen, shouldFocus = false) => {
      if (!subtagToggle || !subtagPicker) {
        return;
      }

      subtagPicker.classList.toggle("is-open", isOpen);
      subtagToggle.setAttribute("aria-expanded", String(isOpen));

      if (isOpen && shouldFocus && subtagSearch) {
        window.requestAnimationFrame(() => subtagSearch.focus());
      }
    };
    const setSubtagRowsExpanded = (isExpanded) => {
      if (!subtagRowToggle || !subtagPicker) {
        return;
      }

      subtagPicker.classList.toggle("is-expanded", isExpanded);
      subtagRowToggle.setAttribute("aria-expanded", String(isExpanded));
      subtagRowToggle.textContent = isExpanded
        ? (subtagRowToggle.dataset.closeLabel || "閉じる ▲")
        : (subtagRowToggle.dataset.openLabel || "もっと見る ▼");
      subtagRowToggle.setAttribute(
        "aria-label",
        isExpanded
          ? (subtagRowToggle.dataset.closeAriaLabel || subtagRowToggle.textContent)
          : (subtagRowToggle.dataset.openAriaLabel || subtagRowToggle.textContent),
      );
    };
    const filterSubtagOptions = () => {
      if (!subtagSearch) {
        return;
      }

      const queryText = subtagSearch.value.trim().normalize("NFKC").toLocaleLowerCase();
      subtagButtons.forEach((button) => {
        if (button.hasAttribute("data-booth-subtag-primary")) {
          return;
        }

        const label = button.textContent.trim().normalize("NFKC").toLocaleLowerCase();
        const isMatching = !queryText || label.includes(queryText);
        button.hidden = !isMatching;
      });
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
        status.textContent = `${matchingCount}${matchingCount === 1 ? singularSuffix : suffix}`;
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

        if (subtagSearch) {
          subtagSearch.value = "";
          filterSubtagOptions();
        }

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
      setSubtagRowsExpanded(false);
      subtagRowToggle.addEventListener("click", () => {
        const isExpanded = subtagRowToggle.getAttribute("aria-expanded") === "true";
        setSubtagRowsExpanded(!isExpanded);
      });
    }

    if (subtagSearch) {
      subtagSearch.addEventListener("input", filterSubtagOptions);
    }

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
  const isEnglish = document.documentElement.lang === "en";
  const productName = document.querySelector("#product-title")?.textContent?.trim() || (isEnglish ? "Product" : "商品");
  const closeText = isEnglish ? "Close" : "閉じる";
  const previousText = isEnglish ? "Previous image" : "前の画像";
  const nextText = isEnglish ? "Next image" : "次の画像";
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
      button.setAttribute("aria-label", isEnglish ? `${productName} product image ${index + 1}` : `${productName} 商品画像 ${index + 1}枚目`);
      button.innerHTML = `<img src="${image.thumb}" alt="${image.alt}" width="96" height="96" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">`;
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
      mainImage.alt = image.alt;
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
      modalImage.alt = image.alt;
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
    button.innerHTML = `<img src="${image.thumb}" alt="${image.alt}" loading="lazy" decoding="async">`;
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

document.querySelectorAll("[data-slider]").forEach(setupSlider);
setupTipsPagination();
setupBoothFilters();
setupCardReveal();
setupProductGallery();
setupShareButtons();
setupLanguageSwitcher();
