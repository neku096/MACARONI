"use client";

import { useEffect } from "react";

type RowBounds = {
  top: number;
  bottom: number;
};

export function ProductLegacyCollapses() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const productTagSections = [...document.querySelectorAll<HTMLElement>(".product-tag-section")];
    const productAvatarContents = [...document.querySelectorAll<HTMLElement>(".product-avatar-list-content")];
    const productBreadcrumbs = [...document.querySelectorAll<HTMLElement>(".product-summary-breadcrumb")];

    if (!productTagSections.length && !productAvatarContents.length && !productBreadcrumbs.length) {
      return;
    }

    const isEnglish = document.documentElement.lang === "en";
    const mobileQuery = window.matchMedia("(max-width: 640px)");
    const showTagsText = isEnglish ? "More ▼" : "もっと見る ▼";
    const closeText = isEnglish ? "Close ▲" : "閉じる ▲";
    const scheduleUpdate = (update: () => void) => window.requestAnimationFrame(update);

    productTagSections.forEach((section, index) => {
      if (section.dataset.collapseReady === "true") {
        return;
      }

      section.dataset.collapseReady = "true";
      const tagLists = [...section.children].filter((element) => element.classList.contains("product-tag-list"));
      const subtagList = tagLists.length > 1 ? (tagLists[tagLists.length - 1] as HTMLElement) : null;

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
        const tagItems = [...subtagList.querySelectorAll<HTMLElement>(".product-tag, .product-tag-chip")];
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
          button.textContent = showTagsText;
          return;
        }

        content.style.setProperty("--collapsed-height", `${getCollapsedHeight(content, rows, 3)}px`);
        content.classList.toggle("is-collapsed", !isExpanded);
        button.setAttribute("aria-expanded", String(isExpanded));
        button.textContent = isExpanded ? closeText : showTagsText;
      };

      const handleClick = () => {
        isExpanded = !isExpanded;
        update();

        if (!isExpanded) {
          section.scrollIntoView({ block: "nearest" });
        }
      };
      const handleResize = () => scheduleUpdate(update);

      button.addEventListener("click", handleClick);
      window.addEventListener("resize", handleResize, { passive: true });
      cleanups.push(() => {
        button.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
      });
      update();
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
        const avatarItems = [...content.querySelectorAll<HTMLElement>(".product-avatar-list-item")];
        const rows = getVisualRows(avatarItems);
        const shouldCollapse = rows.length > 3;

        button.hidden = !shouldCollapse;
        content.classList.toggle("is-collapsible", shouldCollapse);

        if (!shouldCollapse) {
          isExpanded = false;
          content.classList.remove("is-collapsed");
          content.style.removeProperty("--collapsed-height");
          button.setAttribute("aria-expanded", "false");
          button.textContent = showTagsText;
          return;
        }

        content.style.setProperty("--collapsed-height", `${getCollapsedHeight(content, rows, 3)}px`);
        content.classList.toggle("is-collapsed", !isExpanded);
        button.setAttribute("aria-expanded", String(isExpanded));
        button.textContent = isExpanded ? closeText : showTagsText;
      };

      const handleClick = () => {
        isExpanded = !isExpanded;
        update();
      };
      const handleResize = () => scheduleUpdate(update);

      button.addEventListener("click", handleClick);
      window.addEventListener("resize", handleResize, { passive: true });
      cleanups.push(() => {
        button.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
      });
      update();
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
        const breadcrumbItems = [...breadcrumb.querySelectorAll<HTMLElement>("a")];
        const rows = getVisualRows(breadcrumbItems);
        const shouldCollapse = mobileQuery.matches && rows.length > 2;

        button.hidden = !shouldCollapse;
        breadcrumb.classList.toggle("is-collapsible", shouldCollapse);

        if (!shouldCollapse) {
          isExpanded = false;
          breadcrumb.classList.remove("is-collapsed");
          breadcrumb.style.removeProperty("--collapsed-height");
          button.setAttribute("aria-expanded", "false");
          button.textContent = showTagsText;
          return;
        }

        breadcrumb.style.setProperty("--collapsed-height", `${getCollapsedHeight(breadcrumb, rows, 2)}px`);
        breadcrumb.classList.toggle("is-collapsed", !isExpanded);
        button.setAttribute("aria-expanded", String(isExpanded));
        button.textContent = isExpanded ? closeText : showTagsText;
      };

      const handleClick = () => {
        isExpanded = !isExpanded;
        update();
      };
      const handleResize = () => scheduleUpdate(update);

      button.addEventListener("click", handleClick);
      mobileQuery.addEventListener("change", update);
      window.addEventListener("resize", handleResize, { passive: true });
      cleanups.push(() => {
        button.removeEventListener("click", handleClick);
        mobileQuery.removeEventListener("change", update);
        window.removeEventListener("resize", handleResize);
      });
      update();
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}

function getVisualRows(items: HTMLElement[]) {
  const rows: RowBounds[] = [];
  const rowTolerance = 4;

  items.forEach((item) => {
    const rect = item.getBoundingClientRect();

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
}

function getCollapsedHeight(container: HTMLElement, rows: RowBounds[], rowLimit: number) {
  const targetRow = rows[rowLimit - 1];

  if (!targetRow) {
    return 0;
  }

  return Math.ceil(targetRow.bottom - container.getBoundingClientRect().top + 1);
}
