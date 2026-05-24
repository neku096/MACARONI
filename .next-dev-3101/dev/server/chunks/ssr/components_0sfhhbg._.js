module.exports = [
"[project]/components/ProductCard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCard",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
;
;
function ProductCard({ product, variant = "card", title, label, coverImage, alt, href, priority = false, boothTags, boothSubtags, popularity }) {
    const cardTitle = title ?? product.shortTitle;
    const cardLabel = label ?? getLegacyProductLabel(product);
    const cardHref = href ?? `/products/${product.slug}`;
    const image = getCoverSet(coverImage ?? product.coverImage);
    const imageAlt = alt ?? cardTitle;
    if (variant === "booth-thumb") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            className: "booth-list-thumb",
            href: cardHref,
            prefetch: false,
            "data-booth-tags": boothTags,
            "data-booth-subtags": boothSubtags,
            "data-popularity": popularity,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        className: "product-card",
        href: cardHref,
        prefetch: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                children: cardTitle
            }, void 0, false, {
                fileName: "[project]/components/ProductCard.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
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
"[project]/components/ProductCatalog.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductCatalog",
    ()=>ProductCatalog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ProductCard.tsx [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const pageSize = 12;
const categoryFilters = [
    {
        id: "all",
        label: "すべて"
    },
    {
        id: "pose",
        label: "ポーズ"
    },
    {
        id: "universal",
        label: "汎用"
    },
    {
        id: "solo",
        label: "一人用"
    },
    {
        id: "material",
        label: "マテリアル"
    }
];
const characterOptions = [
    {
        label: "愛莉",
        value: "愛莉",
        search: "あいり airi"
    },
    {
        label: "イチゴ",
        value: "イチゴ",
        search: "いちご ichigo"
    },
    {
        label: "エク",
        value: "エク",
        search: "えく eku"
    },
    {
        label: "クマリ",
        value: "クマリ",
        search: "くまり kumaly kumari"
    },
    {
        label: "しお",
        value: "しお",
        search: "しお sio shio"
    },
    {
        label: "しなの",
        value: "しなの",
        search: "しなの shinano"
    },
    {
        label: "ショコラ",
        value: "ショコラ",
        search: "しょこら chocolat chocolate"
    },
    {
        label: "セレスティア",
        value: "セレスティア",
        search: "せれすてぃあ selestia celestia"
    },
    {
        label: "プラム",
        value: "プラム",
        search: "ぷらむ plum"
    },
    {
        label: "マヌカ",
        value: "マヌカ",
        search: "まぬか manuka"
    },
    {
        label: "真冬",
        value: "真冬",
        search: "まふゆ mafuyu"
    },
    {
        label: "まよ",
        value: "まよ",
        search: "まよ mayo"
    },
    {
        label: "ミルティナ",
        value: "ミルティナ",
        search: "みるてぃな milltina"
    },
    {
        label: "ミルフィ",
        value: "ミルフィ",
        search: "みるふぃ milfy"
    },
    {
        label: "萌",
        value: "萌",
        search: "もえ moe"
    },
    {
        label: "ラシューシャ",
        value: "ラシューシャ",
        search: "らしゅーしゃ lasyusha"
    },
    {
        label: "ラムネ",
        value: "ラムネ",
        search: "らむね ramune"
    },
    {
        label: "りりか",
        value: "りりか",
        search: "りりか ririka"
    },
    {
        label: "ルミナ",
        value: "ルミナ",
        search: "るみな lumina"
    },
    {
        label: "ルルネ",
        value: "ルルネ",
        search: "るるね rurune"
    }
];
const characterSubtagsByAvatar = {
    愛莉: "character-airi",
    イチゴ: "character-ichigo",
    エク: "character-eku",
    クマリ: "character-kumaly",
    しお: "character-sio",
    しなの: "character-shinano",
    ショコラ: "character-chocolat",
    セレスティア: "character-selestia",
    プラム: "character-plum",
    マヌカ: "character-manuka",
    真冬: "character-mafuyu",
    まよ: "character-mayo",
    ミルティナ: "character-milltina",
    ミルフィ: "character-milfy",
    萌: "character-moe",
    ラシューシャ: "character-lasyusha",
    ラムネ: "character-ramune",
    りりか: "character-ririka",
    ルミナ: "character-lumina",
    ルルネ: "character-rurune"
};
const avatarByCharacterSubtag = Object.fromEntries(Object.entries(characterSubtagsByAvatar).map(([avatar, subtag])=>[
        subtag,
        avatar
    ]));
const popularityById = {
    "sexy-pose-kumaly": 115,
    "sexy-pose-plum-chocolat": 233,
    "sexy-pose-ramune": 125,
    "sexy-pose-eku": 229,
    "sexy-pose-lumina": 226,
    "sexy-pose-ichigo": 296,
    "sexy-pose-shinano": 355,
    "sexy-pose-milltina": 413,
    "sexy-pose-rurune": 227,
    "sexy-motion-vol1": 880,
    "sexy-attack-motion-vol1": 178,
    "sexy-motion-attack-vol2": 567,
    "foot-motion": 369,
    "hand-motion": 404,
    "bj-motion": 375,
    "solo-motion-vol1": 884,
    "solo-motion-vol2": 790,
    "solo-motion-vol3": 532,
    "solo-motion-vol4": 135,
    "dosukebe-material": 387
};
function ProductCatalog({ products, avatars }) {
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const queryCategory = normalizeCategoryParam(searchParams.get("category") ?? searchParams.get("tag"));
    const queryAvatar = normalizeAvatarParam(searchParams.get("subtag") ?? searchParams.get("avatar"));
    const [category, setCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(queryCategory);
    const [avatar, setAvatar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(queryAvatar);
    const [sortMode, setSortMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("default");
    const [page, setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSubtagOpen, setIsSubtagOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [subtagSearch, setSubtagSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const catalogItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>buildCatalogItems(products), [
        products
    ]);
    const avatarSet = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>new Set(avatars), [
        avatars
    ]);
    const availableCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>characterOptions.filter((option)=>avatarSet.has(option.value)), [
        avatarSet
    ]);
    const filteredCharacters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const normalizedSearch = subtagSearch.trim().toLowerCase();
        if (!normalizedSearch) {
            return availableCharacters;
        }
        return availableCharacters.filter((option)=>`${option.label} ${option.search}`.toLowerCase().includes(normalizedSearch));
    }, [
        availableCharacters,
        subtagSearch
    ]);
    const filteredItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const items = catalogItems.filter((item)=>{
            const matchesCategory = category === "all" || item.category === category;
            const matchesAvatar = avatar === "all" || item.avatars.includes(avatar);
            return matchesCategory && matchesAvatar;
        });
        if (sortMode === "popular") {
            return [
                ...items
            ].sort((a, b)=>b.popularity - a.popularity || a.title.localeCompare(b.title, "ja"));
        }
        return items;
    }, [
        avatar,
        catalogItems,
        category,
        sortMode
    ]);
    const pageCount = Math.max(1, Math.ceil(filteredItems.length / pageSize));
    const safePage = Math.min(page, pageCount - 1);
    const visibleItems = filteredItems.slice(safePage * pageSize, safePage * pageSize + pageSize);
    const selectedAvatarLabel = avatar === "all" ? "すべて" : avatar;
    function updateCategory(nextCategory) {
        setCategory(nextCategory);
        setPage(0);
    }
    function updateAvatar(nextAvatar) {
        setAvatar(nextAvatar);
        setPage(0);
        setIsSubtagOpen(false);
    }
    function updateSort(nextSortMode) {
        setSortMode(nextSortMode);
        setPage(0);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "list-page-intro booth-list-intro",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "booth-list-intro-copy",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: [
                                    "VRChat・Unity向け",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/components/ProductCatalog.tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this),
                                    "R18 3D素材一覧"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 177,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "ポーズ・モーション・マテリアル素材をサムネイルから確認できます。"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 176,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "booth-sort-tabs",
                        role: "group",
                        "aria-label": "BOOTH作品表示順",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `booth-sort-button${sortMode === "default" ? " is-active" : ""}`,
                                type: "button",
                                "aria-pressed": sortMode === "default",
                                onClick: ()=>updateSort("default"),
                                children: "通常順"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `booth-sort-button${sortMode === "popular" ? " is-active" : ""}`,
                                type: "button",
                                "aria-pressed": sortMode === "popular",
                                onClick: ()=>updateSort("popular"),
                                children: "人気順"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 193,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "booth-filter-panel",
                "data-booth-filter": true,
                "data-count-suffix": "件",
                "data-page-size": pageSize,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "booth-filter-heading",
                        children: "種類"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "booth-filter-tabs",
                        role: "group",
                        "aria-label": "BOOTH作品タグ絞り込み",
                        children: categoryFilters.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `booth-filter-button${category === option.id ? " is-active" : ""}`,
                                type: "button",
                                "data-booth-filter-button": option.id,
                                "aria-pressed": category === option.id,
                                onClick: ()=>updateCategory(option.id),
                                children: option.label
                            }, option.id, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "booth-filter-status booth-list-count",
                        "data-booth-filter-status": true,
                        "aria-live": "polite",
                        children: [
                            filteredItems.length,
                            "件"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 204,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `booth-subtag-panel${isSubtagOpen ? " is-subtag-search-open" : ""}`,
                id: "booth-subtags",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "booth-subtag-heading",
                        children: "対応キャラ"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "booth-subtag-mobile-controls",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "booth-subtag-mobile-label",
                                children: "対応キャラ"
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: `booth-subtag-picker-toggle${avatar !== "all" ? " is-selected" : ""}`,
                                type: "button",
                                "aria-expanded": isSubtagOpen,
                                "aria-controls": "booth-subtag-options",
                                onClick: ()=>setIsSubtagOpen((current)=>!current),
                                children: selectedAvatarLabel
                            }, void 0, false, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 227,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `booth-subtag-picker${isSubtagOpen ? " is-open" : ""}`,
                        id: "booth-subtag-options",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "booth-subtag-search-panel",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "booth-subtag-search-header",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "booth-subtag-search-label",
                                                htmlFor: "booth-subtag-search",
                                                children: "対応キャラ検索"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductCatalog.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "booth-subtag-popover-close",
                                                type: "button",
                                                "aria-label": "対応キャラ検索を閉じる",
                                                onClick: ()=>setIsSubtagOpen(false),
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductCatalog.tsx",
                                                lineNumber: 245,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductCatalog.tsx",
                                        lineNumber: 241,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "booth-subtag-search-field",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "booth-subtag-search-icon",
                                                "aria-hidden": "true"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductCatalog.tsx",
                                                lineNumber: 255,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                className: "booth-subtag-search",
                                                id: "booth-subtag-search",
                                                type: "search",
                                                placeholder: "キャラ名で検索…",
                                                autoComplete: "off",
                                                inputMode: "search",
                                                value: subtagSearch,
                                                onChange: (event)=>setSubtagSearch(event.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductCatalog.tsx",
                                                lineNumber: 256,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "booth-subtag-search-clear",
                                                type: "button",
                                                "aria-label": "検索文字列をクリア",
                                                onClick: ()=>setSubtagSearch(""),
                                                hidden: !subtagSearch,
                                                children: "×"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ProductCatalog.tsx",
                                                lineNumber: 266,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ProductCatalog.tsx",
                                        lineNumber: 254,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "booth-subtag-empty",
                                        hidden: filteredCharacters.length > 0,
                                        children: "該当するキャラがありません"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductCatalog.tsx",
                                        lineNumber: 276,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "booth-subtag-tabs",
                                role: "group",
                                "aria-label": "対応キャラ絞り込み",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `booth-subtag-button${avatar === "all" ? " is-active" : ""}`,
                                        type: "button",
                                        "data-booth-subtag-button": "all",
                                        "data-booth-subtag-search-text": "全部 all",
                                        "aria-pressed": avatar === "all",
                                        onClick: ()=>updateAvatar("all"),
                                        children: "すべて"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ProductCatalog.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this),
                                    filteredCharacters.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `booth-subtag-button${avatar === option.value ? " is-active" : ""}`,
                                            type: "button",
                                            "data-booth-subtag-button": getCharacterSubtag(option.value),
                                            "data-booth-subtag-search-text": `${option.label} ${option.search}`,
                                            "aria-pressed": avatar === option.value,
                                            onClick: ()=>updateAvatar(option.value),
                                            children: option.label
                                        }, option.value, false, {
                                            fileName: "[project]/components/ProductCatalog.tsx",
                                            lineNumber: 292,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ProductCatalog.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "booth-subtag-row-toggle",
                        type: "button",
                        "aria-expanded": isSubtagOpen,
                        "aria-controls": "booth-subtag-options",
                        "aria-label": isSubtagOpen ? "対応キャラ検索を閉じる" : "対応キャラ検索を開く",
                        onClick: ()=>setIsSubtagOpen((current)=>!current),
                        children: isSubtagOpen ? "対応キャラを検索 ▲" : "対応キャラを検索 ▼"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 306,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 225,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "booth-list-grid",
                "data-booth-list": true,
                children: visibleItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ProductCard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ProductCard"], {
                        alt: item.title,
                        boothSubtags: item.avatars.map(getCharacterSubtag).join(" "),
                        boothTags: getBoothTags(item),
                        coverImage: item.coverImage,
                        popularity: item.popularity,
                        priority: safePage === 0 && index === 0,
                        product: item.product,
                        title: item.title,
                        variant: "booth-thumb"
                    }, item.key, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            visibleItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "booth-list-help",
                children: "条件に合う商品がありません。"
            }, void 0, false, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 335,
                columnNumber: 36
            }, this) : null,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "booth-pagination",
                "aria-label": "BOOTH作品ページ切り替え",
                hidden: pageCount <= 1,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "booth-page-button",
                        type: "button",
                        disabled: safePage === 0,
                        onClick: ()=>setPage((current)=>Math.max(0, current - 1)),
                        children: "前へ"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "booth-page-status",
                        "aria-live": "polite",
                        children: [
                            safePage + 1,
                            " / ",
                            pageCount
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "booth-page-button",
                        type: "button",
                        disabled: safePage >= pageCount - 1,
                        onClick: ()=>setPage((current)=>Math.min(pageCount - 1, current + 1)),
                        children: "次へ"
                    }, void 0, false, {
                        fileName: "[project]/components/ProductCatalog.tsx",
                        lineNumber: 349,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ProductCatalog.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
function buildCatalogItems(products) {
    return products.flatMap((product)=>{
        const baseItem = {
            product,
            category: getCatalogCategory(product),
            popularity: popularityById[product.id] ?? 0
        };
        if (product.id === "sexy-pose-plum-chocolat") {
            return [
                {
                    ...baseItem,
                    key: `${product.id}-chocolat`,
                    title: "ショコラ用 セクシーポーズ15種＋表情5種",
                    coverImage: "/products/covers/CH-800.webp",
                    avatars: [
                        "ショコラ"
                    ]
                },
                {
                    ...baseItem,
                    key: `${product.id}-plum`,
                    title: "プラム用 セクシーポーズ15種＋表情5種",
                    coverImage: "/products/covers/PL-800.webp",
                    avatars: [
                        "プラム"
                    ]
                }
            ];
        }
        return [
            {
                ...baseItem,
                key: product.id,
                title: product.shortTitle,
                coverImage: product.coverImage,
                avatars: product.avatars
            }
        ];
    });
}
function getCatalogCategory(product) {
    if (product.category === "motion") {
        return "universal";
    }
    if (product.category === "solo-motion") {
        return "solo";
    }
    return product.category;
}
function normalizeCategoryParam(value) {
    const key = value?.trim().toLowerCase();
    switch(key){
        case "pose":
            return "pose";
        case "motion":
        case "universal":
        case "universal-motion":
            return "universal";
        case "solo":
        case "solo-motion":
        case "solo_h":
        case "solo-h":
            return "solo";
        case "material":
            return "material";
        default:
            return "all";
    }
}
function normalizeAvatarParam(value) {
    const key = value?.trim();
    if (!key || key === "all") {
        return "all";
    }
    let decodedKey = key;
    try {
        decodedKey = decodeURIComponent(key);
    } catch  {
        decodedKey = key;
    }
    const normalizedSubtag = decodedKey.toLowerCase();
    const avatarFromSubtag = avatarByCharacterSubtag[normalizedSubtag];
    if (avatarFromSubtag) {
        return avatarFromSubtag;
    }
    return characterOptions.some((option)=>option.value === decodedKey) ? decodedKey : "all";
}
function getBoothTags(item) {
    const tags = [
        item.category
    ];
    if (item.product.category === "motion" || item.product.category === "solo-motion") {
        tags.push("motion");
    }
    if (item.product.tags.includes("表情付き")) {
        tags.push("expression");
    }
    return tags.join(" ");
}
function getCharacterSubtag(avatar) {
    return characterSubtagsByAvatar[avatar] ?? "";
}
}),
];

//# sourceMappingURL=components_0sfhhbg._.js.map