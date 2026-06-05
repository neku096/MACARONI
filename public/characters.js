const gate = document.querySelector("#ageGate");
const enterButton = document.querySelector("#enterSite");

const scrollToPageTop = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? "auto" : "smooth" });
};

if (gate && localStorage.getItem("ageConfirmed") === "true") {
  gate.classList.add("is-hidden");
}

if (enterButton && gate) {
  enterButton.addEventListener("click", () => {
    localStorage.setItem("ageConfirmed", "true");
    gate.classList.add("is-hidden");
  });
}

const setupShareButtons = () => {
  const getShareText = (jaText, enText) => (getDisplayLanguage() === "en" ? enText : jaText);
  const getCopyText = () => getShareText("URLをコピー", "Copy URL");
  const getCopiedText = () => getShareText("コピー済み", "Copied");
  const modalTitle = getShareText("現在のページを共有", "Share this page");
  const xText = getShareText("Xでシェア", "Share on X");
  const lineText = getShareText("LINEでシェア", "Share on LINE");
  const closeText = getShareText("閉じる", "Close");

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
          <span data-share-copy-label>${getCopyText()}</span>
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
  "18歳以上です": "I am 18 or older",
  "退場する": "Leave",
  "R18 ３Dポーズ素材無料配布サイト": "R18 Free 3D Pose Materials",
  "VRChat対応アバター別 無料3Dポーズ素材一覧": "Free 3D Pose Materials by VRChat Avatar",
  "VRChat対応アバター別 無料3Dポーズ素材一覧 | マカロニ": "Free 3D Pose Materials by VRChat Avatar | Macaroni",
  "VRChat・VRC向け無料3Dポーズ素材の対応アバター一覧です。クマリ、エク、真冬、マヌカなど、Unity用ポーズ素材をキャラ別に確認できます。":
    "A supported-avatar list for free VRChat and VRC 3D pose materials. Browse Unity pose materials by character, including Kumaly, Eku, Mafuyu, and Manuka.",
  "マカロニ R18 3Dポーズ素材無料配布サイトのロゴ": "Macaroni R18 free 3D pose materials site logo",
  "対応キャラ": "Supported Avatars",
  "BOOTH作品": "BOOTH Works",
  "使い方": "Usage Guide",
  "利用規約": "Terms of Use",
  "トップへ": "Back to top",
  "共有": "Share",
  "対応キャラ一覧": "Supported Avatar List",
  "対応キャラ一覧のロゴ": "Supported avatar list logo",
  "対応キャラ別 無料3Dポーズ素材": "Free 3D Pose Materials by Avatar",
  "無料3Dポーズ素材": "Free 3D Pose Materials",
  "VRChat・Unity向けの無料ポーズ素材を、対応アバターごとに探せます。":
    "Find free VRChat and Unity pose materials by supported avatar.",
  "作者": "Creator",
  "作者: ": "Creator: ",
  "作者: すべて": "Creator: All",
  "作者で絞り込み": "Filter by creator",
  "作者をもっと見る": "Show more creators",
  "作者を閉じる": "Close creators",
  "すべて": "All",
  "もっと見る ▼": "Show more ▼",
  "閉じる ▲": "Close ▲",
  "前へ": "Previous",
  "次へ": "Next",
  "キャラ名で検索": "Search by character",
  "キャラ名で検索…": "Search by character...",
  "対応キャラページ切り替え": "Supported avatar pagination",
  "URLをコピー": "Copy URL",
  "コピー済み": "Copied",
  "現在のページを共有": "Share this page",
  "Xでシェア": "Share on X",
  "LINEでシェア": "Share on LINE",
  "閉じる": "Close",
  "このページを共有": "Share this page",
  "メインナビゲーション": "Main navigation",
  "キュビクローゼット": "Kyubi Closet",
  "こまど": "Komado",
  "はみに": "Hamini",
  "ぽんでろ": "Pondero",
};

Object.entries(characterNameTranslations).forEach(([jaName, enName]) => {
  textTranslations[jaName] = enName;
});

const translateCharacterName = (name) => characterNameTranslations[name] || name;

const translateText = (text) => {
  if (textTranslations[text]) {
    return textTranslations[text];
  }

  const countMatch = text.match(/^(\d+)件$/);
  if (countMatch) {
    return `${countMatch[1]} ${countMatch[1] === "1" ? "item" : "items"}`;
  }

  const standingNameMatch = text.match(/^(.+) 立ち絵$/);
  if (standingNameMatch) {
    return `${translateCharacterName(standingNameMatch[1])} Standing Image`;
  }

  for (const [jaName, enName] of Object.entries(characterNameTranslations)) {
    if (text === `${jaName}対応 VRChat無料3Dポーズ素材の立ち絵`) {
      return `${enName} standing visual for VRChat free 3D pose materials`;
    }

    if (text === `${jaName}対応の無料配布素材ページへ移動します。`) {
      return `Open the free material page for ${enName}.`;
    }
  }

  return Object.entries(characterNameTranslations).reduce(
    (result, [jaText, enText]) => result.replaceAll(jaText, enText),
    text,
  );
};

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

  node.nodeValue = preserveWhitespace(node.originalTextValue, translateText(trimmed));
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

  document.querySelectorAll(".language-option[href]").forEach((link) => {
    const linkLanguage = getLanguageFromUrl(link.getAttribute("href"));

    if (linkLanguage) {
      link.setAttribute("aria-pressed", String(linkLanguage === language));
    }
  });
};

