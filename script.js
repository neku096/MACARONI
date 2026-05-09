const gate = document.querySelector("#ageGate");
const enterButton = document.querySelector("#enterSite");

if (gate && localStorage.getItem("ageConfirmed") === "true") {
  gate.classList.add("is-hidden");
}

if (enterButton && gate) {
  enterButton.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    gate.classList.add("is-hidden");
  });
}

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
  BOOTH作品一覧: "BOOTH Works",
  "VRChat・Unity向けR18無料3Dポーズ素材": "R18 Free 3D Pose Materials for VRChat and Unity",
  "VRChat・Unity向けR18無料3Dポーズ素材 | マカロニ": "R18 Free 3D Pose Materials for VRChat and Unity | Macaroni",
  "VRChat対応アバター別 無料3Dポーズ素材一覧": "Free 3D Pose Materials by VRChat Avatar",
  "対応キャラ別 無料3Dポーズ素材": "Free 3D Pose Materials by Avatar",
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
  const dots = slider.parentElement.querySelector("[data-slider-dots]");
  const rows = Math.max(1, Number.parseInt(slider.dataset.sliderRows || "1", 10));
  const isLooping = slider.dataset.loop === "true";

  if (!cards.length) {
    return;
  }

  const getGap = () => {
    const gap = Number.parseFloat(getComputedStyle(slider).columnGap);
    return Number.isNaN(gap) ? 24 : gap;
  };

  const getCardDistance = () => cards[0].getBoundingClientRect().width + getGap();

  const getSlideCount = () => Math.ceil(cards.length / rows);

  const getCurrentIndex = () => Math.round(slider.scrollLeft / getCardDistance());

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
    if (isLooping && direction > 0 && getCurrentIndex() >= getSlideCount() - 1) {
      fastScrollToStart();
      return;
    }

    slider.scrollBy({ left: getCardDistance() * direction, behavior: "smooth" });
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

    const index = getCurrentIndex();
    const dotButtons = [...dots.querySelectorAll(".slider-dot")];
    dotButtons.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === Math.min(index, dotButtons.length - 1));
    });
  };

  if (dots) {
    const dotCount = getSlideCount();
    Array.from({ length: dotCount }).forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", `${index + 1}列目へ`);
      dot.addEventListener("click", () => {
        slider.scrollTo({ left: getCardDistance() * index, behavior: "smooth" });
        restartAutoSlide();
      });
      dots.append(dot);
    });

    updateActiveDot();
  }

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
  slider.addEventListener("lostpointercapture", () => {
    isDragging = false;
    slider.classList.remove("is-dragging");
    restartAutoSlide();
  });

  slider.addEventListener("mouseenter", () => window.clearInterval(autoSlideTimer));
  slider.addEventListener("mouseleave", restartAutoSlide);
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
    const sortButtons = [...section.querySelectorAll("[data-booth-sort-button]")];
    const pagination = section.querySelector("[data-booth-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-booth-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-booth-page-status]") : null;
    const status = filterPanel.querySelector("[data-booth-filter-status]");
    const suffix = filterPanel.dataset.countSuffix || " items";
    const singularSuffix = filterPanel.dataset.countSingularSuffix || suffix;
    const pageSize = Number(filterPanel.dataset.pageSize || 0);
    let activeTag = "all";
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

    const render = () => {
      const matchingCards = [];

      cards.forEach((card) => {
        const tags = card.dataset.boothTags.split(/\s+/);
        const isMatching = activeTag === "all" || tags.includes(activeTag);

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

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeTag = button.dataset.boothFilterButton || "all";
        currentPage = 1;
        render();
      });
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
      });
    });

    render();
  });
};

const setupCharacterPagination = () => {
  document.querySelectorAll("[data-character-list]").forEach((list) => {
    const section = list.closest(".character-list-section") || document;
    const cards = [...list.querySelectorAll(".character-list-card")];
    const pagination = section.querySelector("[data-character-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-character-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-character-page-status]") : null;
    const pageSize = Number(list.dataset.pageSize || 0);
    let currentPage = 1;

    if (!cards.length || !pagination || pageSize <= 0) {
      return;
    }

    const render = () => {
      const pageCount = Math.ceil(cards.length / pageSize);
      currentPage = Math.min(Math.max(currentPage, 1), pageCount);
      const firstCardIndex = (currentPage - 1) * pageSize;
      const visibleCards = new Set(cards.slice(firstCardIndex, firstCardIndex + pageSize));

      cards.forEach((card) => {
        const isVisible = visibleCards.has(card);
        card.hidden = !isVisible;
        card.style.display = isVisible ? "" : "none";
        card.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });

      pagination.hidden = pageCount <= 1;

      if (pageStatus) {
        pageStatus.textContent = pageCount > 1 ? `${currentPage} / ${pageCount}` : "";
      }

      pageButtons.forEach((button) => {
        const direction = button.dataset.characterPageButton;
        const isPrev = direction === "prev";
        button.disabled = pageCount <= 1
          || (isPrev && currentPage <= 1)
          || (!isPrev && currentPage >= pageCount);
      });
    };

    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage += button.dataset.characterPageButton === "next" ? 1 : -1;
        render();
        const targetTop = section.getBoundingClientRect().top + window.scrollY - 112;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      });
    });

    render();
  });
};

document.querySelectorAll("[data-slider]").forEach(setupSlider);
setupTipsPagination();
setupBoothFilters();
setupCharacterPagination();
setupLanguageSwitcher();
