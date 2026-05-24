(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ProductGallery.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductGallery",
    ()=>ProductGallery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ProductGallery({ images, title }) {
    _s();
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isLightboxOpen, setIsLightboxOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const thumbnailRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const lightboxThumbRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const touchStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const safeImages = images.length > 0 ? images : [];
    const activeImage = safeImages[activeIndex] ?? safeImages[0];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            if (!isLightboxOpen) {
                return;
            }
            document.body.classList.add("product-lightbox-open");
            const handleKeyDown = {
                "ProductGallery.useEffect.handleKeyDown": (event)=>{
                    if (event.key === "Escape") {
                        setIsLightboxOpen(false);
                    }
                    if (event.key === "ArrowLeft") {
                        setActiveIndex({
                            "ProductGallery.useEffect.handleKeyDown": (current)=>getPreviousIndex(current, safeImages.length)
                        }["ProductGallery.useEffect.handleKeyDown"]);
                    }
                    if (event.key === "ArrowRight") {
                        setActiveIndex({
                            "ProductGallery.useEffect.handleKeyDown": (current)=>getNextIndex(current, safeImages.length)
                        }["ProductGallery.useEffect.handleKeyDown"]);
                    }
                }
            }["ProductGallery.useEffect.handleKeyDown"];
            document.addEventListener("keydown", handleKeyDown);
            return ({
                "ProductGallery.useEffect": ()=>{
                    document.body.classList.remove("product-lightbox-open");
                    document.removeEventListener("keydown", handleKeyDown);
                }
            })["ProductGallery.useEffect"];
        }
    }["ProductGallery.useEffect"], [
        isLightboxOpen,
        safeImages.length
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductGallery.useEffect": ()=>{
            thumbnailRefs.current[activeIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest"
            });
            lightboxThumbRefs.current[activeIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "nearest"
            });
        }
    }["ProductGallery.useEffect"], [
        activeIndex
    ]);
    if (!activeImage) {
        return null;
    }
    function showPreviousImage() {
        setActiveIndex((current)=>getPreviousIndex(current, safeImages.length));
    }
    function showNextImage() {
        setActiveIndex((current)=>getNextIndex(current, safeImages.length));
    }
    function handleLightboxBackdropClick(event) {
        if (event.target === event.currentTarget) {
            setIsLightboxOpen(false);
        }
    }
    function handleStageClick(event) {
        if (event.target === event.currentTarget) {
            setIsLightboxOpen(false);
        }
    }
    function handleTouchStart(event) {
        touchStartX.current = event.touches[0]?.clientX ?? null;
    }
    function handleTouchEnd(event) {
        if (touchStartX.current === null) {
            return;
        }
        const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
        const deltaX = touchEndX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(deltaX) < 42) {
            return;
        }
        if (deltaX > 0) {
            showPreviousImage();
        } else {
            showNextImage();
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "product-gallery",
        "aria-label": "商品画像ギャラリー",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("figure", {
                className: "product-main-figure",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: "product-main-button",
                    type: "button",
                    "data-gallery-open": true,
                    "aria-label": `${title}の商品画像を拡大表示`,
                    onClick: ()=>setIsLightboxOpen(true),
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: activeImage.src,
                        srcSet: `${activeImage.thumb} 600w, ${activeImage.src} 1000w`,
                        sizes: "(max-width: 720px) 100vw, 620px",
                        width: "1000",
                        height: "1000",
                        alt: activeImage.alt,
                        decoding: "async",
                        fetchPriority: "high",
                        "data-product-main-image": true
                    }, void 0, false, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ProductGallery.tsx",
                    lineNumber: 113,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ProductGallery.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-thumbnail-slider",
                "aria-label": "サムネイルスライダー",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "product-thumbnail-arrow",
                        type: "button",
                        "data-gallery-inline-prev": true,
                        "aria-label": "前のサムネイルへ",
                        onClick: showPreviousImage,
                        children: "‹"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 134,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-thumbnails next-product-thumbnails",
                        "data-gallery-inline-thumbs": true,
                        "aria-label": "サムネイル",
                        children: safeImages.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `product-thumbnail${index === activeIndex ? " is-active" : ""}`,
                                type: "button",
                                "aria-label": `${index + 1}枚目の画像を表示`,
                                "data-gallery-thumb": index,
                                ref: (element)=>{
                                    thumbnailRefs.current[index] = element;
                                },
                                onClick: ()=>setActiveIndex(index),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: image.thumb,
                                    alt: `${image.alt} サムネイル`,
                                    width: "600",
                                    height: "600",
                                    loading: "lazy"
                                }, void 0, false, {
                                    fileName: "[project]/components/ProductGallery.tsx",
                                    lineNumber: 156,
                                    columnNumber: 15
                                }, this)
                            }, `${image.thumb}-${index}`, false, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 145,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "product-thumbnail-arrow",
                        type: "button",
                        "data-gallery-inline-next": true,
                        "aria-label": "次のサムネイルへ",
                        onClick: showNextImage,
                        children: "›"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 160,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductGallery.tsx",
                lineNumber: 133,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "product-media-note",
                children: "クリックして拡大できます。"
            }, void 0, false, {
                fileName: "[project]/components/ProductGallery.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "product-lightbox",
                role: "dialog",
                "aria-modal": "true",
                "aria-label": "商品画像ギャラリー",
                hidden: !isLightboxOpen,
                onClick: handleLightboxBackdropClick,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "product-lightbox-stage",
                        onClick: handleStageClick,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "product-lightbox-nav",
                                type: "button",
                                "data-gallery-prev": true,
                                "aria-label": "前の画像へ",
                                onClick: showPreviousImage,
                                children: "‹"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-lightbox-image-wrap",
                                onTouchStart: handleTouchStart,
                                onTouchEnd: handleTouchEnd,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: "product-lightbox-close",
                                        type: "button",
                                        "data-gallery-close": true,
                                        "aria-label": "拡大表示を閉じる",
                                        onClick: ()=>setIsLightboxOpen(false),
                                        children: "×"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductGallery.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        className: "product-lightbox-image",
                                        src: activeImage.src,
                                        alt: activeImage.alt,
                                        "data-gallery-image": true,
                                        width: "1000",
                                        height: "1000",
                                        decoding: "async"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductGallery.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "product-lightbox-nav",
                                type: "button",
                                "data-gallery-next": true,
                                "aria-label": "次の画像へ",
                                onClick: showNextImage,
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 214,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 180,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "product-lightbox-side",
                        "aria-label": "画像一覧",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "product-lightbox-title",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "product-lightbox-count",
                                children: [
                                    activeIndex + 1,
                                    " / ",
                                    safeImages.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-lightbox-thumbs",
                                "aria-label": "拡大画像のサムネイル",
                                children: safeImages.map((image, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `product-lightbox-thumb${index === activeIndex ? " is-active" : ""}`,
                                        type: "button",
                                        "aria-label": `${index + 1}枚目の画像を表示`,
                                        "data-gallery-lightbox-thumb": index,
                                        ref: (element)=>{
                                            lightboxThumbRefs.current[index] = element;
                                        },
                                        onClick: ()=>setActiveIndex(index),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: image.thumb,
                                            alt: `${image.alt} サムネイル`,
                                            width: "600",
                                            height: "600",
                                            loading: "lazy"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ProductGallery.tsx",
                                            lineNumber: 242,
                                            columnNumber: 17
                                        }, this)
                                    }, `${image.thumb}-lightbox-${index}`, false, {
                                        fileName: "[project]/components/ProductGallery.tsx",
                                        lineNumber: 231,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/ProductGallery.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductGallery.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductGallery.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductGallery.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, this);
}
_s(ProductGallery, "26iDP1taEZXuRiK1xMJXDjGTO7U=");
_c = ProductGallery;
function getPreviousIndex(current, total) {
    if (total <= 0) {
        return 0;
    }
    return (current - 1 + total) % total;
}
function getNextIndex(current, total) {
    if (total <= 0) {
        return 0;
    }
    return (current + 1) % total;
}
var _c;
__turbopack_context__.k.register(_c, "ProductGallery");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ProductLegacyCollapses.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductLegacyCollapses",
    ()=>ProductLegacyCollapses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
