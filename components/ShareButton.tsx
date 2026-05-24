"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function ShareButton() {
  const pathname = usePathname();
  const isEnglish = pathname.startsWith("/en");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [shareData, setShareData] = useState({ title: "", url: "" });

  const texts = useMemo(
    () =>
      isEnglish
        ? {
            button: "Share",
            buttonLabel: "Share this page",
            close: "Close",
            copy: "Copy URL",
            copied: "Copied",
            line: "Share on LINE",
            modalTitle: "Share this page",
            x: "Share on X",
          }
        : {
            button: "共有",
            buttonLabel: "このページを共有",
            close: "閉じる",
            copy: "URLをコピー",
            copied: "コピー済み",
            line: "LINEでシェア",
            modalTitle: "現在のページを共有",
            x: "Xでシェア",
          },
    [isEnglish],
  );

  function getShareData() {
    return {
      title: document.title,
      url: document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || window.location.href,
    };
  }

  function openModal() {
    setShareData(getShareData());
    setIsCopied(false);
    setIsOpen(true);
  }

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setIsCopied(false);
    window.setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.classList.add("share-modal-open");
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("share-modal-open");
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal, isOpen]);

  async function copyUrl() {
    try {
      await copyToClipboard(shareData.url || getShareData().url);
      setIsCopied(true);
    } catch {
      setIsCopied(false);
    }
  }

  const xHref = shareData.url
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.title)}&url=${encodeURIComponent(shareData.url)}`
    : "#";
  const lineHref = shareData.url
    ? `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareData.url)}`
    : "#";

  return (
    <>
      <button
        aria-controls="next-share-modal"
        aria-expanded={isOpen}
        aria-label={texts.buttonLabel}
        className="share-button"
        data-share-button
        onClick={openModal}
        ref={triggerRef}
        title={texts.buttonLabel}
        type="button"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M18 8a3 3 0 1 0-2.83-4H15a3 3 0 0 0 .13.88L8.91 8.42a3 3 0 1 0 0 7.16l6.22 3.54A3 3 0 1 0 16 17.4l-6.22-3.54a3.06 3.06 0 0 0 0-3.72L16 6.6A3 3 0 0 0 18 8Z" />
        </svg>
        <span>{texts.button}</span>
      </button>
      <div className="share-modal" hidden={!isOpen} id="next-share-modal">
        <button
          aria-label={texts.close}
          className="share-modal-backdrop"
          onClick={closeModal}
          tabIndex={-1}
          type="button"
        />
        <div
          aria-labelledby="next-share-dialog-title"
          aria-modal="true"
          className="share-dialog"
          ref={dialogRef}
          role="dialog"
          tabIndex={-1}
        >
          <button className="share-close" type="button" aria-label={texts.close} onClick={closeModal}>
            ×
          </button>
          <h2 id="next-share-dialog-title">{texts.modalTitle}</h2>
          <p className="share-dialog-title">{shareData.title}</p>
          <p className="share-dialog-url">{shareData.url}</p>
          <div className="share-actions">
            <a className="share-action" href={xHref} target="_blank" rel="noopener noreferrer">
              <span className="share-action-icon share-action-x">X</span>
              <span>{texts.x}</span>
            </a>
            <a className="share-action" href={lineHref} target="_blank" rel="noopener noreferrer">
              <span className="share-action-icon share-action-line">LINE</span>
              <span>{texts.line}</span>
            </a>
            <button
              className={`share-action${isCopied ? " is-copied" : ""}`}
              type="button"
              onClick={copyUrl}
            >
              <span className="share-action-icon share-action-copy">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M10.6 13.4a1 1 0 0 1 0-1.4l3.9-3.9a3 3 0 0 1 4.2 4.2l-3 3a3 3 0 0 1-4.25 0 1 1 0 1 1 1.42-1.42 1 1 0 0 0 1.41 0l3-3a1 1 0 0 0-1.41-1.41L12 13.4a1 1 0 0 1-1.4 0Zm2.8-2.8a1 1 0 0 1 0 1.4l-3.9 3.9a3 3 0 1 1-4.2-4.2l3-3a3 3 0 0 1 4.25 0 1 1 0 0 1-1.42 1.42 1 1 0 0 0-1.41 0l-3 3a1 1 0 1 0 1.41 1.41L12 10.6a1 1 0 0 1 1.4 0Z" />
                </svg>
              </span>
              <span>{isCopied ? texts.copied : texts.copy}</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.inset = "-1000px auto auto -1000px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Copy command failed");
  }
}
