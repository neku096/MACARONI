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

const setupCharacterPagination = () => {
  document.querySelectorAll("[data-character-list]").forEach((list) => {
    const section = list.closest(".character-list-section") || document;
    const cards = [...list.querySelectorAll(".character-list-card")];
    const authorPanel = section.querySelector("[data-character-author-filter]");
    const authorButtons = authorPanel ? [...authorPanel.querySelectorAll("[data-character-author-button]")] : [];
    const authorStatus = authorPanel ? authorPanel.querySelector("[data-character-author-status]") : null;
    const pagination = section.querySelector("[data-character-pagination]");
    const pageButtons = pagination ? [...pagination.querySelectorAll("[data-character-page-button]")] : [];
    const pageStatus = pagination ? pagination.querySelector("[data-character-page-status]") : null;
    const pageSize = Number(list.dataset.pageSize || 0);
    const suffix = authorPanel?.dataset.countSuffix || " characters";
    const singularSuffix = authorPanel?.dataset.countSingularSuffix || suffix;
    let activeAuthor = "all";
    let currentPage = 1;

    if (!cards.length) {
      return;
    }

    const render = () => {
      const matchingCards = cards.filter((card) => activeAuthor === "all" || card.dataset.characterAuthor === activeAuthor);
      const pageCount = pageSize > 0 ? Math.max(1, Math.ceil(matchingCards.length / pageSize)) : 1;
      currentPage = Math.min(Math.max(currentPage, 1), pageCount);
      const firstCardIndex = (currentPage - 1) * pageSize;
      const visibleCards = new Set(pageSize > 0 ? matchingCards.slice(firstCardIndex, firstCardIndex + pageSize) : matchingCards);

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

      authorButtons.forEach((button) => {
        const isActive = button.dataset.characterAuthorButton === activeAuthor;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      if (authorStatus) {
        authorStatus.textContent = `${matchingCards.length}${matchingCards.length === 1 ? singularSuffix : suffix}`;
      }

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
      });
    });

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

  cards.forEach((card) => {
    card.classList.add("js-reveal-card");
    observer.observe(card);
  });
};

setupCharacterPagination();
setupCardReveal();