function ProductLegacyCollapses() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductLegacyCollapses.useEffect": ()=>{
            const cleanups = [];
            const productTagSections = [
                ...document.querySelectorAll(".product-tag-section")
            ];
            const productAvatarContents = [
                ...document.querySelectorAll(".product-avatar-list-content")
            ];
            const productBreadcrumbs = [
                ...document.querySelectorAll(".product-summary-breadcrumb")
            ];
            if (!productTagSections.length && !productAvatarContents.length && !productBreadcrumbs.length) {
                return;
            }
            const isEnglish = document.documentElement.lang === "en";
            const mobileQuery = window.matchMedia("(max-width: 640px)");
            const showTagsText = isEnglish ? "More ▼" : "もっと見る ▼";
            const closeText = isEnglish ? "Close ▲" : "閉じる ▲";
            const scheduleUpdate = {
                "ProductLegacyCollapses.useEffect.scheduleUpdate": (update)=>window.requestAnimationFrame(update)
            }["ProductLegacyCollapses.useEffect.scheduleUpdate"];
            productTagSections.forEach({
                "ProductLegacyCollapses.useEffect": (section, index)=>{
                    if (section.dataset.collapseReady === "true") {
                        return;
                    }
                    section.dataset.collapseReady = "true";
                    const tagLists = [
                        ...section.children
                    ].filter({
                        "ProductLegacyCollapses.useEffect.tagLists": (element)=>element.classList.contains("product-tag-list")
                    }["ProductLegacyCollapses.useEffect.tagLists"]);
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
                    const update = {
                        "ProductLegacyCollapses.useEffect.update": ()=>{
                            const tagItems = [
                                ...subtagList.querySelectorAll(".product-tag, .product-tag-chip")
                            ];
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
                        }
                    }["ProductLegacyCollapses.useEffect.update"];
                    const handleClick = {
                        "ProductLegacyCollapses.useEffect.handleClick": ()=>{
                            isExpanded = !isExpanded;
                            update();
                            if (!isExpanded) {
                                section.scrollIntoView({
                                    block: "nearest"
                                });
                            }
                        }
                    }["ProductLegacyCollapses.useEffect.handleClick"];
                    const handleResize = {
                        "ProductLegacyCollapses.useEffect.handleResize": ()=>scheduleUpdate(update)
                    }["ProductLegacyCollapses.useEffect.handleResize"];
                    button.addEventListener("click", handleClick);
                    window.addEventListener("resize", handleResize, {
                        passive: true
                    });
                    cleanups.push({
                        "ProductLegacyCollapses.useEffect": ()=>{
                            button.removeEventListener("click", handleClick);
                            window.removeEventListener("resize", handleResize);
                        }
                    }["ProductLegacyCollapses.useEffect"]);
                    update();
                }
            }["ProductLegacyCollapses.useEffect"]);
            productAvatarContents.forEach({
                "ProductLegacyCollapses.useEffect": (content, index)=>{
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
                    const update = {
                        "ProductLegacyCollapses.useEffect.update": ()=>{
                            const avatarItems = [
                                ...content.querySelectorAll(".product-avatar-list-item")
                            ];
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
                        }
                    }["ProductLegacyCollapses.useEffect.update"];
                    const handleClick = {
                        "ProductLegacyCollapses.useEffect.handleClick": ()=>{
                            isExpanded = !isExpanded;
                            update();
                        }
                    }["ProductLegacyCollapses.useEffect.handleClick"];
                    const handleResize = {
                        "ProductLegacyCollapses.useEffect.handleResize": ()=>scheduleUpdate(update)
                    }["ProductLegacyCollapses.useEffect.handleResize"];
                    button.addEventListener("click", handleClick);
                    window.addEventListener("resize", handleResize, {
                        passive: true
                    });
                    cleanups.push({
                        "ProductLegacyCollapses.useEffect": ()=>{
                            button.removeEventListener("click", handleClick);
                            window.removeEventListener("resize", handleResize);
                        }
                    }["ProductLegacyCollapses.useEffect"]);
                    update();
                }
            }["ProductLegacyCollapses.useEffect"]);
            productBreadcrumbs.forEach({
                "ProductLegacyCollapses.useEffect": (breadcrumb, index)=>{
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
                    const update = {
                        "ProductLegacyCollapses.useEffect.update": ()=>{
                            const breadcrumbItems = [
                                ...breadcrumb.querySelectorAll("a")
                            ];
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
                        }
                    }["ProductLegacyCollapses.useEffect.update"];
                    const handleClick = {
                        "ProductLegacyCollapses.useEffect.handleClick": ()=>{
                            isExpanded = !isExpanded;
                            update();
                        }
                    }["ProductLegacyCollapses.useEffect.handleClick"];
                    const handleResize = {
                        "ProductLegacyCollapses.useEffect.handleResize": ()=>scheduleUpdate(update)
                    }["ProductLegacyCollapses.useEffect.handleResize"];
                    button.addEventListener("click", handleClick);
                    mobileQuery.addEventListener("change", update);
                    window.addEventListener("resize", handleResize, {
                        passive: true
                    });
                    cleanups.push({
                        "ProductLegacyCollapses.useEffect": ()=>{
                            button.removeEventListener("click", handleClick);
                            mobileQuery.removeEventListener("change", update);
                            window.removeEventListener("resize", handleResize);
                        }
                    }["ProductLegacyCollapses.useEffect"]);
                    update();
                }
            }["ProductLegacyCollapses.useEffect"]);
            return ({
                "ProductLegacyCollapses.useEffect": ()=>{
                    cleanups.forEach({
                        "ProductLegacyCollapses.useEffect": (cleanup)=>cleanup()
                    }["ProductLegacyCollapses.useEffect"]);
                }
            })["ProductLegacyCollapses.useEffect"];
        }
    }["ProductLegacyCollapses.useEffect"], []);
    return null;
}
_s(ProductLegacyCollapses, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ProductLegacyCollapses;
function getVisualRows(items) {
    const rows = [];
    const rowTolerance = 4;
    items.forEach((item)=>{
        const rect = item.getBoundingClientRect();
        if (!rect.width || !rect.height) {
            return;
        }
        const existingRow = rows.find((row)=>Math.abs(row.top - rect.top) <= rowTolerance);
        if (existingRow) {
            existingRow.bottom = Math.max(existingRow.bottom, rect.bottom);
            return;
        }
        rows.push({
            top: rect.top,
            bottom: rect.bottom
        });
    });
    return rows.sort((a, b)=>a.top - b.top);
}
function getCollapsedHeight(container, rows, rowLimit) {
    const targetRow = rows[rowLimit - 1];
    if (!targetRow) {
        return 0;
    }
    return Math.ceil(targetRow.bottom - container.getBoundingClientRect().top + 1);
}
var _c;
__turbopack_context__.k.register(_c, "ProductLegacyCollapses");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_0kg_w9o._.js.map