const setupLanguageSwitcher = () => {
  const links = [...document.querySelectorAll(".language-option[href]")];

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const language = getLanguageFromUrl(link.getAttribute("href"));

      if (language) {
        setDisplayLanguage(language);
      }
    });
  });

  applyLanguage(getDisplayLanguage());
};

const loadCharacterCardImage = (card, { eager = false } = {}) => {
  const image = card?.querySelector(".character-list-image img");

  if (!image || image.dataset.characterLoaded === "true") {
    return;
  }

  const deferredSrc = image.dataset.src;
  const deferredSrcset = image.dataset.srcset;

  if (!deferredSrc && !deferredSrcset) {
    image.dataset.characterLoaded = "true";
    if (eager && image.loading === "lazy") {
      image.loading = "eager";
    }
    return;
  }

  image.dataset.characterLoaded = "true";
  image.loading = eager ? "eager" : "lazy";
  image.decoding = "async";

  if (deferredSrcset) {
    image.srcset = deferredSrcset;
    image.removeAttribute("data-srcset");
  }

  if (deferredSrc) {
    image.src = deferredSrc;
    image.removeAttribute("data-src");
  }
};

const setupCharacterImageLoading = (list, visibleCards) => {
  if (!list || !visibleCards.length) {
    return;
  }

  if (list.characterImageObserver) {
    list.characterImageObserver.disconnect();
  }

  const immediateCount = window.matchMedia("(max-width: 720px)").matches ? 2 : 6;
  const immediateCards = visibleCards.slice(0, immediateCount);
  const deferredCards = visibleCards.slice(immediateCount);

  immediateCards.forEach((card) => loadCharacterCardImage(card, { eager: true }));

  if (!deferredCards.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    deferredCards.forEach((card) => loadCharacterCardImage(card));
    return;
  }

  list.characterImageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        loadCharacterCardImage(entry.target);
        list.characterImageObserver?.unobserve(entry.target);
      });
    },
    {
      rootMargin: "120px 0px 120px 0px",
      threshold: 0.01,
    }
  );

  deferredCards.forEach((card) => list.characterImageObserver.observe(card));
};

