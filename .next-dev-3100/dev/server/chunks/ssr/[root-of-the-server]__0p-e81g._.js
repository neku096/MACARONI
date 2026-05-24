module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/components/ProductCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
;
;
function ProductCard({ product, variant = "card", title, label, coverImage, alt, href, priority = false, boothTags, boothSubtags, popularity }) {
    const cardTitle = title ?? product.shortTitle;
    const cardLabel = label ?? getLegacyProductLabel(product);
    const cardHref = href ?? `/products/${product.slug}`;
    const image = getCoverSet(coverImage ?? product.coverImage);
    const imageAlt = alt ?? cardTitle;
    if (variant === "booth-thumb") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            className: "booth-list-thumb",
            href: cardHref,
            prefetch: false,
            "data-booth-tags": boothTags,
            "data-booth-subtags": boothSubtags,
            "data-popularity": popularity,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                src: image.thumb,
                srcSet: image.srcSet,
                sizes: "(max-width: 720px) 46vw, (max-width: 1200px) 30vw, 420px",
                alt: `${imageAlt} VRChat・Unity向け3Dポーズ/モーション作品`,
                width: 600,
                height: 600,
                loading: priority ? undefined : "lazy",
                decoding: "async",
                fetchPriority: priority ? "high" : undefined
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ProductCard.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        className: "product-card",
        href: cardHref,
        prefetch: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                className: "product-cover",
                src: image.thumb,
                srcSet: image.srcSet,
                sizes: "(max-width: 720px) 52vw, 260px",
                alt: imageAlt,
                width: 600,
                height: 600,
                loading: priority ? undefined : "lazy",
                decoding: "async",
                fetchPriority: priority ? "high" : undefined
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 64,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: cardTitle
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                children: cardLabel
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ProductCard.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
function getCoverSet(src) {
    const thumb = src.includes("-800.webp") ? src.replace("-800.webp", "-600.webp") : src;
    const medium = thumb.includes("-600.webp") ? thumb.replace("-600.webp", "-800.webp") : thumb;
    const full = thumb.includes("-600.webp") ? thumb.replace("-600.webp", ".webp") : thumb;
    return {
        thumb,
        srcSet: `${thumb} 600w, ${medium} 800w, ${full} 1000w`
    };
}
function getLegacyProductLabel(product) {
    switch(product.category){
        case "pose":
            return "SexyPose";
        case "motion":
            return "SexyMotion";
        case "solo-motion":
            return "Solo_H";
        case "material":
            return "Others";
        default:
            return product.categoryLabel;
    }
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProductCard.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/products.ts [app-rsc] (ecmascript)");
;
;
;
;
const metadata = {
    title: "VRChat・Unity向けR18無料3Dポーズ素材",
    description: "VRChatアバターや3Dゲーム制作で使えるUnity向けR18 3Dポーズ・モーション素材を無料配布。対応キャラ一覧、BOOTH作品、DLsiteへの導線をまとめています。",
    alternates: {
        canonical: "/",
        languages: {
            ja: "/",
            en: "/en/index.html",
            "x-default": "/"
        }
    }
};
const characters = [
    {
        slug: "airi",
        name: "愛莉",
        label: "Airi",
        image: "Airi_standing"
    },
    {
        slug: "chocolat",
        name: "ショコラ",
        label: "Chocolat",
        image: "Chocolat_standing"
    },
    {
        slug: "eku",
        name: "エク",
        label: "Eku",
        image: "Eku_standing"
    },
    {
        slug: "ichigo",
        name: "イチゴ",
        label: "イチゴ",
        image: "ICHIGO_standing"
    },
    {
        slug: "kumaly",
        name: "クマリ",
        label: "クマリ",
        image: "KUMALY_standing"
    },
    {
        slug: "lumina",
        name: "ルミナ",
        label: "ルミナ",
        image: "LUMINA_standing"
    },
    {
        slug: "lasyusha",
        name: "ラシューシャ",
        label: "ラシューシャ",
        image: "Lasyusha_standing"
    },
    {
        slug: "manuka",
        name: "マヌカ",
        label: "マヌカ",
        image: "MANUKA_standing"
    },
    {
        slug: "mafuyu",
        name: "真冬",
        label: "真冬",
        image: "Mafuyu_standing"
    },
    {
        slug: "mayo",
        name: "まよ",
        label: "まよ",
        image: "Mayo_standing"
    },
    {
        slug: "milfy",
        name: "ミルフィ",
        label: "ミルフィ",
        image: "Milfy_standing"
    },
    {
        slug: "milltina",
        name: "ミルティナ",
        label: "ミルティナ",
        image: "Milltina_standing"
    },
    {
        slug: "moe",
        name: "萌",
        label: "萌",
        image: "Moe_standing"
    },
    {
        slug: "plum",
        name: "プラム",
        label: "プラム",
        image: "Plum_standing"
    },
    {
        slug: "ramune",
        name: "ラムネ",
        label: "ラムネ",
        image: "Ramune_standing"
    },
    {
        slug: "ririka",
        name: "りりか",
        label: "りりか",
        image: "Ririka_standing"
    },
    {
        slug: "rurune",
        name: "ルルネ",
        label: "ルルネ",
        image: "Rurune_standing"
    },
    {
        slug: "selestia",
        name: "セレスティア",
        label: "セレスティア",
        image: "SELESTIA_standing"
    },
    {
        slug: "shinano",
        name: "しなの",
        label: "しなの",
        image: "Shinano_standing"
    },
    {
        slug: "sio",
        name: "しお",
        label: "しお",
        image: "Sio_standing"
    }
];
function HomePage() {
    const productCards = buildHomeProductCards((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$products$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPublishedProducts"])());
    const productSlides = chunk(productCards, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section sales-band sales-band-top",
                id: "works",
                "aria-labelledby": "works-title",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "visually-hidden",
                        id: "works-title",
                        children: "VRChat・Unity向けR18無料3Dポーズ素材"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 64,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "slider-shell",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "product-slider",
                                "data-card-selector": ".product-slide",
                                "data-loop": "true",
                                "data-slider": "",
                                tabIndex: 0,
                                children: productSlides.map((slide, slideIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "product-slide",
                                        children: slide.map((card, cardIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ProductCard"], {
                                                coverImage: card.coverImage,
                                                priority: slideIndex === 0 && cardIndex === 0,
                                                product: card.product,
                                                title: card.title
                                            }, card.key, false, {
                                                fileName: "[project]/app/page.tsx",
                                                lineNumber: 78,
                                                columnNumber: 19
                                            }, this))
                                    }, `product-slide-${slideIndex}`, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 76,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "slider-dots",
                                "aria-label": "スライド位置",
                                children: productSlides.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        "aria-label": `${index + 1}枚目のスライド`,
                                        className: `slider-dot${index === 0 ? " is-active" : ""}`,
                                        type: "button"
                                    }, `product-dot-${index}`, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 91,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 63,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section free-section",
                id: "free",
                "aria-labelledby": "free-title",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "free-panel",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "section-heading",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        id: "free-title",
                                        children: "無料アニメーション素材"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 106,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "section-lead",
                                        children: "VRChat・Unity向けのR18無料ポーズ素材を、対応アバター別に配布しています。"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 107,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 105,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 104,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "slider-shell",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "material-grid material-slider",
                                    "data-card-selector": ".material-card",
                                    "data-slider": "",
                                    "data-slider-rows": "2",
                                    tabIndex: 0,
                                    children: characters.map((character)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                            className: "material-card",
                                            href: `/character-${character.slug}.html`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "thumb has-image standing-thumb",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        alt: `${character.name}の立ち絵`,
                                                        decoding: "async",
                                                        height: "600",
                                                        loading: "lazy",
                                                        sizes: "(max-width: 720px) 46vw, 260px",
                                                        src: `/images/standing/${character.image}-600.webp`,
                                                        srcSet: `/images/standing/${character.image}-600.webp 600w, /images/standing/${character.image}-800.webp 800w, /images/standing/${character.image}.webp 1000w`,
                                                        width: "600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/page.tsx",
                                                        lineNumber: 121,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "card-body",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "tag",
                                                            children: [
                                                                character.name,
                                                                " / Standing"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 133,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            children: character.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            children: [
                                                                character.label,
                                                                "対応の無料配布素材ページへ移動します。"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 135,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 132,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, character.slug, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 111,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "slider-dots",
                                    "aria-label": "無料素材スライド位置"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 110,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/page.tsx",
                    lineNumber: 103,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "section guideline",
                id: "guideline",
                "aria-labelledby": "guideline-title",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            id: "guideline-title",
                            children: "無料素材の利用条件"
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 147,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "rule-list",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "無料配布素材は個人・同人・商用作品、ゲーム制作、VRChat、動画制作に利用できます"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "加工・調整・作品への組み込みは自由、クレジット表記は任意です"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 151,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "素材データそのものの再配布・販売、AI学習への利用は禁止です"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 152,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: "BOOTH / DLsite作品は各商品ページの条件を優先します"
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 153,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: [
                                    "詳しい条件は",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                                        className: "text-link",
                                        href: "/terms.html",
                                        children: "利用規約"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 156,
                                        columnNumber: 13
                                    }, this),
                                    "をご確認ください"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
function buildHomeProductCards(products) {
    return products.flatMap((product)=>{
        if (product.id === "sexy-pose-plum-chocolat") {
            return [
                {
                    key: `${product.id}-chocolat`,
                    product,
                    title: "〖ショコラ用〗セクシーポーズ15種＋表情5種",
                    coverImage: "/products/covers/CH-800.webp"
                },
                {
                    key: `${product.id}-plum`,
                    product,
                    title: "〖プラム用〗セクシーポーズ15種＋表情5種",
                    coverImage: "/products/covers/PL-800.webp"
                }
            ];
        }
        return [
            {
                key: product.id,
                product,
                title: getLegacyHomeTitle(product),
                coverImage: product.coverImage
            }
        ];
    });
}
function getLegacyHomeTitle(product) {
    const titles = {
        "sexy-pose-kumaly": "〖クマリ用〗セクシーポーズ15種＋表情5種",
        "sexy-pose-ramune": "〖ラムネ用〗セクシーポーズ15種＋表情5種",
        "sexy-pose-eku": "〖エク用〗セクシーポーズ15種＋表情5種",
        "sexy-pose-lumina": "〖ルミナ用〗セクシーポーズ15種＋表情5種",
        "sexy-pose-ichigo": "〖イチゴ用〗セクシーポーズ15種＋表情5種",
        "sexy-pose-shinano": "〖しなの用〗セクシーポーズ20種＋挿入モーション5種",
        "sexy-pose-milltina": "〖ミルティナ用〗セクシーポーズ15種＋表情7種",
        "sexy-pose-rurune": "〖ルルネ用〗セクシーポーズ15種＋表情5種",
        "sexy-motion-vol1": "〖汎用〗セクシーモーション5種類",
        "sexy-attack-motion-vol1": "〖汎用〗セクシーアタックモーション5種類",
        "sexy-motion-attack-vol2": "SexyMotion / Attack vol.2",
        "foot-motion": "〖汎用〗足○キモーション6種類",
        "hand-motion": "〖汎用〗手○キモーション15種類",
        "bj-motion": "〖13アバター対応〗フ〇ラモーション",
        "solo-motion-vol1": "一人エッチモーション vol.1",
        "solo-motion-vol2": "一人エッチモーション vol.2",
        "solo-motion-vol3": "一人エッチモーション vol.3",
        "solo-motion-vol4": "一人エッチモーション vol.4",
        "dosukebe-material": "ドスケベマテリアル"
    };
    return titles[product.id] ?? product.shortTitle;
}
function chunk(items, size) {
    const chunks = [];
    for(let index = 0; index < items.length; index += size){
        chunks.push(items.slice(index, index + size));
    }
    return chunks;
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0p-e81g._.js.map