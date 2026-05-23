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

const preloadCharacterCardImage = (card) => {
  const image = card?.querySelector(".character-list-image img");

  if (!image || image.dataset.characterPreloaded === "true") {
    return;
  }

  image.dataset.characterPreloaded = "true";
  image.loading = "eager";

  const preloader = new Image();
  preloader.decoding = "async";

  if (image.sizes) {
    preloader.sizes = image.sizes;
  }

  if (image.srcset) {
    preloader.srcset = image.srcset;
  }

  preloader.src = image.currentSrc || image.src;

  if (typeof preloader.decode === "function") {
    preloader.decode().catch(() => {});
  }
};

const setupCharacterImageLoading = (list, visibleCards) => {
  if (!list || !visibleCards.length) {
    return;
  }

  if (list.characterImageObserver) {
    list.characterImageObserver.disconnect();
  }

  const triggerCards = visibleCards.slice(3, 6);
  const nextCards = visibleCards.slice(6, 9);

  if (!triggerCards.length || !nextCards.length) {
    return;
  }

  const preloadNextCards = () => {
    nextCards.forEach(preloadCharacterCardImage);
    list.characterImageObserver?.disconnect();
    list.characterImageObserver = null;
  };

  if (!("IntersectionObserver" in window)) {
    preloadNextCards();
    return;
  }

  list.characterImageObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) {
        return;
      }

      preloadNextCards();
    },
    {
      rootMargin: "160px 0px 160px 0px",
      threshold: 0.1,
    }
  );

  triggerCards.forEach((card) => list.characterImageObserver.observe(card));
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

      return button?.textContent?.trim() || author;
    };
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
      authorRowToggle.textContent = isExpanded
        ? (authorRowToggle.dataset.closeLabel || "閉じる ▲")
        : (authorRowToggle.dataset.openLabel || "もっと見る ▼");
      authorRowToggle.setAttribute(
        "aria-label",
        isExpanded
          ? (authorRowToggle.dataset.closeAriaLabel || authorRowToggle.textContent)
          : (authorRowToggle.dataset.openAriaLabel || authorRowToggle.textContent),
      );
    };
    const updateAuthorSummary = () => {
      const authorLabel = getAuthorLabel(activeAuthor);

      if (authorToggle) {
        authorToggle.textContent = authorLabel;
        authorToggle.classList.toggle("is-selected", activeAuthor !== "all");
      }

      if (authorCurrent) {
        const prefix = authorCurrent.dataset.currentPrefix || "";
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
        authorStatus.textContent = `${matchingCards.length}${matchingCards.length === 1 ? singularSuffix : suffix}`;
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