const setupCharacterPagination = () => {
  document.querySelectorAll("[data-character-list]").forEach((list) => {
    const section = list.closest(".character-list-section") || document;
    const cards = [...list.querySelectorAll(".character-list-card")];
    const authorPanel = section.querySelector("[data-character-author-filter]");
    const authorButtons = authorPanel ? [...authorPanel.querySelectorAll("[data-character-author-button]")] : [];
    const authorStatus = authorPanel ? authorPanel.querySelector("[data-character-author-status]") : null;
    const authorToggle = authorPanel ? authorPanel.querySelector("[data-character-author-toggle]") : null;
    const authorRowToggle = authorPanel ? authorPanel.querySelector("[data-character-author-row-toggle]") : null;
    const authorOptions = authorPanel ? authorPanel.querySelector("[data-character-author-options]") : null;
    const authorCurrent = authorPanel ? authorPanel.querySelector("[data-character-author-current]") : null;
    const searchInput = authorPanel ? authorPanel.querySelector("[data-character-search]") : null;
    const pagination = section.querySelector("[data-character-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-character-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-character-page-status]") : null;
    const pageSize = Number(list.dataset.pageSize || 0);
    const suffix = authorPanel?.dataset.countSuffix || " characters";
    const singularSuffix = authorPanel?.dataset.countSingularSuffix || suffix;
    const compactAuthorQuery = window.matchMedia("(max-width: 640px)");
    let activeAuthor = "all";
    let currentPage = 1;

    if (!cards.length) {
      return;
    }

    const normalizeText = (value) => value.trim().normalize("NFKC").toLocaleLowerCase();
    const getAuthorLabel = (author) => {
      const button = authorButtons.find((item) => item.dataset.characterAuthorButton === author);

      const label = button?.textContent?.trim() || author;
      return getDisplayLanguage() === "en" ? translateText(label) : label;
    };
    const getCountText = (count) => {
      if (getDisplayLanguage() === "en") {
        return `${count} ${count === 1 ? "character" : "characters"}`;
      }

      return `${count}${count === 1 ? singularSuffix : suffix}`;
    };
    const getLanguageAwareLabel = (label) => (getDisplayLanguage() === "en" ? translateText(label) : label);
    const setAuthorOptionsOpen = (isOpen) => {
      if (!authorToggle || !authorOptions) {
        return;
      }

      authorOptions.classList.toggle("is-open", isOpen);
      authorToggle.setAttribute("aria-expanded", String(isOpen));
    };
    const setAuthorRowsExpanded = (isExpanded) => {
      if (!authorRowToggle || !authorOptions) {
        return;
      }

      authorOptions.classList.toggle("is-expanded", isExpanded);
      authorPanel.classList.toggle("is-author-rows-expanded", isExpanded);
      authorRowToggle.setAttribute("aria-expanded", String(isExpanded));
      const rowToggleText = isExpanded
        ? (authorRowToggle.dataset.closeLabel || "閉じる ▲")
        : (authorRowToggle.dataset.openLabel || "もっと見る ▼");
      authorRowToggle.textContent = getLanguageAwareLabel(rowToggleText);
      authorRowToggle.setAttribute(
        "aria-label",
        getLanguageAwareLabel(isExpanded
          ? (authorRowToggle.dataset.closeAriaLabel || authorRowToggle.textContent)
          : (authorRowToggle.dataset.openAriaLabel || authorRowToggle.textContent)),
      );
    };
    const updateAuthorSummary = () => {
      const authorLabel = getAuthorLabel(activeAuthor);

      if (authorToggle) {
        authorToggle.textContent = authorLabel;
        authorToggle.classList.toggle("is-selected", activeAuthor !== "all");
      }

      if (authorCurrent) {
        const prefix = getLanguageAwareLabel(authorCurrent.dataset.currentPrefix || "");
        authorCurrent.textContent = `${prefix}${authorLabel}`;
      }
    };
    const getCardSearchText = (card) => normalizeText([
      card.querySelector(".character-list-name")?.textContent || "",
      card.querySelector(".character-list-subname")?.textContent || "",
    ].join(" "));

    cards.forEach((card) => {
      card.dataset.characterSearchText = getCardSearchText(card);
    });

    const render = () => {
      const searchText = searchInput ? normalizeText(searchInput.value) : "";
      const matchingCards = cards.filter((card) => {
        const isMatchingAuthor = activeAuthor === "all" || card.dataset.characterAuthor === activeAuthor;
        const isMatchingSearch = !searchText || (card.dataset.characterSearchText || "").includes(searchText);

        return isMatchingAuthor && isMatchingSearch;
      });
      const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(matchingCards.length / pageSize)) : 1;
      currentPage = Math.min(Math.max(currentPage, 1), pageCount);
      const firstCardIndex = (currentPage - 1) * pageSize;
      const visibleCardList = pageSize > 0 ? matchingCards.slice(firstCardIndex, firstCardIndex + pageSize) : matchingCards;
      const visibleCards = new Set(visibleCardList);

      cards.forEach((card) => {
        const isVisible = visibleCards.has(card);
        card.hidden = !isVisible;
        card.style.display = isVisible ? "" : "none";
        card.setAttribute("aria-hidden", isVisible ? "false" : "true");
      });

      matchingCards.forEach((card) => list.appendChild(card));
      cards
        .filter((card) => !matchingCards.includes(card))
        .forEach((card) => list.appendChild(card));

      setupCharacterImageLoading(list, visibleCardList);

      authorButtons.forEach((button) => {
        const isActive = button.dataset.characterAuthorButton === activeAuthor;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      if (authorStatus) {
        authorStatus.textContent = getCountText(matchingCards.length);
      }

      updateAuthorSummary();

      if (pagination) {
        pagination.hidden = pageCount <= 1;
      }

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

    authorButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeAuthor = button.dataset.characterAuthorButton || "all";
        currentPage = 1;
        render();

        if (compactAuthorQuery.matches) {
          setAuthorOptionsOpen(false);
        }
      });
    });

    if (authorToggle) {
      authorToggle.addEventListener("click", () => {
        const isOpen = authorToggle.getAttribute("aria-expanded") === "true";
        setAuthorOptionsOpen(!isOpen);
      });
    }

    if (authorRowToggle) {
      setAuthorRowsExpanded(false);
      authorRowToggle.addEventListener("click", () => {
        const isExpanded = authorRowToggle.getAttribute("aria-expanded") === "true";
        setAuthorRowsExpanded(!isExpanded);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        currentPage = 1;
        render();
      });
    }

    pageButtons.forEach((button) => {
      button.addEventListener("click", () => {
        currentPage += button.dataset.characterPageButton === "next" ? 1 : -1;
        render();
        scrollToPageTop();
      });
    });

    render();
  });
};

const setupCardReveal = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = [...document.querySelectorAll(".character-list-card")];

  if (!cards.length || reduceMotion.matches || !("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        window.setTimeout(() => {
          entry.target.classList.remove("js-reveal-card", "is-visible");
        }, 700);
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  const isInitialCharacterCard = (card) => {
    const list = card.closest("[data-character-list]");

    if (!list) {
      return false;
    }

    const visibleCards = [...list.querySelectorAll(".character-list-card")]
      .filter((item) => !item.hidden && item.style.display !== "none");

    return visibleCards.indexOf(card) < 6;
  };

  cards.forEach((card) => {
    if (isInitialCharacterCard(card)) {
      card.classList.remove("js-reveal-card", "is-visible");
      return;
    }

    card.classList.add("js-reveal-card");
    observer.observe(card);
  });
};

setupCharacterPagination();
setupCardReveal();
setupShareButtons();
setupLanguageSwitcher();
